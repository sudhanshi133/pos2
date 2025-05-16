package com.increff.pos.dto;

import com.increff.pos.api.OrderItemApi;
import com.increff.pos.helpers.exception.ApiException;
import com.increff.pos.flow.OrderItemFlow;
import com.increff.pos.model.data.OrderItemListData;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import javax.transaction.Transactional;
import java.util.List;

@Service
@Transactional
public class OrderItemDto {
    @Autowired
    private OrderItemApi orderItemApi;
    @Autowired
    private OrderItemFlow orderItemFlow;

    public List<OrderItemListData.OrderItemData> getAllByOrderId(Integer orderId) throws ApiException {
        return orderItemFlow.getAllItemsByOrderId(orderId);
    }
}