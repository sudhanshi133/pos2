package com.increff.pos.model.data;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RevenueListData {
    List<RevenueData> list = new ArrayList<>();
    
    @Getter
    @Setter
    @NoArgsConstructor
    public static class RevenueData {
        private String clientName;
        private String productName;
        private String barcode;
        private Long totalQuantity;
        private Double totalRevenue;

        public RevenueData(String clientName, String productName, String barcode, Long totalQuantity, Double totalRevenue) {
            this.clientName = clientName;
            this.productName = productName;
            this.barcode = barcode;
            this.totalQuantity = totalQuantity;
            this.totalRevenue = totalRevenue;
        }
    }
}
