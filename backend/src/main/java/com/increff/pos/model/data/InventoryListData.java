package com.increff.pos.model.data;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class InventoryListData {
    private List<InventoryData> inventories;
    @Getter
    @Setter
    public static class InventoryData {
        private String barcode;
        private Integer quantity;
    }
}

