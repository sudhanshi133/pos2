package com.increff.pos.dao;

import com.increff.pos.helpers.exception.ApiException;
import com.increff.pos.pojo.DailyReportPojo;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import java.time.LocalDate;
import java.util.List;

@Repository
@Transactional
public class DailyReportDao extends AbstractDao<DailyReportPojo> {
    @PersistenceContext
    protected EntityManager em;
    public DailyReportDao() throws ApiException {
        super(DailyReportPojo.class);
    }

    public DailyReportPojo selectByDate(LocalDate date) {
        TypedQuery<DailyReportPojo> query = getQuery("SELECT p FROM DailyReportPojo p WHERE p.date = :date", DailyReportPojo.class);
        query.setParameter("date", date);
        return getSingle(query);
    }

    public List<DailyReportPojo> selectAll() {
        TypedQuery<DailyReportPojo> query = getQuery("SELECT p FROM DailyReportPojo p ORDER BY p.date DESC", DailyReportPojo.class);
        return query.getResultList();
    }

    public void insertOrUpdate(DailyReportPojo report) throws ApiException {
        DailyReportPojo existing = selectByDate(report.getDate());
        if (existing != null) {
            existing.setOrderCount(report.getOrderCount());
            existing.setTotalItems(report.getTotalItems());
            existing.setRevenue(report.getRevenue());
        } else {
            insert(report);
        }
    }
    public List<DailyReportPojo> selectReportsBetweenDates(LocalDate startDate, LocalDate endDate) {
        String jpql = "SELECT d FROM DailyReportPojo d WHERE d.date >= :startDate AND d.date <= :endDate ORDER BY d.date";
        return em.createQuery(jpql, DailyReportPojo.class)
                .setParameter("startDate", startDate)
                .setParameter("endDate", endDate)
                .getResultList();
    }
//    public calculate
    //pass date
}