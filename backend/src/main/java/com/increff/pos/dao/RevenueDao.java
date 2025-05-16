package com.increff.pos.dao;
import com.increff.pos.model.data.DailyRevenueData;
import com.increff.pos.model.data.RevenueListData;
import com.increff.pos.model.form.SalesReportFilterForm;
import com.increff.pos.pojo.ClientPojo;
import com.increff.pos.pojo.OrderItemPojo;
import com.increff.pos.pojo.OrderPojo;
import com.increff.pos.pojo.ProductPojo;
import com.increff.pos.helpers.exception.ApiException;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.criteria.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Objects;

@Repository
@Transactional(readOnly = true)
public class RevenueDao {
    @PersistenceContext
    private EntityManager entityManager;

    private Date toDate(LocalDateTime localDateTime) {
        return Date.from(localDateTime.atZone(ZoneId.systemDefault()).toInstant());
    }

    public List<RevenueListData.RevenueData> getMonthlyProductRevenue() {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<RevenueListData.RevenueData> query = cb.createQuery(RevenueListData.RevenueData.class);
        
        // Start with OrderPojo as the root
        Root<OrderPojo> order = query.from(OrderPojo.class);
        Root<OrderItemPojo> orderItem = query.from(OrderItemPojo.class);
        Root<ProductPojo> product = query.from(ProductPojo.class);
        Root<ClientPojo> client = query.from(ClientPojo.class);

        // Join conditions using the actual field names
        Predicate join1 = cb.equal(orderItem.get("orderId"), order.get("orderId"));
        Predicate join2 = cb.equal(orderItem.get("productId"), product.get("productId"));
        Predicate join3 = cb.equal(product.get("clientId"), client.get("clientId"));

        // Get current month's start and end dates
        LocalDate now = LocalDate.now();
        LocalDate startOfMonth = now.withDayOfMonth(1);
        LocalDate endOfMonth = now.withDayOfMonth(now.lengthOfMonth());

        // Add date range filter
        Predicate dateStart = cb.greaterThanOrEqualTo(order.get("orderTime"), toDate(startOfMonth.atStartOfDay()));
        Predicate dateEnd = cb.lessThanOrEqualTo(order.get("orderTime"), toDate(endOfMonth.atTime(23, 59, 59)));

        // Combine all predicates
        List<Predicate> predicates = new ArrayList<>();
        predicates.add(join1);
        predicates.add(join2);
        predicates.add(join3);
        predicates.add(dateStart);
        predicates.add(dateEnd);

        // Aggregations
        Expression<Long> totalQty = cb.sum(orderItem.get("quantity"));
        Expression<Double> totalRevenue = cb.sum(cb.prod(orderItem.get("quantity"), orderItem.get("sellingPrice")));

        // Select and group by
        query.select(cb.construct(
                RevenueListData.RevenueData.class,
                client.get("clientName").as(String.class),
                product.get("productName").as(String.class),
                product.get("barcode").as(String.class),
                cb.toLong(totalQty),
                cb.toDouble(totalRevenue)
        ))
        .where(cb.and(predicates.toArray(new Predicate[0])))
        .groupBy(
            client.get("clientName"),
            product.get("productName"),
            product.get("barcode")
        )
        .orderBy(cb.desc(totalRevenue));

        return entityManager.createQuery(query).getResultList();
    }

    public List<RevenueListData.RevenueData> getFilteredSalesReport(SalesReportFilterForm form) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<RevenueListData.RevenueData> query = cb.createQuery(RevenueListData.RevenueData.class);
        
        Root<OrderPojo> order = query.from(OrderPojo.class);
        Root<OrderItemPojo> orderItem = query.from(OrderItemPojo.class);
        Root<ProductPojo> product = query.from(ProductPojo.class);
        Root<ClientPojo> client = query.from(ClientPojo.class);

        // Join conditions
        Predicate join1 = cb.equal(orderItem.get("orderId"), order.get("orderId"));
        Predicate join2 = cb.equal(orderItem.get("productId"), product.get("productId"));
        Predicate join3 = cb.equal(product.get("clientId"), client.get("clientId"));

        List<Predicate> predicates = new ArrayList<>();
        predicates.add(join1);
        predicates.add(join2);
        predicates.add(join3);

        // Add date range filter
        predicates.add(cb.greaterThanOrEqualTo(order.get("orderTime"), toDate(form.getStartDate().atStartOfDay())));
        predicates.add(cb.lessThanOrEqualTo(order.get("orderTime"), toDate(form.getEndDate().atTime(23, 59, 59))));

        // Add client name filter if provided
        if (!Objects.isNull(form.getClientName()) && !form.getClientName().isEmpty()) {
            predicates.add(cb.equal(client.get("clientName"), form.getClientName()));
        }

        // Aggregations
        Expression<Long> totalQty = cb.sum(orderItem.get("quantity"));
        Expression<Double> totalRevenue = cb.sum(cb.prod(orderItem.get("quantity"), orderItem.get("sellingPrice")));

        // Select and group by
        query.select(cb.construct(
                RevenueListData.RevenueData.class,
                client.get("clientName").as(String.class),
                product.get("productName").as(String.class),
                product.get("barcode").as(String.class),
                cb.toLong(totalQty),
                cb.toDouble(totalRevenue)
        ))
        .where(cb.and(predicates.toArray(new Predicate[0])))
        .groupBy(
            client.get("clientName"),
            product.get("productName"),
            product.get("barcode")
        )
        .orderBy(cb.desc(totalRevenue));

        return entityManager.createQuery(query).getResultList();
    }

    public List<DailyRevenueData> getDailyRevenue(LocalDate startDate, LocalDate endDate) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<DailyRevenueData> query = cb.createQuery(DailyRevenueData.class);

        Root<OrderPojo> order = query.from(OrderPojo.class);
        Root<OrderItemPojo> orderItem = query.from(OrderItemPojo.class);

        Predicate join = cb.equal(orderItem.get("orderId"), order.get("orderId"));
        Predicate dateStart = cb.greaterThanOrEqualTo(order.get("orderTime"), toDate(startDate.atStartOfDay()));
        Predicate dateEnd = cb.lessThanOrEqualTo(order.get("orderTime"), toDate(endDate.atTime(23, 59, 59)));

        Expression<Date> dateExpr = cb.function("DATE", Date.class, order.get("orderTime"));
        Expression<Long> orderCount = cb.countDistinct(order.get("orderId"));
        Expression<Long> totalItems = cb.sum(orderItem.get("quantity"));
        Expression<Double> revenue = cb.sum(cb.prod(orderItem.get("quantity"), orderItem.get("sellingPrice")));

        query.select(cb.construct(DailyRevenueData.class, dateExpr, orderCount, totalItems, revenue))
                .where(cb.and(join, dateStart, dateEnd))
                .groupBy(dateExpr)
                .orderBy(cb.asc(dateExpr));

        return entityManager.createQuery(query).getResultList();
    }
}



