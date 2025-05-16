package com.increff.pos.dao;

import com.increff.pos.helpers.exception.ApiException;
import com.increff.pos.pojo.ClientPojo;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.List;

@Repository
@Transactional
public class ClientDao extends AbstractDao<ClientPojo> {
    @PersistenceContext
    private EntityManager em;
    
    public ClientDao() throws ApiException {
        super(ClientPojo.class);
    }

    public ClientPojo selectByName(String name) {
        return select("clientName", name);
    }


    public List<ClientPojo> getAllClients(int page, int size) {
        String jpql = "SELECT c FROM ClientPojo c ORDER BY c.id"; // or order by any field you prefer
        return em.createQuery(jpql, ClientPojo.class)
                .setFirstResult(page * size) // Offset = page number * page size
                .setMaxResults(size)         // Limit = size
                .getResultList();
    }
}