package com.increff.pos.dto;

import com.increff.pos.api.DailyReportApi;
import com.increff.pos.helpers.exception.ApiException;
import com.increff.pos.model.data.DailyReportListData;
import com.increff.pos.model.form.DailyReportForm;
import com.increff.pos.pojo.DailyReportPojo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

import static com.increff.pos.helpers.util.ValidationUtil.validate;

@Component
@Transactional
public class DailyReportDto {
    private static final Logger logger = LoggerFactory.getLogger(DailyReportDto.class);

    @Autowired
    private DailyReportApi dailyReportApi;

    public DailyReportListData getAllDailyReports() throws ApiException {
        try {
            List<DailyReportPojo> pojos = dailyReportApi.getAll();
            List<DailyReportListData.DailyReportData> reports = convertToDataList(pojos);

            DailyReportListData data = new DailyReportListData();
            data.setList(reports);
            return data;
        } catch (Exception e) {
            throw new ApiException("Error retrieving all daily reports: " + e.getMessage());
        }
    }

    private List<DailyReportListData.DailyReportData> convertToDataList(List<DailyReportPojo> pojos) {
        return pojos.stream()
                .map(this::convertToData)
                .collect(Collectors.toList());
    }

    private DailyReportListData.DailyReportData convertToData(DailyReportPojo pojo) {
        DailyReportListData.DailyReportData data = new DailyReportListData.DailyReportData();
        data.setDate(pojo.getDate().toString());
        data.setOrderCount(pojo.getOrderCount());
        data.setTotalItems(pojo.getTotalItems());
        data.setRevenue(pojo.getRevenue());
        return data;
    }

    public DailyReportListData getDailyReportsBetweenDates(DailyReportForm form) throws ApiException {
        try {
            validate(form);
            List<DailyReportPojo> pojos = dailyReportApi.getAll().stream()
                    .filter(report -> !report.getDate().isBefore(form.getStartDate()) && 
                            !report.getDate().isAfter(form.getEndDate()))
                    .collect(Collectors.toList());
            List<DailyReportListData.DailyReportData> filteredReports = convertToDataList(pojos);
            DailyReportListData data = new DailyReportListData();
            data.setList(filteredReports);
            return data;
        } catch (Exception e) {
            throw new ApiException("Error retrieving filtered daily reports: " + e.getMessage());
        }
    }
}