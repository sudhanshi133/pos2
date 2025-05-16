package com.increff.pos.dto;

import com.increff.pos.api.InventoryApi;
import com.increff.pos.helpers.exception.ApiException;
import com.increff.pos.flow.InventoryFlow;
import com.increff.pos.model.form.InventoryForm;
import com.increff.pos.model.data.InventoryListData;
import com.increff.pos.model.data.ResponseListData;
import com.increff.pos.pojo.InventoryPojo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import javax.transaction.Transactional;
import java.util.List;

import static com.increff.pos.helpers.util.NormalizeUtil.normalize;
import static com.increff.pos.helpers.util.ValidationUtil.validate;

@Service
@Transactional
public class InventoryDto {

    @Autowired
    private InventoryFlow inventoryFlow;
    @Autowired
    private InventoryApi inventoryApi;

    public void updateInventoryByBarcode(String barcode,InventoryForm inventoryForm) throws ApiException {
        validate(inventoryForm);
        normalize(inventoryForm);
        inventoryFlow.updateByBarcode(barcode,inventoryForm.getQuantity());
    }

    public ResponseListData bulkUpdateInventory(List<InventoryForm> inventoryForms) throws ApiException {
        ResponseListData response = new ResponseListData();

        for (InventoryForm form : inventoryForms) {
            try {
            validate(form);
            normalize(form);
            updateInventoryByBarcode(form.getBarcode(), form);
                ResponseListData.ResponseData successData = new ResponseListData.ResponseData();
                successData.setBarcode(form.getBarcode());
                successData.setMessage("Success");
                response.getSuccessList().add(successData);
            } catch (ApiException e) {
                ResponseListData.ResponseData failureData = new ResponseListData.ResponseData();
                failureData.setBarcode(form.getBarcode());
                failureData.setMessage("Failed: " + e.getMessage());
                response.getFailureList().add(failureData);
            }
        }
        return response;
    }

    public InventoryListData getAllInventory() throws ApiException {
        List<InventoryPojo> list = inventoryApi.getAllInventory();
        return inventoryFlow.convertToInventoryDataList(list);
    }


}
