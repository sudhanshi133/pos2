package com.increff.pos.model.data;

import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class OrderListData {
 List<OrderData> orders = new ArrayList<>();
 @Getter
 @Setter
 public static class OrderData {
  private Integer orderId;
  private String orderTime;
  private List<OrderItemListData.OrderItemData> orderItems;
  private double totalPrice;
  private String name;
  private String phoneNumber;
 }
}
