package com.increff.pos.helpers.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.util.List;

@Getter
@ResponseStatus(HttpStatus.BAD_REQUEST)
public class ApiException extends Exception {

    private ApiStatus status;
    private List<ErrorDataList> fieldErrors;

    // Basic constructor
    //TODO ADD STATUS
    public ApiException(String message) {
        super(message);
    }

    // Constructor for validation errors
    public ApiException(String message, List<ErrorDataList> fieldErrors) {
        super(message);
        this.status = status;
        this.fieldErrors = fieldErrors;
    }

}
