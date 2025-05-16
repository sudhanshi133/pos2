package com.increff.pos.dto;

import com.increff.pos.api.ProductApi;
import com.increff.pos.api.ClientApi;
import com.increff.pos.api.InventoryApi;
import com.increff.pos.helpers.exception.ApiException;
import com.increff.pos.flow.ProductFlow;
import com.increff.pos.model.form.ProductForm;
import com.increff.pos.model.data.ProductListData;
import com.increff.pos.model.data.ResponseListData;
import com.increff.pos.pojo.ProductPojo;
import com.increff.pos.pojo.ClientPojo;
import com.increff.pos.pojo.InventoryPojo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.*;

import static com.increff.pos.helpers.util.NormalizeUtil.normalize;

@Service
@Transactional
public class ProductDto {
    private static final Logger logger = LoggerFactory.getLogger(ProductDto.class);

    @Autowired
    private ProductApi productApi;
    @Autowired
    private ProductFlow productFlow;
    @Autowired
    private ClientApi clientApi;
    @Autowired
    private InventoryApi inventoryApi;

    public ResponseListData insertProductMasterList(List<ProductForm> productForms) throws ApiException {
        ResponseListData responseListData = new ResponseListData();
        List<ResponseListData.ResponseData> successList = new ArrayList<>();
        List<ResponseListData.ResponseData> failureList = new ArrayList<>();

        for (ProductForm form : productForms) {
            try {
                // Validate the form
                if (form == null) {
                    addToFailureList(failureList, "null", "Form cannot be null");
                    continue;
                }

                // Check if barcode already exists
                ProductPojo existingProduct = productApi.getByBarcode(form.getBarcode());
                if (existingProduct != null) {
                    addToFailureList(failureList, form.getBarcode(), "Product with barcode already exists");
                    continue;
                }

                // Try to insert the product
                productFlow.validateAndInsertProduct(form);
                
                // If successful, add to success list
                ResponseListData.ResponseData successData = new ResponseListData.ResponseData();
                successData.setBarcode(form.getBarcode());
                successData.setMessage("Successfully added product");
                successList.add(successData);
                
                logger.info("Successfully added product with barcode: {}", form.getBarcode());
            } catch (ApiException e) {
                // Handle known API exceptions
                addToFailureList(failureList, form.getBarcode(), e.getMessage());
                logger.error("Error adding product with barcode {}: {}", form.getBarcode(), e.getMessage());
            } catch (Exception e) {
                // Handle unexpected exceptions
                addToFailureList(failureList, form.getBarcode(), "Unexpected error: " + e.getMessage());
                logger.error("Unexpected error adding product with barcode {}: {}", form.getBarcode(), e.getMessage());
            }
        }

        // Set the final lists
        responseListData.setSuccessList(successList);
        responseListData.setFailureList(failureList);
        
        logger.info("Bulk upload completed. Success: {}, Failures: {}", 
            successList.size(), failureList.size());
        
        return responseListData;
    }

    private void addToFailureList(List<ResponseListData.ResponseData> failureList, String barcode, String message) {
        ResponseListData.ResponseData failureData = new ResponseListData.ResponseData();
        failureData.setBarcode(barcode);
        failureData.setMessage(message);
        failureList.add(failureData);
    }

    public void insertSingleProduct(ProductForm form) throws ApiException {
            productFlow.validateAndInsertProduct(form);
        }

    public ProductListData getAllProducts(int page, int size) throws ApiException {
       return productFlow.getAllProducts(page,size);
    }

    public void updateProduct(String barcode, ProductForm form) throws ApiException {
        if (Objects.isNull(barcode)) {
            throw new ApiException("Barcode cannot be null");
        }
        if (Objects.isNull(form)) {
            throw new ApiException("Form cannot be null");
        }

        try {
            ProductPojo product = productApi.getByBarcode(barcode);
            if (Objects.isNull(product)) {
                throw new ApiException("Product not found with barcode: " + barcode);
            }

            // Only validate and normalize fields that are being updated
            if (Objects.nonNull(form.getProductName())) {
                if (form.getProductName().trim().isEmpty()) {
                    throw new ApiException("Product name cannot be empty");
                }
                if (form.getProductName().length() > 100) {
                    throw new ApiException("Product name must not exceed 100 characters");
                }
                product.setProductName(form.getProductName().trim().toLowerCase());
            }

            if (Objects.nonNull(form.getUrl())) {
                product.setUrl(form.getUrl().trim());
            }

            if (Objects.nonNull(form.getMrp())) {
                if (form.getMrp() < 0) {
                    throw new ApiException("MRP cannot be negative");
                }
                product.setMrp(form.getMrp().doubleValue());
            }

            productApi.updateProduct(product);
        } catch (ApiException e) {
            logger.error("Error updating product: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error("Unexpected error updating product: {}", e.getMessage());
            throw new ApiException("Error updating product: " + e.getMessage());
        }
    }

    public ProductListData searchProducts(String productName, String barcode, int page, int size) throws ApiException {
     List<ProductPojo> list = productApi.searchProducts(barcode,productName, page, size);
     return convertPojoToListData(list);
    }

    public ProductListData convertPojoToListData(List<ProductPojo> list) throws ApiException {
        try {
            logger.info("Converting {} products to list data", list.size());
        ProductListData dataList = new ProductListData();
            List<ProductListData.ProductData> productDataList = new ArrayList<>();
            
        for (ProductPojo pojo : list) {
                if (pojo == null) {
                    logger.warn("Found null product in list, skipping");
                    continue;
                }
                
                try {
                    String clientName = "Unknown Client";
                    try {
                        ClientPojo client = clientApi.getClientById(pojo.getClientId());
                        if (client != null) {
                            clientName = client.getClientName();
                        } else {
                            logger.warn("Client not found for product ID: {}", pojo.getProductId());
                        }
                    } catch (Exception e) {
                        logger.error("Error getting client for product {}: {}", pojo.getProductId(), e.getMessage());
                    }

                    Integer quantity = 0;
                    try {
                        InventoryPojo inventory = inventoryApi.getQuantityByProductId(pojo.getProductId());
                        if (inventory != null) {
                            quantity = inventory.getQuantity();
                        } else {
                            logger.warn("Inventory not found for product ID: {}", pojo.getProductId());
                        }
                    } catch (Exception e) {
                        logger.error("Error getting inventory for product {}: {}", pojo.getProductId(), e.getMessage());
                    }

            ProductListData.ProductData data = new ProductListData.ProductData();
            data.setProductName(pojo.getProductName());
            data.setBarcode(pojo.getBarcode());
            data.setUrl(pojo.getUrl());
            data.setMrp(pojo.getMrp());
                    data.setClientName(clientName);
                    data.setQuantity(quantity);
                    productDataList.add(data);
                } catch (Exception e) {
                    logger.error("Error converting product {} to data: {}", pojo.getProductId(), e.getMessage());
                }
            }
            
            dataList.setProducts(productDataList);
            logger.info("Successfully converted {} products to list data", productDataList.size());
            return dataList;
        } catch (Exception e) {
            logger.error("Error converting products to list data: {}", e.getMessage());
            throw new ApiException("Error converting products to list data: " + e.getMessage());
        }
    }
}
