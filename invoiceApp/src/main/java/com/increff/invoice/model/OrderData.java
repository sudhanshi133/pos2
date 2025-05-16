package com.increff.invoice.model;

import java.util.List;
import com.increff.invoice.model.enums.OrderStatus;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrderData {
    private Integer id;
    private String time;
    private OrderStatus status;
    private List<OrderItemData> items;
    private String customerName;
    private String customerContact;
    private Double totalAmount;
} 