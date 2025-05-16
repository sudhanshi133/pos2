package com.increff.pos.dto;

import com.increff.pos.api.ClientApi;
import com.increff.pos.helpers.exception.ApiException;
import com.increff.pos.model.form.ClientForm;
import com.increff.pos.model.data.ClientListData;
import com.increff.pos.pojo.ClientPojo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import static com.increff.pos.helpers.ClientDtoHelper.*;
import static com.increff.pos.helpers.util.NormalizeUtil.normalize;

@Transactional
@Service
public class ClientDto {

    @Autowired
    private ClientApi clientApi;

    public void add(ClientForm form) throws ApiException {
        validate(form);
        normalize(form);
        clientApi.insertClient(convert(form));
    }

    public void update(String name, ClientForm form) throws ApiException {
        validate(form);
        normalize(form);
        ClientPojo existing = clientApi.getClientByName(name);
        clientApi.updateClient(existing, convert(form));
    }

    public ClientListData getAllClients(int page, int size) throws ApiException {
        List<ClientPojo> clients = clientApi.getAllClients(page, size);
        return convertToClientData(clients);
    }
}