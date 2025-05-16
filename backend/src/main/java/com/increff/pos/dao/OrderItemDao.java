package com.increff.pos.dao;

import com.increff.pos.helpers.exception.ApiException;
import com.increff.pos.pojo.OrderItemPojo;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.List;
import javax.transaction.Transactional;
import javax.persistence.TypedQuery;

@Repository
@Transactional
public class OrderItemDao extends AbstractDao<OrderItemPojo> {
    public OrderItemDao() throws ApiException {
        super(OrderItemPojo.class);
    }

    @PersistenceContext
    private EntityManager em;

    public void insert(OrderItemPojo orderItemPojo) {
        em.persist(orderItemPojo);
    }

    public OrderItemPojo select(Integer itemId) {
        return em.find(OrderItemPojo.class, itemId);
    }

    public List<OrderItemPojo> selectAll() {
        TypedQuery<OrderItemPojo> query = em.createQuery("SELECT p FROM OrderItemPojo p", OrderItemPojo.class);
        return query.getResultList();
    }

    public List<OrderItemPojo> selectByOrderId(Integer orderId) {
        TypedQuery<OrderItemPojo> query = em.createQuery(
            "SELECT p FROM OrderItemPojo p WHERE p.orderId = :orderId",
            OrderItemPojo.class
        );
        query.setParameter("orderId", orderId);
        return query.getResultList();
    }
}
