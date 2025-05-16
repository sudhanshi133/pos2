package com.increff.pos.helpers;

import com.increff.pos.api.OrderApi;
import com.increff.pos.api.OrderItemApi;
import com.increff.pos.helpers.exception.ApiException;
import com.increff.pos.model.form.OrderItemForm;
import com.increff.pos.pojo.OrderItemPojo;
import com.increff.pos.pojo.OrderPojo;
import com.increff.pos.pojo.ProductPojo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.sql.Timestamp;

public class OrderDtoHelper {

    public static OrderPojo createNewOrder(String clientName, String phoneNumber) throws ApiException {
        if (clientName == null || clientName.trim().isEmpty()) {
            throw new ApiException("Client name cannot be empty");
        }
        if (phoneNumber == null || phoneNumber.trim().isEmpty()) {
            throw new ApiException("Phone number cannot be empty");
        }
        OrderPojo order = new OrderPojo();
        order.setOrderTime(new Timestamp(System.currentTimeMillis()));
        order.setClientName(clientName.trim());
        order.setPhoneNumber(phoneNumber.trim());
        return order;
    }
    public static OrderItemPojo getOrderItemPojo(Integer orderId, ProductPojo product, OrderItemForm orderItemForm) {
        OrderItemPojo orderItem = new OrderItemPojo();
        orderItem.setOrderId(orderId);
        orderItem.setProductId(product.getProductId());
        orderItem.setQuantity(orderItemForm.getQuantity());
        orderItem.setSellingPrice(product.getMrp());
        return orderItem;
    }
}