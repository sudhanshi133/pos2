//package com.increff.pos.api;
//
//import com.increff.pos.dao.OrderDao;
//import com.increff.pos.exception.ApiException;
//import com.increff.pos.pojo.OrderPojo;
//import org.junit.Before;
//import org.junit.Test;
//import org.junit.runner.RunWith;
//import org.mockito.Mock;
//import org.mockito.MockitoAnnotations;
//import org.springframework.test.context.ContextConfiguration;
//import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
//import org.springframework.test.context.web.WebAppConfiguration;
//import org.springframework.transaction.annotation.Transactional;
//import org.springframework.test.annotation.DirtiesContext;
//import org.mockito.InjectMocks;
//
//import static org.junit.Assert.*;
//import static org.mockito.ArgumentMatchers.any;
//import static org.mockito.ArgumentMatchers.eq;
//import static org.mockito.Mockito.*;
//
//import java.util.List;
//import java.util.ArrayList;
//import java.util.Collections;
//import java.time.ZonedDateTime;
//
//@RunWith(SpringJUnit4ClassRunner.class)
//@ContextConfiguration(locations = {"classpath:spring-test.xml"})
//@WebAppConfiguration
//@Transactional
//@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
//public class OrderApiTest {
//
//    @InjectMocks
//    private OrderApi orderApi;
//
//    @Mock
//    private OrderDao orderDao;
//
//    private static final Integer TEST_ORDER_ID = 1;
//    private static final String TEST_CLIENT_NAME = "Test Client";
//    private static final String TEST_PHONE = "1234567890";
//
//    @Before
//    public void init() {
//        MockitoAnnotations.openMocks(this);
//    }
//
//    private OrderPojo createOrderPojo() {
//        OrderPojo pojo = new OrderPojo();
//        pojo.setOrderId(TEST_ORDER_ID);
//        pojo.setClientName(TEST_CLIENT_NAME);
//        pojo.setPhoneNumber(TEST_PHONE);
//        pojo.setOrderTime(ZonedDateTime.now());
//        return pojo;
//    }
//
//    @Test
//    public void testCreateOrder() throws ApiException {
//        OrderPojo pojo = createOrderPojo();
//        doNothing().when(orderDao).insert(any(OrderPojo.class));
//
//        orderApi.createOrder(pojo);
//        verify(orderDao).insert(any(OrderPojo.class));
//    }
//
//    @Test
//    public void testGetOrderById() throws ApiException {
//        OrderPojo pojo = createOrderPojo();
//        when(orderDao.selectById(TEST_ORDER_ID)).thenReturn(pojo);
//
//        OrderPojo result = orderApi.getOrderById(TEST_ORDER_ID);
//        assertNotNull("Order should not be null", result);
//        assertEquals("Order ID should match", TEST_ORDER_ID, result.getOrderId());
//        assertEquals("Client name should match", TEST_CLIENT_NAME, result.getClientName());
//    }
//
//    @Test
//    public void testGetOrderById_NotFound() throws ApiException {
//        when(orderDao.selectById(TEST_ORDER_ID)).thenReturn(null);
//
//        OrderPojo result = orderApi.getOrderById(TEST_ORDER_ID);
//        assertNull("Order should be null", result);
//    }
//
//    @Test
//    public void testGetAllOrders() throws ApiException {
//        List<OrderPojo> orderList = Collections.singletonList(createOrderPojo());
//        when(orderDao.selectAll()).thenReturn(orderList);
//
//        List<OrderPojo> result = orderApi.getAllOrders();
//        assertEquals("Should have one order record", 1, result.size());
//        assertEquals("Client name should match", TEST_CLIENT_NAME, result.get(0).getClientName());
//    }
//
//    @Test
//    public void testGetAllOrdersPaginated() throws ApiException {
//        List<OrderPojo> orderList = Collections.singletonList(createOrderPojo());
//        when(orderDao.selectAllPaginated(0, 10)).thenReturn(orderList);
//
//        List<OrderPojo> result = orderApi.getAllOrdersPaginated(0, 10);
//        assertEquals("Should have one order record", 1, result.size());
//        assertEquals("Client name should match", TEST_CLIENT_NAME, result.get(0).getClientName());
//    }
//
//    @Test
//    public void testCreateOrder_NullClientName() throws ApiException {
//        OrderPojo pojo = createOrderPojo();
//        pojo.setClientName(null);
//
//        assertThrows(ApiException.class, () -> {
//            orderApi.createOrder(pojo);
//        });
//    }
//
//    @Test
//    public void testCreateOrder_NullPhoneNumber() throws ApiException {
//        OrderPojo pojo = createOrderPojo();
//        pojo.setPhoneNumber(null);
//
//        assertThrows(ApiException.class, () -> {
//            orderApi.createOrder(pojo);
//        });
//    }
//
//    @Test
//    public void testCreateOrder_EmptyClientName() throws ApiException {
//        OrderPojo pojo = createOrderPojo();
//        pojo.setClientName("");
//
//        assertThrows(ApiException.class, () -> {
//            orderApi.createOrder(pojo);
//        });
//    }
//
//    @Test
//    public void testCreateOrder_InvalidPhoneNumber() throws ApiException {
//        OrderPojo pojo = createOrderPojo();
//        pojo.setPhoneNumber("123"); // Too short
//
//        assertThrows(ApiException.class, () -> {
//            orderApi.createOrder(pojo);
//        });
//    }
//}