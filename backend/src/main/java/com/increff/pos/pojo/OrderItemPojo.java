package com.increff.pos.pojo;

import lombok.Getter;
import lombok.Setter;
import javax.persistence.*;

@Getter
@Setter
@Entity
@Table(name = "OrderItem", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"orderId", "productId"}, name = "unique_product_in_order")
})
public class OrderItemPojo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer itemId;

    @Column(nullable = false)
    private Double sellingPrice;

    @Column(name = "orderId", nullable = false)
    private Integer orderId;

    @Column(nullable = false)
    private Integer productId;

    @Column(name = "quantity", nullable = false)
    private int quantity;
}
