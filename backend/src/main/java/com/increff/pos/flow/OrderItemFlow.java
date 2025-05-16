package com.increff.pos.flow;

import com.increff.pos.api.OrderItemApi;
import com.increff.pos.api.ProductApi;
import com.increff.pos.dto.OrderItemDto;
import com.increff.pos.helpers.exception.ApiException;
import com.increff.pos.model.data.OrderItemListData;
import com.increff.pos.pojo.OrderItemPojo;
import com.increff.pos.pojo.ProductPojo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Component
@Transactional
public class OrderItemFlow {
    private static final Logger logger = LoggerFactory.getLogger(OrderItemFlow.class);

    @Autowired
    private OrderItemApi orderItemApi;
    @Autowired
    private ProductApi productApi;
    @Autowired
    private OrderItemDto orderItemDto;

    public OrderItemListData.OrderItemData convertToOrderItemData(OrderItemPojo pojo) throws ApiException {
        if (Objects.isNull(pojo)) {
            throw new ApiException("Order item pojo cannot be null");
        }

        OrderItemListData.OrderItemData data = new OrderItemListData.OrderItemData();
        data.setItemId(pojo.getItemId());
        data.setQuantity(pojo.getQuantity());
        data.setSellingPrice(pojo.getSellingPrice());
        double totalPrice = pojo.getQuantity() * pojo.getSellingPrice();
        logger.info("Calculating total price for item {}: quantity={}, sellingPrice={}, totalPrice={}", 
            pojo.getItemId(), pojo.getQuantity(), pojo.getSellingPrice(), totalPrice);
        data.setTotalPrice(totalPrice);

        // Get product information
        ProductPojo product = productApi.getById(pojo.getProductId());
        if (Objects.isNull(product)) {
            logger.error("Product not found for product ID: {}", pojo.getProductId());
            throw new ApiException("Product not found for product ID: " + pojo.getProductId());
        }
        data.setProductName(product.getProductName());
        data.setBarcode(product.getBarcode());
        return data;
    }

    public List<OrderItemListData.OrderItemData> getAllItemsByOrderId(Integer orderId) throws ApiException {
        if (Objects.isNull(orderId)) {
            throw new ApiException("Order ID cannot be null");
        }
        
        try {
            List<OrderItemPojo> items = orderItemApi.getAllOrderItemsByOrderId(orderId);
            if (Objects.isNull(items) || items.isEmpty()) {
                return new ArrayList<>();
            }
            
            List<OrderItemListData.OrderItemData> result = new ArrayList<>();
            for (OrderItemPojo item : items) {
                try {
                    result.add(convertToOrderItemData(item));
                } catch (Exception e) {
                    logger.error("Error converting order item {}: {}", item.getItemId(), e.getMessage());
                }
            }
            return result;
        } catch (Exception e) {
            logger.error("Error fetching order items for order {}: {}", orderId, e.getMessage());
            throw new ApiException("Error fetching order items: " + e.getMessage());
        }
    }
}
