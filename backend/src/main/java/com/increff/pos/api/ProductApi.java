package com.increff.pos.api;

import com.increff.pos.dao.AbstractDao;
import com.increff.pos.dao.ProductDao;
import com.increff.pos.helpers.exception.ApiException;
import com.increff.pos.pojo.ProductPojo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;
import java.time.ZonedDateTime;

@Service
@Transactional(rollbackFor = Exception.class)
public class ProductApi extends AbstractApi<ProductPojo>{
    private static final Logger logger = LoggerFactory.getLogger(ProductApi.class);

    @Autowired
    private ProductDao productDao;

    @Override
    protected AbstractDao<ProductPojo> getDao() {
        return productDao;
    }

    public ProductPojo getById(Integer id) throws ApiException {
        logger.info("Getting product by ID: {}", id);
        if (Objects.isNull(id)) {
            logger.error("Product ID is null");
            throw new ApiException("Product ID cannot be null");
        }
        return getByField("productId", id);
    }

    public void updateProduct(ProductPojo updatedProduct) throws ApiException {
        logger.info("Starting product update for product ID: {}", updatedProduct != null ? updatedProduct.getProductId() : "null");
        
        if (Objects.isNull(updatedProduct)) {
            throw new ApiException("Product cannot be null");
        }
        if (Objects.isNull(updatedProduct.getProductId())) {
            throw new ApiException("Product ID cannot be null");
        }
        
        try {
            ProductPojo current = getById(updatedProduct.getProductId());
            if (Objects.isNull(current)) {
                throw new ApiException("Product not found with ID: " + updatedProduct.getProductId());
            }
            
            // Update only non-null fields
            if (Objects.nonNull(updatedProduct.getProductName())) {
                current.setProductName(updatedProduct.getProductName().trim().toLowerCase());
            }
            if (Objects.nonNull(updatedProduct.getMrp())) {
                current.setMrp(updatedProduct.getMrp());
            }
            if (Objects.nonNull(updatedProduct.getUrl())) {
                current.setUrl(updatedProduct.getUrl().trim());
            }
            
            // Update timestamp
            current.setUpdatedAt(ZonedDateTime.now());
            
            update(current);
            logger.info("Successfully updated product: {}", current.getProductId());
        } catch (Exception e) {
            logger.error("Error updating product: {}", e.getMessage());
            throw new ApiException("Error updating product: " + e.getMessage());
        }
    }

    public void insertProduct(ProductPojo productPojo) throws ApiException {
        insert(productPojo);
    }

    public ProductPojo getByBarcode(String barcode) throws ApiException {
        logger.info("Getting product by barcode: {}", barcode);
        return getByField("barcode", barcode);
    }

    // this is a direct call
    public List<ProductPojo> searchProducts(String barcode, String productName, int page, int size) throws ApiException {
        System.out.println("API: Starting search - barcode: " + barcode + ", productName: " + productName);
        if (barcode != null) {
            barcode = barcode.trim().toLowerCase();
        }
        if (productName != null) {
            productName = productName.trim().toLowerCase();
        }
        System.out.println("API: Calling DAO with - barcode: " + barcode + ", productName: " + productName);
        List<ProductPojo> results = productDao.searchProducts(barcode, productName, page, size);
        System.out.println("API: Search results count: " + results.size());
        return results;
    }

    @Transactional(readOnly = true)
    public List<ProductPojo> getAllProducts(int page, int size) {
        return productDao.getAllProducts(page, size);
    }

}
