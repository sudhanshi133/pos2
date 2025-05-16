package com.increff.pos.pojo;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Getter
@Setter
@Entity
@Table(name = "products")
public class ProductPojo extends AbstractVersionedPojo{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer productId;
    @Column(nullable = false)
    private String productName;
    @Column(nullable = false)
    private String url;
    @Column(unique = true, nullable = false)
    private String barcode;
    @Column( nullable = false)
    private Double mrp;
    @Column( nullable = false)
    private Integer clientId;
}
