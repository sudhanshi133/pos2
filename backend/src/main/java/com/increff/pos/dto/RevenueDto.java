package com.increff.pos.dto;

import com.increff.pos.api.DailyReportApi;
import com.increff.pos.api.RevenueApi;
import com.increff.pos.helpers.exception.ApiException;
import com.increff.pos.model.data.RevenueListData;
import com.increff.pos.model.form.SalesReportFilterForm;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

import static com.increff.pos.helpers.util.ValidationUtil.validate;

@Component
@Transactional(readOnly = true)
public class RevenueDto {
    private static final Logger logger = LoggerFactory.getLogger(RevenueDto.class);

    @Autowired
    private RevenueApi revenueApi;

    @Autowired
    private DailyReportApi dailyReportApi;

    public RevenueListData getMonthlyProductRevenue() throws ApiException {
        logger.info("Getting monthly product revenue");
        List<RevenueListData.RevenueData> revenueList = revenueApi.getMonthlyProductRevenue();
        RevenueListData result = new RevenueListData();
        result.setList(revenueList);
        logger.info("Successfully retrieved monthly product revenue");
        return result;
    }

    public RevenueListData getFilteredSalesReport(SalesReportFilterForm form) throws ApiException {
        logger.info("Getting filtered sales report for dates: {} to {}", 
            form.getStartDate(), form.getEndDate());
        validate(form);
        List<RevenueListData.RevenueData> revenueList = revenueApi.getFilteredSalesReport(form);
        RevenueListData result = new RevenueListData();
        result.setList(revenueList);
        logger.info("Successfully retrieved filtered sales report");
        return result;
    }
}