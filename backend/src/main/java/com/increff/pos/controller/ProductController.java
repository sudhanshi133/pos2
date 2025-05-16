package com.increff.pos.controller;

import com.increff.pos.dto.ProductDto;
import com.increff.pos.helpers.exception.ApiException;
import com.increff.pos.model.data.ProductListData;
import com.increff.pos.model.data.ResponseListData;
import com.increff.pos.model.form.ProductForm;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@RestController
@RequestMapping("/api/product")
@Transactional(rollbackFor = Exception.class)
public class ProductController {
    private static final Logger logger = LoggerFactory.getLogger(ProductController.class);

    @Autowired
    private ProductDto productDto;

    // 1. Create product master in bulk
    @RequestMapping(value = "/bulk-create", method = RequestMethod.POST)
    public ResponseListData createProductMaster(@RequestBody List<ProductForm> productForms) throws ApiException {
        return productDto.insertProductMasterList(productForms);
    }

    // 3. Get all products
    @RequestMapping(value = "/get", method = RequestMethod.GET)
    public ProductListData getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) throws ApiException {
        return productDto.getAllProducts(page, size);
    }

    @RequestMapping(value = "/update/{barcode}", method = RequestMethod.PUT)
    @Transactional(rollbackFor = Exception.class)
    public void updateProduct(@PathVariable String barcode, @RequestBody ProductForm form) throws ApiException {
        logger.info("Received update request for barcode: {}", barcode);
        logger.info("Update form data: {}", form);
        
        try {
            productDto.updateProduct(barcode, form);
            logger.info("Successfully updated product with barcode: {}", barcode);
        } catch (ApiException e) {
            logger.error("Error processing update request: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error("Unexpected error during update: {}", e.getMessage());
            throw new ApiException("Error updating product: " + e.getMessage());
        }
    }

    // 5. Search products with filters
    @RequestMapping(value = "/search", method = RequestMethod.GET)
    public ProductListData searchProductByName(
            @RequestParam(required = false) String productName,
            @RequestParam(required = false) String barcode) throws ApiException {
        return productDto.searchProducts(productName, barcode, 0,12);
    }

    //6 for inserting a single product
    @RequestMapping(value = "/create", method = RequestMethod.POST)
    public void createProduct(@RequestBody ProductForm productForm) throws ApiException {
        productDto.insertSingleProduct(productForm); // New method for adding a single product
    }
}
