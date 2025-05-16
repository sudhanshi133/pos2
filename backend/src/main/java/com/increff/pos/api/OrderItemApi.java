package com.increff.pos.api;

import com.increff.pos.dao.AbstractDao;
import com.increff.pos.dao.OrderItemDao;
import com.increff.pos.pojo.OrderItemPojo;
import com.increff.pos.helpers.exception.ApiException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Objects;

@Service
@Transactional
public class OrderItemApi extends AbstractApi<OrderItemPojo> {

    @Autowired
    private OrderItemDao orderItemDao;

    @Override
    protected AbstractDao<OrderItemPojo> getDao() {
        return orderItemDao;
    }

    public void createOrderItem(OrderItemPojo orderItemPojo) throws ApiException {
        if (Objects.isNull(orderItemPojo)) {
            throw new ApiException("OrderItemPojo cannot be null");
        }
        try {
            orderItemDao.insert(orderItemPojo);
        } catch (Exception e) {
            throw new ApiException("Error creating order item: " + e.getMessage());
        }
    }


    public List<OrderItemPojo> getAllOrderItemsByOrderId(Integer orderId) throws ApiException {
        if (Objects.isNull(orderId)) {
            throw new ApiException("Order ID cannot be null");
        }
        try {
            List<OrderItemPojo> items = orderItemDao.selectByOrderId(orderId);
            for (OrderItemPojo item : items) {
                if (!orderId.equals(item.getOrderId())) {
                    throw new ApiException("Mismatched order ID in order item");
                }
            }
            return items;
        } catch (Exception e) {
            throw new ApiException("Error fetching order items: " + e.getMessage());
        }
    }
}
