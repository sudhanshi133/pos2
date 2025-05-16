package com.increff.pos.dao;

import com.increff.pos.helpers.exception.ApiException;
import com.increff.pos.pojo.ProductPojo;
import org.springframework.stereotype.Repository;

import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
@Transactional
@Repository
public class ProductDao extends AbstractDao<ProductPojo> {
    public ProductDao() throws ApiException {
        super(ProductPojo.class);
    }
    public ProductPojo getProductByBarcode(String barcode) {
        return select("barcode", barcode);  // Returns null if no product found with the given barcode
    }

    public List<ProductPojo> getProductsByClientId(int clientId) {
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<ProductPojo> cq = cb.createQuery(ProductPojo.class);
        Root<ProductPojo> root = cq.from(ProductPojo.class);
        cq.select(root).where(cb.equal(root.get("clientId"), clientId));
        TypedQuery<ProductPojo> query = em.createQuery(cq);
        return query.getResultList();
    }

    public List<ProductPojo> searchProducts(String barcode, String productName, int page, int size) {
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<ProductPojo> cq = cb.createQuery(ProductPojo.class);
        Root<ProductPojo> root = cq.from(ProductPojo.class);
        List<Predicate> predicates = new ArrayList<>();
        if (barcode != null && !barcode.trim().isEmpty()) {
            String trimmedBarcode = barcode.trim().toLowerCase();
            predicates.add(cb.like(cb.lower(root.get("barcode")), "%" + trimmedBarcode + "%"));
        }
        if (productName != null && !productName.trim().isEmpty()) {
            String trimmedName = productName.trim().toLowerCase();
            predicates.add(cb.like(cb.lower(root.get("productName")), "%" + trimmedName + "%"));
        }
        if (!predicates.isEmpty()) {
            cq.where(cb.and(predicates.toArray(new Predicate[0])));
        }
        TypedQuery<ProductPojo> query = em.createQuery(cq);
        query.setFirstResult(page * size);
        query.setMaxResults(size);
        List<ProductPojo> results = query.getResultList();
        return results;
    }

    public List<ProductPojo> getAllProducts(int page, int size) {
        String jpql = "SELECT p FROM ProductPojo p";
        return em.createQuery(jpql, ProductPojo.class)
                .setFirstResult(page * size)
                .setMaxResults(size)
                .getResultList();
    }

    public List<ProductPojo> getProductsByClientId(int clientId, int page, int size) {
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<ProductPojo> cq = cb.createQuery(ProductPojo.class);
        Root<ProductPojo> root = cq.from(ProductPojo.class);
        cq.select(root).where(cb.equal(root.get("clientId"), clientId));
        TypedQuery<ProductPojo> query = em.createQuery(cq);
        query.setFirstResult(page * size);
        query.setMaxResults(size);
        return query.getResultList();
    }
}
