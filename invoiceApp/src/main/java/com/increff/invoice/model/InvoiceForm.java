package com.increff.invoice.model;

import lombok.Getter;
import lombok.NonNull;
import lombok.Setter;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

@Getter
@Setter
public class InvoiceForm {

    @NotNull(message = "Order ID is required")
    private int orderId;

    @NotBlank(message = "Customer name is required")
    @Size(max = 100, message = "Customer name must be at most 100 characters")
    private String customerName;

    @NotBlank(message = "Customer contact is required")
    @Size(max = 15, message = "Customer contact must be at most 15 characters")
    private String customerContact;

    @NotNull(message = "Total amount is required")
    private Double totalAmount;
}

