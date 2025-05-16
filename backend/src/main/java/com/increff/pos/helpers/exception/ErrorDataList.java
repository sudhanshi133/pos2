package com.increff.pos.helpers.exception;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ErrorDataList {
    private String field;
    private String message;
    private String code;
}
