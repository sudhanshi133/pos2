package com.increff.pos.model.form;
import lombok.Getter;
import lombok.Setter;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Min;

@Getter
@Setter
public class OrderItemForm {
    @NotBlank(message = "Barcode is required")
    private String barcode;
    
    @Min(value = 1, message = "Quantity must be at least 1")
    private int quantity;
}
