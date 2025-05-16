package com.increff.pos.model.data;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ClientListData {
    private List<ClientData> clientDataList;
    @Getter
    @Setter
    public static class ClientData {
        private String clientName;
    }
}
