package com.increff.pos.model.data;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class OrderItemListData {
    private List<OrderItemData> orderItems;
    @Getter
    @Setter
    public static class OrderItemData {
        private Integer itemId;
        private String productName;
        private int quantity;
        private double sellingPrice;
        private double totalPrice;
        private String barcode;
    }
}
