package com.increff.pos.controller;

import com.increff.pos.dto.DailyReportDto;
import com.increff.pos.helpers.exception.ApiException;
import com.increff.pos.model.data.DailyReportListData;
import com.increff.pos.model.form.DailyReportForm;
import io.swagger.annotations.Api;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@Api
@RestController
@RequestMapping("/api/reports")
public class DailyReportController {

    @Autowired
    private DailyReportDto dailyReportDto;

    @RequestMapping(path = "/daily", method = RequestMethod.GET)
    public DailyReportListData getAllDailyReports() throws ApiException {
        return dailyReportDto.getAllDailyReports();
    }

    @RequestMapping(path = "/daily/filter", method = RequestMethod.POST)
    public DailyReportListData getFilteredDailyReports(@RequestBody DailyReportForm filterForm) throws ApiException {
        return dailyReportDto.getDailyReportsBetweenDates(filterForm);
    }
}