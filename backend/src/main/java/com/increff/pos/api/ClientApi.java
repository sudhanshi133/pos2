package com.increff.pos.api;

import com.increff.pos.dao.AbstractDao;
import com.increff.pos.dao.ClientDao;
import com.increff.pos.helpers.exception.ApiException;
import com.increff.pos.pojo.ClientPojo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;
import java.util.ArrayList;

@Service
@Transactional
public class ClientApi extends AbstractApi<ClientPojo> {

    @Autowired
    private ClientDao clientDao;
    
    @Override
    protected AbstractDao<ClientPojo> getDao() {
        return clientDao;
    }

    public void insertClient(ClientPojo clientPojo) throws ApiException {
        if (Objects.isNull(clientPojo)) {
            throw new ApiException("Client cannot be null");
        }
        ClientPojo existing = clientDao.selectByName(clientPojo.getClientName());
        if (!Objects.isNull(existing)) {
            throw new ApiException("Client with name '" + clientPojo.getClientName() + "' already exists");
        }
        insert(clientPojo);
    }

    public void updateClient(ClientPojo existing, ClientPojo updatedClient) throws ApiException {
        ClientPojo client1 = clientDao.selectByName(updatedClient.getClientName());
        if(client1 != null && !client1.getClientId().equals(existing.getClientId())) {
            throw new ApiException("Client with this name already exists");
        }
        existing.setClientName(updatedClient.getClientName());
        update(existing);
    }

    public ClientPojo getClientById(Integer id) throws ApiException {
        return getById(id);
    }

    public ClientPojo getClientByName(String name) throws ApiException {
        return clientDao.selectByName(name);
    }

    public List<ClientPojo> getAllClients() throws ApiException {
        try {
            List<ClientPojo> clients = getAll();
            if (Objects.isNull(clients)) {
                return new ArrayList<>();
            }
            return clients;
        } catch (Exception e) {
            throw new ApiException("Error retrieving clients: " + e.getMessage());
        }
    }

    public List<ClientPojo> getAllClients(int page, int size) throws ApiException {
        try {
            List<ClientPojo> clients = clientDao.getAllClients(page, size);
            if (Objects.isNull(clients)) {
                return new ArrayList<>();
            }
            return clients;
        } catch (Exception e) {
            throw new ApiException("Error retrieving clients: " + e.getMessage());
        }
    }
}
