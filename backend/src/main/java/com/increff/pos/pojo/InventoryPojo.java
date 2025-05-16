package com.increff.pos.pojo;

import lombok.Getter;
import lombok.Setter;
import javax.persistence.*;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "inventory")
public class InventoryPojo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer inventoryId;
    //todo add unique constraint
    @Column(nullable = false)
    private Integer productId;
    @Column( nullable=false)
    private Integer quantity;

}
