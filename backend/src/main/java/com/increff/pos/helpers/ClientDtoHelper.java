package com.increff.pos.helpers;

import com.increff.pos.helpers.exception.ApiException;
import com.increff.pos.model.form.ClientForm;
import com.increff.pos.model.data.ClientListData;
import com.increff.pos.pojo.ClientPojo;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;


public class ClientDtoHelper {

    public static void validate(ClientForm form) throws ApiException {
        if (Objects.isNull(form.getClientName()) ||  form.getClientName().trim().isEmpty()) {
            throw new ApiException("Client name cannot be empty");
        }
    }

    public static ClientPojo convert(ClientForm form) {
        ClientPojo pojo = new ClientPojo();
        pojo.setClientName(form.getClientName());
        return pojo;
    }


    public static ClientListData convertToClientData(List<ClientPojo> clients) {
        List<ClientListData.ClientData> clientDataList = new ArrayList<>();
        for (ClientPojo client : clients) {
            ClientListData.ClientData data = new ClientListData.ClientData();
            data.setClientName(client.getClientName());
            clientDataList.add(data);
        }
        ClientListData listData = new ClientListData();
        listData.setClientDataList(clientDataList);
        return listData;
    }
}