/*
package com.increff.pos.Api;

import com.increff.pos.dao.RevenueDao;
import com.increff.pos.exception.ApiException;
import com.increff.pos.pojo.RevenuePojo;
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
public class RevenueApiTest {

    @InjectMocks
    private RevenueApi revenueApi;

    @Mock
    private RevenueDao revenueDao;

    private static final Integer TEST_REVENUE_ID = 1;
    private static final Double TEST_REVENUE = 1000.0;
    private static final Integer TEST_ORDER_COUNT = 10;

    @Before
    public void init() {
        MockitoAnnotations.openMocks(this);
    }

    private RevenuePojo createRevenuePojo() {
        RevenuePojo pojo = new RevenuePojo();
        pojo.setId(TEST_REVENUE_ID);
        pojo.setRevenue(TEST_REVENUE);
        pojo.setOrderCount(TEST_ORDER_COUNT);
        pojo.setDate(ZonedDateTime.now());
        return pojo;
    }

    @Test
    public void testAddRevenue() throws ApiException {
        RevenuePojo pojo = createRevenuePojo();
        doNothing().when(revenueDao).insert(any(RevenuePojo.class));
        
        revenueApi.addRevenue(pojo);
        verify(revenueDao).insert(any(RevenuePojo.class));
    }

    @Test
    public void testGetRevenueById() throws ApiException {
        RevenuePojo pojo = createRevenuePojo();
        when(revenueDao.selectById(TEST_REVENUE_ID)).thenReturn(pojo);
        
        RevenuePojo result = revenueApi.getRevenueById(TEST_REVENUE_ID);
        assertNotNull("Revenue should not be null", result);
        assertEquals("Revenue ID should match", TEST_REVENUE_ID, result.getId());
        assertEquals("Revenue amount should match", TEST_REVENUE, result.getRevenue());
        assertEquals("Order count should match", TEST_ORDER_COUNT, result.getOrderCount());
    }

    @Test
    public void testGetRevenueById_NotFound() throws ApiException {
        when(revenueDao.selectById(TEST_REVENUE_ID)).thenReturn(null);
        
        RevenuePojo result = revenueApi.getRevenueById(TEST_REVENUE_ID);
        assertNull("Revenue should be null", result);
    }

    @Test
    public void testGetAllRevenue() throws ApiException {
        List<RevenuePojo> revenueList = Collections.singletonList(createRevenuePojo());
        when(revenueDao.selectAll()).thenReturn(revenueList);
        
        List<RevenuePojo> result = revenueApi.getAllRevenue();
        assertEquals("Should have one revenue record", 1, result.size());
        assertEquals("Revenue amount should match", TEST_REVENUE, result.get(0).getRevenue());
    }

    @Test
    public void testGetAllRevenuePaginated() throws ApiException {
        List<RevenuePojo> revenueList = Collections.singletonList(createRevenuePojo());
        when(revenueDao.selectAllPaginated(0, 10)).thenReturn(revenueList);
        
        List<RevenuePojo> result = revenueApi.getAllRevenuePaginated(0, 10);
        assertEquals("Should have one revenue record", 1, result.size());
        assertEquals("Revenue amount should match", TEST_REVENUE, result.get(0).getRevenue());
    }

    @Test
    public void testAddRevenue_NullRevenue() throws ApiException {
        RevenuePojo pojo = createRevenuePojo();
        pojo.setRevenue(null);
        
        assertThrows(ApiException.class, () -> {
            revenueApi.addRevenue(pojo);
        });
    }

    @Test
    public void testAddRevenue_NegativeRevenue() throws ApiException {
        RevenuePojo pojo = createRevenuePojo();
        pojo.setRevenue(-1000.0);
        
        assertThrows(ApiException.class, () -> {
            revenueApi.addRevenue(pojo);
        });
    }

    @Test
    public void testAddRevenue_NullOrderCount() throws ApiException {
        RevenuePojo pojo = createRevenuePojo();
        pojo.setOrderCount(null);
        
        assertThrows(ApiException.class, () -> {
            revenueApi.addRevenue(pojo);
        });
    }

    @Test
    public void testAddRevenue_NegativeOrderCount() throws ApiException {
        RevenuePojo pojo = createRevenuePojo();
        pojo.setOrderCount(-10);
        
        assertThrows(ApiException.class, () -> {
            revenueApi.addRevenue(pojo);
        });
    }
}
*/ 