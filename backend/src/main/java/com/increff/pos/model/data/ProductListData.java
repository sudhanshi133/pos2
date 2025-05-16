package com.increff.pos.model.data;

import lombok.Getter;
import lombok.Setter;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class ProductListData {
    List<ProductData> products = new ArrayList<>();

    @Getter
    @Setter
    public static class ProductData {
        private String productName;
        private String barcode;
        private String url;
        private String clientName;
        private Double mrp;
        private Integer quantity;
    }
}
