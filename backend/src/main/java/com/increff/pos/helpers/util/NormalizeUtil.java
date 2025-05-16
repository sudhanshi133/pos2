package com.increff.pos.helpers.util;

import com.increff.pos.helpers.exception.ApiException;
import com.increff.pos.model.form.OrderItemForm;
import com.increff.pos.model.form.*;
import com.increff.pos.pojo.ClientPojo;
import com.increff.pos.pojo.ProductPojo;

public class NormalizeUtil {

    //TODO to use java relections


    public static void normalize(OrderItemForm form) {
        if (form.getBarcode() != null) {
            form.setBarcode(form.getBarcode().trim().toLowerCase());
        }
    }

    public static void normalize(ClientPojo pojo) {
        if (pojo.getClientName() != null) {
            pojo.setClientName(pojo.getClientName().trim().toLowerCase());
        }
    }

    public static void normalize(ClientForm form) throws ApiException {
        if (form.getClientName() != null) {
            String name = form.getClientName().trim().toLowerCase();
            if (!name.matches("[a-z0-9 ]+")) {
                throw new ApiException("Client name must not contain special characters.");
            }
            form.setClientName(name);
        }
    }


    public static void normalize(InventoryForm form) {
        if (form.getBarcode() != null) {
            form.setBarcode(form.getBarcode().trim().toLowerCase());
        }
    }

    public static void normalize(ProductPojo pojo) {
        if (pojo.getProductName() != null) {
            pojo.setProductName(pojo.getProductName().trim().toLowerCase());
        }
        if (pojo.getBarcode() != null) {
            pojo.setBarcode(pojo.getBarcode().trim().toLowerCase());
        }
        if (pojo.getUrl() != null) {
            pojo.setUrl(pojo.getUrl().trim());
        }
        pojo.setMrp(Math.round(pojo.getMrp() * 100.0) / 100.0);
    }

    public static void normalize(ProductForm form) {
        if (form.getProductName() != null) {
            form.setProductName(form.getProductName().trim().toLowerCase());
        }
        if (form.getUrl() != null) {
            form.setUrl(form.getUrl().trim());
        }
        if (form.getMrp()>=0) {
            form.setMrp(form.getMrp());
        }
    }

    public static void normalize(OrderForm form) {
        if (form.getClientName() != null) {
            form.setClientName(form.getClientName().trim());
        }
        if (form.getClientPhone() != null) {
            form.setClientPhone(form.getClientPhone().trim());
        }
        if (form.getItems() != null) {
            form.setItems(form.getItems());
        }
    }
}
