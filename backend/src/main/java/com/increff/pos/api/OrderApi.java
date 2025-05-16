package com.increff.pos.api;

import com.increff.pos.dao.AbstractDao;
import com.increff.pos.dao.OrderDao;
import com.increff.pos.helpers.exception.ApiException;
import com.increff.pos.pojo.OrderPojo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;

@Service
@Transactional
public class OrderApi extends AbstractApi<OrderPojo> {

    @Autowired
    private OrderDao orderDao;

    @Override
    protected AbstractDao<OrderPojo> getDao() {
        return orderDao;
    }

    public void createOrder(OrderPojo orderPojo) throws ApiException {
        if (Objects.isNull(orderPojo)) {
            throw new ApiException("OrderPojo cannot be null");
        }
        try {
            orderDao.insert(orderPojo);
        } catch (Exception e) {
            throw new ApiException("Error creating order: " + e.getMessage());
        }
    }


    public OrderPojo getOrderById(Integer orderId) throws ApiException {
        if (Objects.isNull(orderId)) {
            throw new ApiException("Order ID cannot be null");
        }
        OrderPojo order = orderDao.select(orderId);
        if (Objects.isNull(order)) {
            throw new ApiException("Order with ID " + orderId + " not found");
        }
        return order;
    }


    public List<OrderPojo> getAllOrders() throws ApiException {
        try {
            return orderDao.selectAll();
        } catch (Exception e) {
            throw new ApiException("Error fetching orders: " + e.getMessage());
        }
    }

    public List<OrderPojo> getAllOrdersPaginated(int page, int size) throws ApiException {
        if (page < 0) {
            throw new ApiException("Page number cannot be negative");
        }
        if (size <= 0) {
            throw new ApiException("Page size must be positive");
        }
        try {
            return orderDao.selectAllPaginated(page, size);
        } catch (Exception e) {
            throw new ApiException("Error fetching paginated orders: " + e.getMessage());
        }
    }

    public void insertOrder(OrderPojo orderPojo) {
        orderDao.insert(orderPojo);
    }
}
