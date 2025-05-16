package com.increff.pos.model.form;


import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

@Getter
@Setter
public class ProductForm {

    @NotBlank(message = "Product name must not be blank")
    @Size(max = 100, message = "Product name must not exceed 100 characters")
    private String productName;

    @NotBlank(message = "Barcode must not be blank")
    private String barcode;

    private String url;

    @NotNull(message = "MRP is required")
    @Min(value = 0, message = "MRP cannot be negative")
    private Integer mrp;

    @NotBlank(message = "Client name must not be blank")
    private String clientName;

    @Min(value = 0, message = "Quantity cannot be negative")
    private Integer quantity = 0;
}
