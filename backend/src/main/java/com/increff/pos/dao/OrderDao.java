package com.increff.pos.dao;

import com.increff.pos.helpers.exception.ApiException;
import com.increff.pos.pojo.OrderPojo;
import org.springframework.stereotype.Repository;
import javax.transaction.Transactional;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;
import javax.persistence.TypedQuery;
import java.util.List;

@Repository
@Transactional
public class OrderDao extends AbstractDao<OrderPojo>{
    @PersistenceContext
    private EntityManager em;

    public OrderDao() throws ApiException {
        super(OrderPojo.class);
    }

    public List<OrderPojo> selectAllPaginated(int page, int size) throws ApiException {
        try {
            CriteriaBuilder cb = em.getCriteriaBuilder();
            CriteriaQuery<OrderPojo> cq = cb.createQuery(OrderPojo.class);
            Root<OrderPojo> root = cq.from(OrderPojo.class);
            cq.select(root);
            return em.createQuery(cq)
                    .setFirstResult(page * size)
                    .setMaxResults(size)
                    .getResultList();
        } catch (Exception e) {
            throw new ApiException("Error fetching paginated orders: " + e.getMessage());
        }
    }

    public Long getOrderCount() {
        TypedQuery<Long> query = getQuery("SELECT COUNT(p) FROM OrderPojo p", Long.class);
        return query.getSingleResult();
    }

    public List<OrderPojo> getRecentOrders() {
        TypedQuery<OrderPojo> query = getQuery("SELECT p FROM OrderPojo p ORDER BY p.orderTime DESC", OrderPojo.class);
        query.setMaxResults(5); // Get last 5 orders
        return query.getResultList();
    }
}
