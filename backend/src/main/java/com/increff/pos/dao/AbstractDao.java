package com.increff.pos.dao;

import com.increff.pos.helpers.exception.ApiException;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.*;
import javax.persistence.criteria.*;
import java.io.Serializable;
import java.util.List;

@Repository
@Transactional
public abstract class AbstractDao<T> {

    @PersistenceContext
    protected EntityManager em;

    private Class<T> clazz;
    protected AbstractDao(Class<T> clazz) throws ApiException {
        if (clazz == null) {
            throw new ApiException("Entity class cannot be null");
        }
        this.clazz = clazz;
    }

    protected <T> T getSingle(TypedQuery<T> query) {
        return query.getResultList().stream().findFirst().orElse(null);
    }

    protected <T> TypedQuery<T> getQuery(String jpql, Class<T> clazz) {
        return em.createQuery(jpql, clazz);
    }

    public EntityManager em() {
        return em;
    }

    protected CriteriaBuilder getCriteriaBuilder() {
        return em.getCriteriaBuilder();
    }

    public void insert(T t) {
        em.persist(t);
    }


    public T select(String member, Object value) {
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<T> cq = cb.createQuery(clazz);
        ParameterExpression<Object> p = cb.parameter(Object.class);
        Root<T> from = cq.from(clazz);
        cq.select(from).where(cb.equal(from.get(member), p));
        TypedQuery<T> query = em.createQuery(cq);
        query.setParameter(p, value);
        return selectSingleOrNull(query);
    }

    public T select(Serializable id) {
        return em.find(clazz, id);
    }


    public List<T> selectAll() {
       return selectAll();
    }

    public void update(T entity) {
        em.merge(entity);
    }

    public static <T> T selectSingleOrNull(TypedQuery<T> query) {
        try {
            return query.getSingleResult();
        } catch (NoResultException e) {
            return null;
        }
    }
}
