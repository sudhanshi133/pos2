//package com.increff.pos.dto;
//
//import com.increff.pos.api.ClientApi;
//import com.increff.pos.api.InventoryApi;
//import com.increff.pos.api.ProductApi;
//import com.increff.pos.dto.DtoHelper;
//import com.increff.pos.exception.ApiException;
//import com.increff.pos.flow.InventoryFlow;
//import com.increff.pos.model.data.BulkInventoryData;
//import com.increff.pos.model.data.InventoryData;
//import com.increff.pos.model.data.OperationResponse;
//import com.increff.pos.model.form.InventoryForm;
//import com.increff.pos.pojo.ClientPojo;
//import com.increff.pos.pojo.InventoryPojo;
//import com.increff.pos.pojo.ProductPojo;
//import org.junit.Before;
//import org.junit.Test;
//import org.junit.runner.RunWith;
//import org.mockito.Mock;
//import org.mockito.MockitoAnnotations;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.test.context.ContextConfiguration;
//import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
//import org.springframework.test.context.web.WebAppConfiguration;
//import org.springframework.transaction.annotation.Transactional;
//import org.springframework.test.annotation.DirtiesContext;
//import org.mockito.InjectMocks;
//
//import static org.junit.Assert.*;
//import static org.mockito.ArgumentMatchers.any;
//import static org.mockito.ArgumentMatchers.argThat;
//import static org.mockito.ArgumentMatchers.eq;
//import static org.mockito.Mockito.*;
//
//import java.util.List;
//import java.util.ArrayList;
//import java.util.Collections;
//
//@RunWith(SpringJUnit4ClassRunner.class)
//@ContextConfiguration(locations = {"classpath:spring-test.xml"})
//@WebAppConfiguration
//@Transactional
//@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
//public class InventoryTest {
//
//    @InjectMocks
//    private InventoryDto inventoryDto;
//
//    @Mock
//    private InventoryApi inventoryApi;
//
//    @Mock
//    private InventoryFlow inventoryFlow;
//
//    @Mock
//    private ProductApi productApi;
//
//    @Mock¯
//    private ClientApi clientApi;
//
//    private static final String TEST_BARCODE = "TEST123";
//    private static final String TEST_CLIENT = "Nike";
//    private static final Integer TEST_CLIENT_ID = 1;
//    private static final Integer TEST_PRODUCT_ID = 1;
//
//    @Before
//    public void init() throws ApiException {
//        MockitoAnnotations.openMocks(this);
//        ClientPojo client = new ClientPojo();
//        client.setId(TEST_CLIENT_ID);
//        client.setClientName(TEST_CLIENT);
//        when(clientApi.getClientById(TEST_CLIENT_ID)).thenReturn(client);
//        ProductPojo product = createProductPojo();
//        when(productApi.getByBarcode(TEST_BARCODE)).thenReturn(product);
//        when(productApi.getByBarcode(TEST_BARCODE.toLowerCase())).thenReturn(product);
//        when(inventoryFlow.getProductByBarcode(TEST_BARCODE)).thenReturn(product);
//        when(inventoryFlow.getProductIdFromForm(argThat(form -> form.getProductBarcode().equals(TEST_BARCODE))))
//            .thenReturn(TEST_PRODUCT_ID);
//        InventoryPojo inventory = createInventoryPojo();
//        when(inventoryApi.getByProductId(TEST_PRODUCT_ID)).thenReturn(inventory);
//    }
//
//    private ProductPojo createProductPojo() {
//        ProductPojo product = new ProductPojo();
//        product.setId(TEST_PRODUCT_ID);
//        product.setBarcode(TEST_BARCODE);
//        product.setName("Test Product");
//        product.setMrp(100.0);
//        product.setClientId(TEST_CLIENT_ID);
//        return product;
//    }
//
//    private InventoryForm createInventoryForm(String barcode, Integer quantity) {
//        InventoryForm form = new InventoryForm();
//        form.setProductBarcode(barcode);
//        form.setQuantity(quantity);
//        return form;
//    }
//
//    private InventoryPojo createInventoryPojo() {
//        InventoryPojo pojo = new InventoryPojo();
//        pojo.setId(1);
//        pojo.setProductId(TEST_PRODUCT_ID);
//        pojo.setQuantity(10);
//        return pojo;
//    }
//
//    @Test
//    public void testAddInventory() throws ApiException {
//        InventoryForm form = createInventoryForm(TEST_BARCODE, 10);
//        doNothing().when(inventoryApi).addInventory(any(InventoryPojo.class));
//        inventoryDto.addInventory(form);
//        verify(inventoryApi).addInventory(any(InventoryPojo.class));
//    }
//
//    @Test
//    public void testUpdateInventory_NewRecord() throws ApiException {
//        InventoryForm form = createInventoryForm(TEST_BARCODE, 15);
//        when(inventoryApi.getByProductId(TEST_PRODUCT_ID)).thenReturn(null);
//        doNothing().when(inventoryApi).addInventory(any(InventoryPojo.class));
//
//        inventoryDto.updateInventory(TEST_BARCODE, form);
//        verify(inventoryApi).addInventory(any(InventoryPojo.class));
//    }
//
//    @Test
//    public void testUpdateInventory_ExistingRecord() throws ApiException {
//        InventoryForm form = createInventoryForm(TEST_BARCODE, 25);
//        InventoryPojo existingInventory = createInventoryPojo();
//        when(inventoryApi.getByProductId(TEST_PRODUCT_ID)).thenReturn(existingInventory);
//
//        inventoryDto.updateInventory(TEST_BARCODE, form);
//        verify(inventoryApi).updateInventory(eq(TEST_PRODUCT_ID), eq(25));
//    }
//
//    @Test
//    public void testGetAll() throws ApiException {
//        List<InventoryPojo> inventoryList = Collections.singletonList(createInventoryPojo());
//        when(inventoryApi.getAll()).thenReturn(inventoryList);
//
//        List<InventoryData> allInventory = inventoryDto.getAll();
//        assertEquals("Should have one inventory record", 1, allInventory.size());
//        assertTrue("Should contain our test inventory",
//            allInventory.stream().anyMatch(data ->
//                data.getProductId().equals(TEST_PRODUCT_ID) &&
//                data.getQuantity() == 10));
//    }
//
//    @Test
//    public void testGetInventoryByBarcode_NotFound() throws ApiException {
//        when(inventoryFlow.getProductByBarcode("nonexistent")).thenThrow(new ApiException("Product not found"));
//
//        assertThrows(ApiException.class, () -> {
//            inventoryDto.getInventoryByBarcode("nonexistent");
//        });
//    }
//
//    @Test
//    public void testGetInventoryByBarcode_Success() throws ApiException {
//        InventoryPojo inventory = createInventoryPojo();
//        when(inventoryApi.getByProductId(TEST_PRODUCT_ID)).thenReturn(inventory);
//
//        InventoryData data = inventoryDto.getInventoryByBarcode(TEST_BARCODE);
//        assertNotNull("Inventory data should not be null", data);
//        assertEquals("Product ID should match", TEST_PRODUCT_ID, data.getProductId());
//        assertEquals("Quantity should match", 10, data.getQuantity());
//    }
//
//    @Test
//    public void testBulkUpdateInventory() throws ApiException {
//        List<InventoryForm> forms = new ArrayList<>();
//        forms.add(createInventoryForm(TEST_BARCODE, 20));
//        forms.add(createInventoryForm(TEST_BARCODE, 30));
//
//        List<InventoryPojo> existingInventory = Collections.singletonList(createInventoryPojo());
//        when(inventoryApi.getAll()).thenReturn(existingInventory);
//        doNothing().when(inventoryApi).updateInventory(anyInt(), anyInt());
//
//        BulkInventoryData result = inventoryDto.bulkUpdateInventory(forms);
//        assertNotNull("Bulk update result should not be null", result);
//        assertEquals("Should have no errors", 0, result.getErrorList().size());
//    }
//
//    @Test
//    public void testBulkUpdateInventory_WithErrors() throws ApiException {
//        List<InventoryForm> forms = new ArrayList<>();
//        forms.add(createInventoryForm("invalid", 20));
//        forms.add(createInventoryForm(TEST_BARCODE, 30));
//
//        when(inventoryFlow.getProductByBarcode("invalid"))
//            .thenThrow(new ApiException("Product not found"));
//
//        BulkInventoryData result = inventoryDto.bulkUpdateInventory(forms);
//        assertNotNull("Bulk update result should not be null", result);
//        assertTrue("Should have errors", result.getErrorList().size() > 0);
//    }
//
//    @Test
//    public void testUpdateInventory_NegativeQuantity() throws ApiException {
//        InventoryForm form = createInventoryForm(TEST_BARCODE, -5);
//
//        assertThrows(ApiException.class, () -> {
//            inventoryDto.updateInventory(TEST_BARCODE, form);
//        });
//    }
//
//    @Test
//    public void testGetInventoryByBarcode_CaseInsensitive() throws ApiException {
//        InventoryPojo inventory = createInventoryPojo();
//        when(inventoryApi.getByProductId(TEST_PRODUCT_ID)).thenReturn(inventory);
//
//        InventoryData data = inventoryDto.getInventoryByBarcode(TEST_BARCODE.toLowerCase());
//        assertNotNull("Inventory data should not be null", data);
//        assertEquals("Product ID should match", TEST_PRODUCT_ID, data.getProductId());
//    }
//}