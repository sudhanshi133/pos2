package com.increff.pos.helpers;

import com.increff.pos.helpers.exception.ApiException;
import org.springframework.stereotype.Component;

import java.util.Objects;


public class InventoryDtoHelper {

    public static void validateBarcodeQuantity(String barcode, int quantity) throws ApiException {
        validateBarcode(barcode);
        validateQuantity(quantity);
    }

    public static void validateBarcode(String barcode) throws ApiException {
        if (Objects.isNull(barcode)) {
            throw new ApiException("Barcode must not be empty");
        }
    }

    public static void validateQuantity(int quantity) throws ApiException {
        if (quantity < 0) {
            throw new ApiException("Quantity cannot be negative");
        }
        if (quantity != Math.floor(quantity)) {
            throw new ApiException("Quantity must be a whole number");
        }
    }

    public static void normalizeBarcode(String barcode) throws ApiException {
      barcode.trim().toLowerCase();
    }

}