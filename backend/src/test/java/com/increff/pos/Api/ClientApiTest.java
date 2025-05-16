//package com.increff.pos.test.api;
//
//import com.increff.pos.dao.ClientDao;
//import com.increff.pos.exception.ApiException;
//import com.increff.pos.pojo.ClientPojo;
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
//
//@RunWith(SpringJUnit4ClassRunner.class)
//@ContextConfiguration(locations = {"classpath:spring-test.xml"})
//@WebAppConfiguration
//@Transactional
//@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
//public class ClientApiTest {
//
//    @InjectMocks
//    private ClientApi clientApi;
//
//    @Mock
//    private ClientDao clientDao;
//
//    private static final String TEST_CLIENT_NAME = "Test Client";
//    private static final Integer TEST_CLIENT_ID = 1;
//
//    @Before
//    public void init() {
//        MockitoAnnotations.openMocks(this);
//    }
//
//    private ClientPojo createClientPojo() {
//        ClientPojo pojo = new ClientPojo();
//        pojo.setId(TEST_CLIENT_ID);
//        pojo.setClientName(TEST_CLIENT_NAME);
//        return pojo;
//    }
//
//    @Test
//    public void testAddClient() throws ApiException {
//        ClientPojo pojo = createClientPojo();
//        doNothing().when(clientDao).insert(any(ClientPojo.class));
//
//        clientApi.addClient(pojo);
//        verify(clientDao).insert(any(ClientPojo.class));
//    }
//
//    @Test
//    public void testGetClientById() throws ApiException {
//        ClientPojo pojo = createClientPojo();
//        when(clientDao.selectById(TEST_CLIENT_ID)).thenReturn(pojo);
//
//        ClientPojo result = clientApi.getClientById(TEST_CLIENT_ID);
//        assertNotNull("Client should not be null", result);
//        assertEquals("Client ID should match", TEST_CLIENT_ID, result.getId());
//        assertEquals("Client name should match", TEST_CLIENT_NAME, result.getClientName());
//    }
//
//    @Test
//    public void testGetClientById_NotFound() throws ApiException {
//        when(clientDao.selectById(TEST_CLIENT_ID)).thenReturn(null);
//
//        ClientPojo result = clientApi.getClientById(TEST_CLIENT_ID);
//        assertNull("Client should be null", result);
//    }
//
//    @Test
//    public void testGetAll() throws ApiException {
//        List<ClientPojo> clientList = Collections.singletonList(createClientPojo());
//        when(clientDao.selectAll()).thenReturn(clientList);
//
//        List<ClientPojo> result = clientApi.getAll();
//        assertEquals("Should have one client record", 1, result.size());
//        assertEquals("Client name should match", TEST_CLIENT_NAME, result.get(0).getClientName());
//    }
//
//    @Test
//    public void testUpdateClient() throws ApiException {
//        ClientPojo pojo = createClientPojo();
//        when(clientDao.selectById(TEST_CLIENT_ID)).thenReturn(pojo);
//        doNothing().when(clientDao).update(any(ClientPojo.class));
//
//        clientApi.updateClient(TEST_CLIENT_ID, pojo);
//        verify(clientDao).update(any(ClientPojo.class));
//    }
//
//    @Test
//    public void testUpdateClient_NotFound() throws ApiException {
//        ClientPojo pojo = createClientPojo();
//        when(clientDao.selectById(TEST_CLIENT_ID)).thenReturn(null);
//
//        assertThrows(ApiException.class, () -> {
//            clientApi.updateClient(TEST_CLIENT_ID, pojo);
//        });
//    }
//
//    @Test
//    public void testAddClient_NullName() throws ApiException {
//        ClientPojo pojo = createClientPojo();
//        pojo.setClientName(null);
//
//        assertThrows(ApiException.class, () -> {
//            clientApi.addClient(pojo);
//        });
//    }
//
//    @Test
//    public void testAddClient_EmptyName() throws ApiException {
//        ClientPojo pojo = createClientPojo();
//        pojo.setClientName("");
//
//        assertThrows(ApiException.class, () -> {
//            clientApi.addClient(pojo);
//        });
//    }
//}