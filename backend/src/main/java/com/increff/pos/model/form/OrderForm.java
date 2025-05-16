package com.increff.pos.model.form;

import lombok.Getter;
import lombok.Setter;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
public class OrderForm {
    @NotEmpty(message = "Order must contain at least one item")
    private List<OrderItemForm> items;
    @NotBlank(message = "Client name is required")
    private String clientName;
    @NotBlank(message = "Client phone is required")
    private String clientPhone;
}
