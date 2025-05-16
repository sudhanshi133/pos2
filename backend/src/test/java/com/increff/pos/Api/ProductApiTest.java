/*
package com.increff.pos.Api;

import com.increff.pos.dao.ProductDao;
import com.increff.pos.exception.ApiException;
import com.increff.pos.pojo.ProductPojo;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.test.annotation.DirtiesContext;
import org.mockito.InjectMocks;

import static org.junit.Assert.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

import java.util.List;
import java.util.ArrayList;
import java.util.Collections;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = {"classpath:spring-test.xml"})
@WebAppConfiguration
@Transactional
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
public class ProductApiTest {

    @InjectMocks
    private ProductApi productApi;

    @Mock
    private ProductDao productDao;

    private static final Integer TEST_PRODUCT_ID = 1;
    private static final String TEST_BARCODE = "1234567890";
    private static final String TEST_NAME = "Test Product";
    private static final Double TEST_MRP = 100.0;
    private static final Integer TEST_BRAND_CATEGORY_ID = 1;

    @Before
    public void init() {
        MockitoAnnotations.openMocks(this);
    }

    private ProductPojo createProductPojo() {
        ProductPojo pojo = new ProductPojo();
        pojo.setId(TEST_PRODUCT_ID);
        pojo.setBarcode(TEST_BARCODE);
        pojo.setName(TEST_NAME);
        pojo.setMrp(TEST_MRP);
        pojo.setBrandCategoryId(TEST_BRAND_CATEGORY_ID);
        return pojo;
    }

    @Test
    public void testAddProduct() throws ApiException {
        ProductPojo pojo = createProductPojo();
        doNothing().when(productDao).insert(any(ProductPojo.class));
        
        productApi.addProduct(pojo);
        verify(productDao).insert(any(ProductPojo.class));
    }

    @Test
    public void testGetProductById() throws ApiException {
        ProductPojo pojo = createProductPojo();
        when(productDao.selectById(TEST_PRODUCT_ID)).thenReturn(pojo);
        
        ProductPojo result = productApi.getProductById(TEST_PRODUCT_ID);
        assertNotNull("Product should not be null", result);
        assertEquals("Product ID should match", TEST_PRODUCT_ID, result.getId());
        assertEquals("Barcode should match", TEST_BARCODE, result.getBarcode());
        assertEquals("Name should match", TEST_NAME, result.getName());
        assertEquals("MRP should match", TEST_MRP, result.getMrp());
        assertEquals("Brand Category ID should match", TEST_BRAND_CATEGORY_ID, result.getBrandCategoryId());
    }

    @Test
    public void testGetProductById_NotFound() throws ApiException {
        when(productDao.selectById(TEST_PRODUCT_ID)).thenReturn(null);
        
        ProductPojo result = productApi.getProductById(TEST_PRODUCT_ID);
        assertNull("Product should be null", result);
    }

    @Test
    public void testGetAllProducts() throws ApiException {
        List<ProductPojo> productList = Collections.singletonList(createProductPojo());
        when(productDao.selectAll()).thenReturn(productList);
        
        List<ProductPojo> result = productApi.getAllProducts();
        assertEquals("Should have one product record", 1, result.size());
        assertEquals("Name should match", TEST_NAME, result.get(0).getName());
    }

    @Test
    public void testGetAllProductsPaginated() throws ApiException {
        List<ProductPojo> productList = Collections.singletonList(createProductPojo());
        when(productDao.selectAllPaginated(0, 10)).thenReturn(productList);
        
        List<ProductPojo> result = productApi.getAllProductsPaginated(0, 10);
        assertEquals("Should have one product record", 1, result.size());
        assertEquals("Name should match", TEST_NAME, result.get(0).getName());
    }

    @Test
    public void testUpdateProduct() throws ApiException {
        ProductPojo pojo = createProductPojo();
        doNothing().when(productDao).update(any(ProductPojo.class));
        
        productApi.updateProduct(TEST_PRODUCT_ID, pojo);
        verify(productDao).update(any(ProductPojo.class));
    }

    @Test
    public void testUpdateProduct_NotFound() throws ApiException {
        ProductPojo pojo = createProductPojo();
        when(productDao.selectById(TEST_PRODUCT_ID)).thenReturn(null);
        
        assertThrows(ApiException.class, () -> {
            productApi.updateProduct(TEST_PRODUCT_ID, pojo);
        });
    }

    @Test
    public void testAddProduct_NullBarcode() throws ApiException {
        ProductPojo pojo = createProductPojo();
        pojo.setBarcode(null);
        
        assertThrows(ApiException.class, () -> {
            productApi.addProduct(pojo);
        });
    }

    @Test
    public void testAddProduct_EmptyBarcode() throws ApiException {
        ProductPojo pojo = createProductPojo();
        pojo.setBarcode("");
        
        assertThrows(ApiException.class, () -> {
            productApi.addProduct(pojo);
        });
    }

    @Test
    public void testAddProduct_NullName() throws ApiException {
        ProductPojo pojo = createProductPojo();
        pojo.setName(null);
        
        assertThrows(ApiException.class, () -> {
            productApi.addProduct(pojo);
        });
    }

    @Test
    public void testAddProduct_EmptyName() throws ApiException {
        ProductPojo pojo = createProductPojo();
        pojo.setName("");
        
        assertThrows(ApiException.class, () -> {
            productApi.addProduct(pojo);
        });
    }

    @Test
    public void testAddProduct_NullMrp() throws ApiException {
        ProductPojo pojo = createProductPojo();
        pojo.setMrp(null);
        
        assertThrows(ApiException.class, () -> {
            productApi.addProduct(pojo);
        });
    }

    @Test
    public void testAddProduct_NegativeMrp() throws ApiException {
        ProductPojo pojo = createProductPojo();
        pojo.setMrp(-100.0);
        
        assertThrows(ApiException.class, () -> {
            productApi.addProduct(pojo);
        });
    }

    @Test
    public void testAddProduct_NullBrandCategoryId() throws ApiException {
        ProductPojo pojo = createProductPojo();
        pojo.setBrandCategoryId(null);
        
        assertThrows(ApiException.class, () -> {
            productApi.addProduct(pojo);
        });
    }
}
*/ 