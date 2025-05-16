package com.increff.pos.controller;

import com.increff.pos.dto.OrderDto;
import com.increff.pos.helpers.exception.ApiException;
import com.increff.pos.model.data.OrderListData;
import com.increff.pos.model.form.OrderForm;
import io.swagger.annotations.Api;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@Api
@RestController
@RequestMapping(value = "/api/order")
public class OrderController {

    @Autowired
    private OrderDto orderDto;

    @RequestMapping(value = "/create", method = RequestMethod.POST)
    public void createOrder(@RequestBody OrderForm form) throws ApiException {
        orderDto.createOrder(form);
    }

    @RequestMapping(value = "/get", method = RequestMethod.GET)
    public OrderListData getAllOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) throws ApiException {
        return orderDto.getAllOrders(page, size);
    }

    @RequestMapping(value = "/get/{orderId}", method = RequestMethod.GET)
    public OrderListData.OrderData getOrderById(@PathVariable Integer orderId) throws ApiException {
        return orderDto.getOrderById(orderId);
    }
}
