package com.increff.pos.model.data;

import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class ResponseListData {
    private List<ResponseData> successList = new ArrayList<>();
    private List<ResponseData> failureList = new ArrayList<>();
    @Getter
    @Setter
    public static class ResponseData {
        private String message;
        private String barcode;
    }
} 