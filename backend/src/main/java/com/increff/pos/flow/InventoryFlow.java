package com.increff.pos.flow;

import com.increff.pos.api.ClientApi;
import com.increff.pos.api.InventoryApi;
import com.increff.pos.api.ProductApi;
import com.increff.pos.helpers.exception.ApiException;
import com.increff.pos.model.data.InventoryListData;
import com.increff.pos.pojo.InventoryPojo;
import com.increff.pos.pojo.ProductPojo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import static com.increff.pos.helpers.InventoryDtoHelper.*;

@Component
@Transactional
public class InventoryFlow {
    @Autowired
    private InventoryApi inventoryApi;

    @Autowired
    private ProductApi productApi;

    @Autowired
    private ClientApi clientApi;

    public void updateByBarcode(String barcode, int newQuantity) throws ApiException {
        validateBarcode(barcode);
        normalizeBarcode(barcode);
   InventoryPojo inventory = getInventoryByBarcode(barcode);
   if(Objects.isNull(inventory)){
       throw new ApiException("empty");
   }
   validateQuantity(newQuantity);
   inventory.setQuantity(newQuantity);

    }

    public boolean checkQuantity(String barcode, int requiredQuantity) throws ApiException {
         validateBarcodeQuantity(barcode, requiredQuantity);
        ProductPojo product = getAndValidateProduct(barcode);
        InventoryPojo inventory = getAndValidateInventory(product.getProductId());
        return inventory.getQuantity() >= requiredQuantity;
    }

    public void reduceQuantity(String barcode, int quantityToReduce) throws ApiException {
        ProductPojo product = getAndValidateProduct(barcode);
        InventoryPojo inventory = getAndValidateInventory(product.getProductId());
        if(checkQuantity(barcode, quantityToReduce)){
        inventory.setQuantity(inventory.getQuantity() - quantityToReduce);
        inventoryApi.updateInventory(inventory);
    }
    else{
        throw new ApiException("This much Quantity doesnot exist");
    }
    }

    public ProductPojo getAndValidateProduct(String barcode) throws ApiException {
        return productApi.getByBarcode(barcode);
    }

    public List<InventoryListData.InventoryData> conversion(List<InventoryPojo> pojos) throws ApiException {
        List<InventoryListData.InventoryData> dataList = new ArrayList<>();
        for (InventoryPojo pojo : pojos) {
            if (Objects.isNull(pojo)) {
                continue;
            }
            ProductPojo product = productApi.getById(pojo.getProductId());
            if (Objects.isNull(product)) {
                continue;
            }
            InventoryListData.InventoryData data = new InventoryListData.InventoryData();
            data.setBarcode(product.getBarcode());
            data.setQuantity(pojo.getQuantity());
            dataList.add(data);
        }
        return dataList;
    }

    private InventoryPojo getAndValidateInventory(int productId) throws ApiException {
        return validateInventory(productId);
    }

    public InventoryPojo getInventoryByBarcode(String barcode) throws ApiException {
        ProductPojo product = productApi.getByBarcode(barcode);
        if (Objects.isNull(product)) {
            throw new ApiException("Product with barcode " + barcode + " not found");
        }
        return validateInventory(product.getProductId());
    }

    public  InventoryPojo validateInventory(int productId) throws ApiException {
        try {
            System.out.println("InventoryDtoHelper: Validating inventory for product ID: " + productId);
            InventoryPojo inventory = inventoryApi.getInventoryByProductId(productId);
            if (Objects.isNull(inventory)) {
                System.out.println("InventoryDtoHelper: No inventory found, creating new entry");
                inventory = new InventoryPojo();
                inventory.setProductId(productId);
                inventory.setQuantity(0); // Default to zero
                try {
                    inventoryApi.updateInventory(inventory); // This will insert the new inventory
                    System.out.println("InventoryDtoHelper: Created new inventory entry for product ID: " + productId);
                } catch (Exception e) {
                    throw new ApiException("Failed to create inventory for product ID: " + productId);
                }
            } else {
                System.out.println("InventoryDtoHelper: Found existing inventory - ID: " + inventory.getInventoryId() +
                        ", Quantity: " + inventory.getQuantity());
            }
            return inventory;
        } catch (Exception e) {
            throw new ApiException("Error validating inventory: " + e.getMessage());
        }
    }
    public InventoryListData.InventoryData convert(InventoryPojo pojo) throws ApiException {
        InventoryListData.InventoryData data = new InventoryListData.InventoryData();
        data.setQuantity(pojo.getQuantity());
        // Get product information to set barcode
        ProductPojo product = productApi.getById(pojo.getProductId());
        if (product != null) {
            data.setBarcode(product.getBarcode());
        }
        return data;
    }
    public InventoryListData convertToInventoryDataList(List<InventoryPojo> list) throws ApiException {
        List<InventoryListData.InventoryData> dataList = new ArrayList<>();

        for (InventoryPojo pojo : list) {
            InventoryListData.InventoryData data = convert(pojo);
            dataList.add(data);
        }
        return new InventoryListData(dataList);
    }
}
