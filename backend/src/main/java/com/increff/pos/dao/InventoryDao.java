package com.increff.pos.dao;

import com.increff.pos.helpers.exception.ApiException;
import com.increff.pos.pojo.InventoryPojo;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
@Transactional
public class InventoryDao extends AbstractDao<InventoryPojo> {
    public InventoryDao() throws ApiException {
        super(InventoryPojo.class);
    }

    public InventoryPojo getByProductId(int productId) throws ApiException {
        return select("productId", productId);
    }
}
