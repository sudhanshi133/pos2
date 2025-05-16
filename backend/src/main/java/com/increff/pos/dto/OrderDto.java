package com.increff.pos.dto;

import com.increff.pos.helpers.exception.ApiException;
import com.increff.pos.flow.OrderFlow;
import com.increff.pos.model.form.OrderForm;
import com.increff.pos.model.data.OrderListData;
import lombok.extern.log4j.Log4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import javax.transaction.Transactional;

import static com.increff.pos.helpers.util.NormalizeUtil.normalize;
import static com.increff.pos.helpers.util.ValidationUtil.validate;

@Service
@Transactional
@Log4j
public class OrderDto {

    @Autowired
    private OrderFlow orderFlow;

    public OrderListData getAllOrders(int page, int size) throws ApiException {
        return orderFlow.fetchingOrders(page, size);
    }

    public void createOrder(OrderForm form) throws ApiException {
        validate(form);
        normalize(form);
        orderFlow.createOrder(form);
    }

    public OrderListData.OrderData getOrderById(Integer orderId) throws ApiException {
            return orderFlow.getOrderData(orderId);
    }
}

