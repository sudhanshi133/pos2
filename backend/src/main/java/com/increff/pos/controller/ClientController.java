package com.increff.pos.controller;
import com.increff.pos.dto.ClientDto;
import com.increff.pos.helpers.exception.ApiException;
import com.increff.pos.model.form.ClientForm;
import com.increff.pos.model.data.ClientListData;
import io.swagger.annotations.Api;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@Api
@RestController
@RequestMapping(value = "/api/client")
public class ClientController {
    @Autowired
    private ClientDto clientDto;

    // 1. Add a new client (POST method)
    @RequestMapping(value = "/add", method = RequestMethod.POST)
    public void addClient(@RequestBody ClientForm form) throws ApiException {
        clientDto.add(form);
    }

    // 2. Update an existing client (PUT method)
    @RequestMapping(value = "/update/{clientName}", method = RequestMethod.PUT)
    public void updateClient(@PathVariable String clientName, @RequestBody ClientForm form) throws ApiException {
        clientDto.update(clientName, form);
    }

    // 3. Get all client details (GET method) for the UI table
    @RequestMapping(value = "/get", method = RequestMethod.GET)
    public ClientListData getAllClients(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) throws ApiException {
        return clientDto.getAllClients(page, size);
    }
}
