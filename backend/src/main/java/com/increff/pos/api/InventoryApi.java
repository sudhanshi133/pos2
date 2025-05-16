package com.increff.pos.api;

import com.increff.pos.dao.AbstractDao;
import com.increff.pos.dao.InventoryDao;
import com.increff.pos.helpers.exception.ApiException;
import com.increff.pos.pojo.InventoryPojo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Objects;
import java.util.ArrayList;

@Service
@Transactional
public class InventoryApi extends AbstractApi<InventoryPojo> {

    @Autowired
    private InventoryDao inventoryDao;
    
    @Override
    protected AbstractDao<InventoryPojo> getDao() {
        return inventoryDao;
    }

    public List<InventoryPojo> getAllInventories() throws ApiException {
        try {
            List<InventoryPojo> inventories = getAll();
            if (Objects.isNull(inventories)) {
                return new ArrayList<>();
            }
            return inventories;
        } catch (Exception e) {
            throw new ApiException("Error retrieving inventory: " + e.getMessage());
        }
    }

    public InventoryPojo getQuantityByProductId(int id) throws ApiException {
        try {
            System.out.println("InventoryApi: Getting quantity for product ID: " + id);
            InventoryPojo inventory = getInventoryByProductId(id);
            if (Objects.isNull(inventory)) {
               throw new ApiException("InventoryApi: No inventory found for product ID: " + id + ", returning 0");
            }
            System.out.println("InventoryApi: Found quantity " + inventory.getQuantity() + " for product ID: " + id);
            return inventory;
        } catch (Exception e) {
            throw new ApiException("Error getting quantity: " + e.getMessage());
        }
    }

    public void updateInventory(InventoryPojo inventory) throws ApiException {
        try {
            System.out.println("InventoryApi: Updating inventory for product ID: " + inventory.getProductId());
            update(inventory);
            System.out.println("InventoryApi: Successfully updated inventory");
        } catch (Exception e) {
            throw new ApiException("Error updating inventory: " + e.getMessage());
        }
    }

    public InventoryPojo getInventoryByProductId(int productId) throws ApiException {
        InventoryPojo inventory = inventoryDao.getByProductId(productId);
        if (Objects.isNull(inventory)) {
            inventory = new InventoryPojo();
            inventory.setProductId(productId);
            inventory.setQuantity(0);
            insert(inventory);
            inventory = inventoryDao.getByProductId(productId);  // Fetch newly created inventory
        }
        return inventory;
    }

    public List<InventoryPojo> getAllInventory() {
        return getAll();
    }

    public void insertInventory(InventoryPojo inventory) throws ApiException {
        try {
            insert(inventory);
        } catch (Exception e) {
            throw new ApiException("Error inserting inventory: " + e.getMessage());
        }
    }
}
