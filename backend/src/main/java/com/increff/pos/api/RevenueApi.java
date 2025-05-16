package com.increff.pos.api;

import com.increff.pos.dao.RevenueDao;
import com.increff.pos.model.data.RevenueListData;
import com.increff.pos.model.data.DailyRevenueData;
import com.increff.pos.model.form.SalesReportFilterForm;
import com.increff.pos.helpers.exception.ApiException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.List;

@Component
@Transactional(readOnly = true)
public class RevenueApi {
    private static final Logger logger = LoggerFactory.getLogger(RevenueApi.class);

    @Autowired
    private RevenueDao revenueDao;

    public List<RevenueListData.RevenueData> getMonthlyProductRevenue() {
        logger.info("Fetching monthly product revenue");
        List<RevenueListData.RevenueData> revenue = revenueDao.getMonthlyProductRevenue();
        logger.info("Successfully retrieved monthly product revenue");
        return revenue;
    }

    public List<DailyRevenueData> getDailyRevenue(LocalDate startDate, LocalDate endDate) {
        logger.info("Fetching daily revenue between {} and {}", startDate, endDate);
        List<DailyRevenueData> revenue = revenueDao.getDailyRevenue(startDate, endDate);
        logger.info("Successfully retrieved daily revenue data");
        return revenue;
    }

    public List<RevenueListData.RevenueData> getFilteredSalesReport(SalesReportFilterForm form) {
        logger.info("Fetching filtered sales report with form: {}", form);
        List<RevenueListData.RevenueData> report = revenueDao.getFilteredSalesReport(form);
        logger.info("Successfully retrieved filtered sales report");
        return report;
    }
}

