package com.increff.pos.flow;

import com.increff.pos.api.ClientApi;
import com.increff.pos.api.InventoryApi;
import com.increff.pos.api.ProductApi;
import com.increff.pos.helpers.exception.ApiException;
import com.increff.pos.helpers.ProductDtoHelper;
import com.increff.pos.model.data.ProductListData;
import com.increff.pos.model.form.ProductForm;
import com.increff.pos.pojo.ClientPojo;
import com.increff.pos.pojo.InventoryPojo;
import com.increff.pos.pojo.ProductPojo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import static com.increff.pos.helpers.ProductDtoHelper.checkValid;
import static com.increff.pos.helpers.ProductDtoHelper.convertToPojo;
import static com.increff.pos.helpers.util.NormalizeUtil.normalize;
import static com.increff.pos.helpers.util.ValidationUtil.validate;

@Service
public class ProductFlow {
    private static final Logger logger = LoggerFactory.getLogger(ProductFlow.class);

    @Autowired
    private ProductApi productApi;
    @Autowired
    private ClientApi clientApi;
    @Autowired
    private InventoryApi inventoryApi;

    public ProductListData getAllProducts(int page, int size) throws ApiException {
        try {
            logger.info("Getting all products with page={}, size={}", page, size);
            
            // Get products from database
            List<ProductPojo> products;
            try {
                products = productApi.getAllProducts(page, size);
                if (products == null) {
                    logger.warn("No products found in database");
                    return new ProductListData();
                }
            } catch (Exception e) {
                logger.error("Error getting products from database: {}", e.getMessage());
                throw new ApiException("Error getting products from database: " + e.getMessage());
            }
            
            List<ProductListData.ProductData> productDataList = new ArrayList<>();
            
            for (ProductPojo productPojo : products) {
                if (Objects.isNull(productPojo)) {
                    logger.warn("Found null product in list, skipping");
                    continue;
                }
                
                String clientName = "Unknown Client";
                try {
                    ClientPojo client = clientApi.getClientById(productPojo.getClientId());
                    if (Objects.nonNull(client)) {
                        clientName = client.getClientName();
                    } else {
                        logger.warn("Client not found for product ID: {}", productPojo.getProductId());
                    }
                } catch (Exception e) {
                    logger.error("Error getting client for product {}: {}", productPojo.getProductId(), e.getMessage());
            }

                Integer quantity = 0;
                try {
            InventoryPojo inventory = inventoryApi.getQuantityByProductId(productPojo.getProductId());
                    if (Objects.nonNull(inventory)) {
                        quantity = inventory.getQuantity();
                    } else {
                        logger.warn("Inventory not found for product ID: {}", productPojo.getProductId());
                    }
                } catch (Exception e) {
                    logger.error("Error getting inventory for product {}: {}", productPojo.getProductId(), e.getMessage());
                    // Continue with quantity as 0 instead of throwing exception
                }

                try {
            ProductListData.ProductData productData = ProductDtoHelper.convertToProductData(
                            productPojo, clientName, quantity
            );
            productDataList.add(productData);
                } catch (Exception e) {
                    logger.error("Error converting product to data: {}", e.getMessage());
                }
        }
            
        ProductListData productListData = new ProductListData();
        productListData.setProducts(productDataList);
            logger.info("Successfully retrieved {} products", productDataList.size());
        return productListData;
        } catch (Exception e) {
            logger.error("Error getting all products: {}", e.getMessage());
            throw new ApiException("Error getting all products: " + e.getMessage());
        }
    }

    public void validateAndInsertProduct(ProductForm form) throws ApiException {
        if (Objects.isNull(form)) {
            throw new ApiException("Product form cannot be null");
        }
        if (Objects.isNull(form.getClientName()) || form.getClientName().trim().isEmpty()) {
            throw new ApiException("Client name cannot be null or empty");
        }
        ClientPojo client = clientApi.getClientByName(form.getClientName());
        validate(client);
        normalize(client);
        if (Objects.isNull(client)) {
            throw new ApiException("Client with name '" + form.getClientName() + "' does not exist");
        }
            ProductPojo pojo = convertToPojo(form, client);
        checkValid(pojo);
        validate(client);
        normalize(pojo);
        productApi.insertProduct(pojo);
        InventoryPojo inventoryPojo = new InventoryPojo();
        inventoryPojo.setProductId(pojo.getProductId());
        inventoryPojo.setQuantity(form.getQuantity() != null ? form.getQuantity() : 0);
        inventoryApi.insertInventory(inventoryPojo);
    }
}
