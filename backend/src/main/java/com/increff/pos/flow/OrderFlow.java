package com.increff.pos.flow;

import com.increff.pos.api.OrderApi;
import com.increff.pos.api.OrderItemApi;
import com.increff.pos.api.ProductApi;
import com.increff.pos.dto.OrderItemDto;
import com.increff.pos.helpers.OrderDtoHelper;
import com.increff.pos.helpers.exception.ApiException;
import com.increff.pos.model.data.OrderItemListData;
import com.increff.pos.model.data.OrderListData;
import com.increff.pos.model.form.OrderForm;
import com.increff.pos.model.form.OrderItemForm;
import com.increff.pos.pojo.InventoryPojo;
import com.increff.pos.pojo.OrderItemPojo;
import com.increff.pos.pojo.OrderPojo;
import com.increff.pos.pojo.ProductPojo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import static com.increff.pos.helpers.OrderDtoHelper.createNewOrder;

@Component
@Transactional
public class OrderFlow {

    @Autowired
    private OrderApi orderApi;
    @Autowired
    private InventoryFlow inventoryFlow;
    @Autowired
    private OrderItemDto orderItemDto;
    @Autowired
    private ProductApi productApi;
    @Autowired
    private OrderItemApi orderItemApi;


    public OrderListData fetchingOrders(int page, int size) throws ApiException {
        try {
            List<OrderPojo> orders = orderApi.getAllOrdersPaginated(page, size);
            List<OrderListData.OrderData> orderDataList = new ArrayList<>();
            for (OrderPojo pojo : orders) {
                if (Objects.isNull(pojo)) continue;

                try {
                    List<OrderItemListData.OrderItemData> itemDataList = orderItemDto.getAllByOrderId(pojo.getOrderId());
                    OrderListData.OrderData data = new OrderListData.OrderData();
                    data.setOrderId(pojo.getOrderId());
                    data.setOrderTime(pojo.getOrderTime().toString());
                    data.setOrderItems(itemDataList);
                    data.setName(pojo.getClientName());
                    data.setPhoneNumber(pojo.getPhoneNumber());
                    double total = 0.0;
                    if (itemDataList != null) {
                        for (OrderItemListData.OrderItemData item : itemDataList) {
                            if (item != null) {
                                total += item.getTotalPrice();
                            }
                        }
                    }
                    data.setTotalPrice(total);
                    orderDataList.add(data);
                } catch (Exception e) {
                   throw new ApiException("unable to fetch ");
                }
            }
            OrderListData listData = new OrderListData();
            listData.setOrders(orderDataList);
            return listData;
        } catch (Exception e) {
            throw new ApiException("Error fetching orders: " + e.getMessage());
        }
    }

    public OrderListData.OrderData getOrderData(Integer orderId) throws ApiException {
        if (orderId == null) {
            throw new ApiException("Order ID cannot be null");
        }
        try {
            OrderPojo pojo = orderApi.getOrderById(orderId);
            List<OrderItemListData.OrderItemData> itemDataList = orderItemDto.getAllByOrderId(orderId);
            OrderListData.OrderData data = new OrderListData.OrderData();
            data.setOrderId(pojo.getOrderId());
            data.setOrderTime(pojo.getOrderTime().toString());
            data.setOrderItems(itemDataList);
            data.setName(pojo.getClientName());
            data.setPhoneNumber(pojo.getPhoneNumber());
            double total = 0.0;
            if (!Objects.isNull(itemDataList)) {
                for (OrderItemListData.OrderItemData item : itemDataList) {
                    if (item != null) {
                        total += item.getTotalPrice();
                    }
                }
            }
            data.setTotalPrice(total);
            return data;
        } catch (Exception e) {
            throw new ApiException("Error fetching order: " + e.getMessage());
        }
    }

    public void createOrder(OrderForm form) throws ApiException {
        OrderPojo orderPojo = createNewOrder(form.getClientName(),form.getClientPhone());
        orderApi.createOrder(orderPojo);
        Integer orderId = orderPojo.getOrderId();
        if (orderId == null) {
            throw new ApiException("Failed to create order: Order ID is null");
        }
        List<OrderItemForm> items = form.getItems();
        for (int i = 0; i < items.size(); i++) {
            OrderItemForm orderItemForm = items.get(i);
            InventoryPojo inv = inventoryFlow.getInventoryByBarcode(orderItemForm.getBarcode());
            //TODO - USE PRODUCT ID DIRECTLY
            if(inv.getQuantity() >= orderItemForm.getQuantity()){
                inventoryFlow.reduceQuantity(orderItemForm.getBarcode(), orderItemForm.getQuantity());
                
                // Get product information
                ProductPojo product = productApi.getByBarcode(orderItemForm.getBarcode());
                if (product == null) {
                    throw new ApiException("Product not found for barcode: " + orderItemForm.getBarcode());
                }
                
                // Create order item
                OrderItemPojo orderItem = OrderDtoHelper.getOrderItemPojo(orderId, product, orderItemForm);

                System.out.println("Creating order item - Product: " + product.getProductName() + 
                    ", Quantity: " + orderItemForm.getQuantity() +
                    ", MRP: " + product.getMrp() + 
                    ", Total: " + (orderItemForm.getQuantity() * product.getMrp()));
                
                // Save order item
                orderItemApi.createOrderItem(orderItem);
            }
            else{
                throw new ApiException("Quantity Not Available");
            }
        }
    }


}