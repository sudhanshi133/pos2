package com.increff.pos.helpers;

import com.increff.pos.helpers.exception.ApiException;
import com.increff.pos.model.data.ProductListData;
import com.increff.pos.model.form.ProductForm;
import com.increff.pos.pojo.ClientPojo;
import com.increff.pos.pojo.ProductPojo;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
public class ProductDtoHelper {
    public static void checkProductExists(ProductPojo productPojo, String barcode) throws ApiException {
        if (Objects.isNull(productPojo)) {
            throw new ApiException("Product with barcode '" + barcode + "' not found");
        }
    }

    public static void updateProductDetails(ProductPojo productPojo, ProductForm form) throws ApiException {
        if (Objects.isNull(productPojo)) {
            throw new ApiException("Product cannot be null");
        }
        if (Objects.isNull(form)) {
            throw new ApiException("Form cannot be null");
        }

        if (Objects.nonNull(form.getProductName())) {
            if (form.getProductName().trim().isEmpty()) {
                throw new ApiException("Product name cannot be empty");
            }
            if (form.getProductName().length() > 100) {
                throw new ApiException("Product name must not exceed 100 characters");
            }
            productPojo.setProductName(form.getProductName().trim().toLowerCase());
        }

        if (Objects.nonNull(form.getUrl())) {
            productPojo.setUrl(form.getUrl().trim());
        }

        if (Objects.nonNull(form.getMrp())) {
            if (form.getMrp() < 0) {
                throw new ApiException("MRP cannot be negative");
            }
            productPojo.setMrp(form.getMrp().doubleValue());
        }
    }

    public static ProductPojo convertToPojo(ProductForm form, ClientPojo client) throws ApiException {
        if (Objects.isNull(form)) {
            throw new ApiException("Product form cannot be null");
        }
        if (Objects.isNull(client)) {
            throw new ApiException("Client cannot be null");
        }
        if (Objects.isNull(form.getProductName()) || form.getProductName().trim().isEmpty()) {
            throw new ApiException("Product name cannot be null or empty");
        }
        if (Objects.isNull(form.getBarcode()) || form.getBarcode().trim().isEmpty()) {
            throw new ApiException("Barcode cannot be null or empty");
        }
        if (Objects.isNull(form.getMrp())) {
            throw new ApiException("MRP cannot be null");
        }

        ProductPojo productPojo = new ProductPojo();
        productPojo.setClientId(client.getClientId());
        productPojo.setProductName(form.getProductName().trim());
        productPojo.setBarcode(form.getBarcode().trim());
        productPojo.setUrl(form.getUrl() != null ? form.getUrl().trim() : "");
        productPojo.setMrp(form.getMrp().doubleValue());
        return productPojo;
    }

    public static void checkValid(ProductPojo product) throws ApiException {
        if (Objects.isNull(product.getProductName()) || product.getProductName().trim().isEmpty()) {
            throw new ApiException("Product name cannot be empty");
        }
        if (Objects.isNull(product.getBarcode()) || product.getBarcode().trim().isEmpty()) {
            throw new ApiException("Product barcode cannot be empty");
        }
        if (Objects.isNull(product.getMrp()) || product.getMrp() <= 0) {
            throw new ApiException("Product MRP must be greater than zero");
        }
    }

    public static List<ProductListData.ProductData> convertToProductDataList(List<ProductPojo> products) throws ApiException{
        List<ProductListData.ProductData> productDataList = new ArrayList<>();
        for (ProductPojo productPojo : products) {
            productDataList.add(convertToProductData(productPojo)); // Reuse the single object conversion
        }
        return productDataList;
    }

    public  static ProductListData convertToProductListData(List<ProductPojo> products)throws ApiException {
        List<ProductListData.ProductData> productsData = convertToProductDataList(products); // Use the new method to convert list
        ProductListData productListData = new ProductListData();
        productListData.setProducts(productsData);
        return productListData;
    }
    public static ProductListData.ProductData convertToProductData(ProductPojo productPojo) throws ApiException {
        return convertToProductData(productPojo, "", 0);
    }

    public static ProductListData.ProductData convertToProductData(ProductPojo productPojo, String clientName,
                                                                   Integer inv) throws ApiException {
        ProductListData.ProductData productData = new ProductListData.ProductData();
        productData.setProductName(productPojo.getProductName());
        productData.setBarcode(productPojo.getBarcode());
        productData.setUrl(productPojo.getUrl());
        productData.setMrp(productPojo.getMrp());
        productData.setClientName(clientName);
        productData.setQuantity(inv);
        return productData;
    }
}

