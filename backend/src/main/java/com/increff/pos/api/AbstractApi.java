package com.increff.pos.api;

import com.increff.pos.dao.AbstractDao;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.annotation.Propagation;
import java.io.Serializable;
import java.util.List;

@Transactional
public abstract class AbstractApi<T> {

    protected abstract AbstractDao<T> getDao();

    public void insert(T t) {
        getDao().insert(t);
    }

    public T getByField(String fieldName, Object value) {
        return getDao().select(fieldName, value);
    }

    public T getById(Serializable id) {
        return getDao().select(id);
    }

    public List<T> getAll() {
        return getDao().selectAll();
    }

    public void update(T t) {
        getDao().update(t);
    }
}
