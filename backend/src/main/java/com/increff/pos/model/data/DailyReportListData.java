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
public class DailyReportListData {
        List<DailyReportData> list = new ArrayList<>();

        public DailyReportListData(String string, Long orderCount, Long totalItems, Double revenue) {
        }

        @Getter
        @Setter
        public static class DailyReportData {
                private String date;
                private Long orderCount;
                private Long totalItems;
                private Double revenue;
        }
}