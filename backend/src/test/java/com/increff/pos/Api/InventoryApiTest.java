/*
package com.increff.pos.Api;

import com.increff.pos.dao.InventoryDao;
import com.increff.pos.exception.ApiException;
import com.increff.pos.pojo.InventoryPojo;
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
public class InventoryApiTest {

    @InjectMocks
    private InventoryApi inventoryApi;

    @Mock
    private InventoryDao inventoryDao;

    private static final Integer TEST_INVENTORY_ID = 1;
    private static final Integer TEST_PRODUCT_ID = 1;
    private static final Integer TEST_QUANTITY = 100;

    @Before
    public void init() {
        MockitoAnnotations.openMocks(this);
    }

    private InventoryPojo createInventoryPojo() {
        InventoryPojo pojo = new InventoryPojo();
        pojo.setId(TEST_INVENTORY_ID);
        pojo.setProductId(TEST_PRODUCT_ID);
        pojo.setQuantity(TEST_QUANTITY);
        return pojo;
    }

    @Test
    public void testAddInventory() throws ApiException {
        InventoryPojo pojo = createInventoryPojo();
        doNothing().when(inventoryDao).insert(any(InventoryPojo.class));
        
        inventoryApi.addInventory(pojo);
        verify(inventoryDao).insert(any(InventoryPojo.class));
    }

    @Test
    public void testGetInventoryById() throws ApiException {
        InventoryPojo pojo = createInventoryPojo();
        when(inventoryDao.selectById(TEST_INVENTORY_ID)).thenReturn(pojo);
        
        InventoryPojo result = inventoryApi.getInventoryById(TEST_INVENTORY_ID);
        assertNotNull("Inventory should not be null", result);
        assertEquals("Inventory ID should match", TEST_INVENTORY_ID, result.getId());
        assertEquals("Product ID should match", TEST_PRODUCT_ID, result.getProductId());
        assertEquals("Quantity should match", TEST_QUANTITY, result.getQuantity());
    }

    @Test
    public void testGetInventoryById_NotFound() throws ApiException {
        when(inventoryDao.selectById(TEST_INVENTORY_ID)).thenReturn(null);
        
        InventoryPojo result = inventoryApi.getInventoryById(TEST_INVENTORY_ID);
        assertNull("Inventory should be null", result);
    }

    @Test
    public void testGetAllInventory() throws ApiException {
        List<InventoryPojo> inventoryList = Collections.singletonList(createInventoryPojo());
        when(inventoryDao.selectAll()).thenReturn(inventoryList);
        
        List<InventoryPojo> result = inventoryApi.getAllInventory();
        assertEquals("Should have one inventory record", 1, result.size());
        assertEquals("Quantity should match", TEST_QUANTITY, result.get(0).getQuantity());
    }

    @Test
    public void testGetAllInventoryPaginated() throws ApiException {
        List<InventoryPojo> inventoryList = Collections.singletonList(createInventoryPojo());
        when(inventoryDao.selectAllPaginated(0, 10)).thenReturn(inventoryList);
        
        List<InventoryPojo> result = inventoryApi.getAllInventoryPaginated(0, 10);
        assertEquals("Should have one inventory record", 1, result.size());
        assertEquals("Quantity should match", TEST_QUANTITY, result.get(0).getQuantity());
    }

    @Test
    public void testUpdateInventory() throws ApiException {
        InventoryPojo pojo = createInventoryPojo();
        doNothing().when(inventoryDao).update(any(InventoryPojo.class));
        
        inventoryApi.updateInventory(TEST_INVENTORY_ID, pojo);
        verify(inventoryDao).update(any(InventoryPojo.class));
    }

    @Test
    public void testUpdateInventory_NotFound() throws ApiException {
        InventoryPojo pojo = createInventoryPojo();
        when(inventoryDao.selectById(TEST_INVENTORY_ID)).thenReturn(null);
        
        assertThrows(ApiException.class, () -> {
            inventoryApi.updateInventory(TEST_INVENTORY_ID, pojo);
        });
    }

    @Test
    public void testAddInventory_NullProductId() throws ApiException {
        InventoryPojo pojo = createInventoryPojo();
        pojo.setProductId(null);
        
        assertThrows(ApiException.class, () -> {
            inventoryApi.addInventory(pojo);
        });
    }

    @Test
    public void testAddInventory_NullQuantity() throws ApiException {
        InventoryPojo pojo = createInventoryPojo();
        pojo.setQuantity(null);
        
        assertThrows(ApiException.class, () -> {
            inventoryApi.addInventory(pojo);
        });
    }

    @Test
    public void testAddInventory_NegativeQuantity() throws ApiException {
        InventoryPojo pojo = createInventoryPojo();
        pojo.setQuantity(-100);
        
        assertThrows(ApiException.class, () -> {
            inventoryApi.addInventory(pojo);
        });
    }
}
*/ 