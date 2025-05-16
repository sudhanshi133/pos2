package com.increff.pos.controller;

import com.increff.pos.dto.InventoryDto;
import com.increff.pos.helpers.exception.ApiException;
import com.increff.pos.model.form.InventoryForm;
import com.increff.pos.model.data.InventoryListData;
import com.increff.pos.model.data.ResponseListData;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/inventory")
public class InventoryController {

    @Autowired
    private InventoryDto inventoryDto;

    // 1. View all inventory (GET method)
    @RequestMapping(value = "/get", method = RequestMethod.GET)
    public InventoryListData getInventory() throws ApiException {
        return inventoryDto.getAllInventory();
    }

    // 2. Bulk edit inventory (POST method with JSON body)
    @RequestMapping(value = "/bulk-update", method = RequestMethod.PUT)
    public ResponseListData bulkUpdateInventory(@RequestBody List<InventoryForm> inventoryForms) throws ApiException {
        return inventoryDto.bulkUpdateInventory(inventoryForms);
    }

    // 3. Edit a single product inventory (PUT method)
    @RequestMapping(value = "/update/{barcode}", method = RequestMethod.PUT)
    public void updateInventory(@PathVariable String barcode, @RequestBody InventoryForm form) throws ApiException {
        inventoryDto.updateInventoryByBarcode(barcode, form);
    }
}