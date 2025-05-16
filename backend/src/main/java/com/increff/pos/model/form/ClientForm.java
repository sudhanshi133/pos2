package com.increff.pos.model.form;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@Getter
@Setter
public class ClientForm {
    @NotBlank(message = "Client name must not be blank")
    @Size(max = 100, message = "Client name must not exceed 100 characters")
    private String clientName;
}