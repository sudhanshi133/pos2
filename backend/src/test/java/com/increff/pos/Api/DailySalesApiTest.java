/*
package com.increff.pos.Api;

import com.increff.pos.dao.DailySalesDao;
import com.increff.pos.exception.ApiException;
import com.increff.pos.pojo.DailySalesPojo;
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
import java.time.ZonedDateTime;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = {"classpath:spring-test.xml"})
@WebAppConfiguration
@Transactional
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
public class DailySalesApiTest {

    @InjectMocks
    private DailySalesApi dailySalesApi;

    @Mock
    private DailySalesDao dailySalesDao;

    private static final Integer TEST_SALES_ID = 1;
    private static final Double TEST_REVENUE = 1000.0;
    private static final Integer TEST_ORDER_COUNT = 10;
    private static final Integer TEST_ITEM_COUNT = 50;

    @Before
    public void init() {
        MockitoAnnotations.openMocks(this);
    }

    private DailySalesPojo createDailySalesPojo() {
        DailySalesPojo pojo = new DailySalesPojo();
        pojo.setId(TEST_SALES_ID);
        pojo.setRevenue(TEST_REVENUE);
        pojo.setOrderCount(TEST_ORDER_COUNT);
        pojo.setItemCount(TEST_ITEM_COUNT);
        pojo.setDate(ZonedDateTime.now());
        return pojo;
    }

    @Test
    public void testAddDailySales() throws ApiException {
        DailySalesPojo pojo = createDailySalesPojo();
        doNothing().when(dailySalesDao).insert(any(DailySalesPojo.class));
        
        dailySalesApi.addDailySales(pojo);
        verify(dailySalesDao).insert(any(DailySalesPojo.class));
    }

    @Test
    public void testGetDailySalesById() throws ApiException {
        DailySalesPojo pojo = createDailySalesPojo();
        when(dailySalesDao.selectById(TEST_SALES_ID)).thenReturn(pojo);
        
        DailySalesPojo result = dailySalesApi.getDailySalesById(TEST_SALES_ID);
        assertNotNull("Daily sales should not be null", result);
        assertEquals("Sales ID should match", TEST_SALES_ID, result.getId());
        assertEquals("Revenue should match", TEST_REVENUE, result.getRevenue());
        assertEquals("Order count should match", TEST_ORDER_COUNT, result.getOrderCount());
        assertEquals("Item count should match", TEST_ITEM_COUNT, result.getItemCount());
    }

    @Test
    public void testGetDailySalesById_NotFound() throws ApiException {
        when(dailySalesDao.selectById(TEST_SALES_ID)).thenReturn(null);
        
        DailySalesPojo result = dailySalesApi.getDailySalesById(TEST_SALES_ID);
        assertNull("Daily sales should be null", result);
    }

    @Test
    public void testGetAllDailySales() throws ApiException {
        List<DailySalesPojo> salesList = Collections.singletonList(createDailySalesPojo());
        when(dailySalesDao.selectAll()).thenReturn(salesList);
        
        List<DailySalesPojo> result = dailySalesApi.getAllDailySales();
        assertEquals("Should have one daily sales record", 1, result.size());
        assertEquals("Revenue should match", TEST_REVENUE, result.get(0).getRevenue());
    }

    @Test
    public void testGetAllDailySalesPaginated() throws ApiException {
        List<DailySalesPojo> salesList = Collections.singletonList(createDailySalesPojo());
        when(dailySalesDao.selectAllPaginated(0, 10)).thenReturn(salesList);
        
        List<DailySalesPojo> result = dailySalesApi.getAllDailySalesPaginated(0, 10);
        assertEquals("Should have one daily sales record", 1, result.size());
        assertEquals("Revenue should match", TEST_REVENUE, result.get(0).getRevenue());
    }

    @Test
    public void testAddDailySales_NullRevenue() throws ApiException {
        DailySalesPojo pojo = createDailySalesPojo();
        pojo.setRevenue(null);
        
        assertThrows(ApiException.class, () -> {
            dailySalesApi.addDailySales(pojo);
        });
    }

    @Test
    public void testAddDailySales_NegativeRevenue() throws ApiException {
        DailySalesPojo pojo = createDailySalesPojo();
        pojo.setRevenue(-1000.0);
        
        assertThrows(ApiException.class, () -> {
            dailySalesApi.addDailySales(pojo);
        });
    }

    @Test
    public void testAddDailySales_NullOrderCount() throws ApiException {
        DailySalesPojo pojo = createDailySalesPojo();
        pojo.setOrderCount(null);
        
        assertThrows(ApiException.class, () -> {
            dailySalesApi.addDailySales(pojo);
        });
    }

    @Test
    public void testAddDailySales_NegativeOrderCount() throws ApiException {
        DailySalesPojo pojo = createDailySalesPojo();
        pojo.setOrderCount(-10);
        
        assertThrows(ApiException.class, () -> {
            dailySalesApi.addDailySales(pojo);
        });
    }

    @Test
    public void testAddDailySales_NullItemCount() throws ApiException {
        DailySalesPojo pojo = createDailySalesPojo();
        pojo.setItemCount(null);
        
        assertThrows(ApiException.class, () -> {
            dailySalesApi.addDailySales(pojo);
        });
    }

    @Test
    public void testAddDailySales_NegativeItemCount() throws ApiException {
        DailySalesPojo pojo = createDailySalesPojo();
        pojo.setItemCount(-50);
        
        assertThrows(ApiException.class, () -> {
            dailySalesApi.addDailySales(pojo);
        });
    }
}
*/ 