package com.increff.pos.controller;

import com.increff.pos.dto.RevenueDto;
import com.increff.pos.helpers.exception.ApiException;
import com.increff.pos.model.data.RevenueListData;
import com.increff.pos.model.form.SalesReportFilterForm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;
import javax.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

@RestController
@RequestMapping("/api/revenue")
@Transactional(readOnly = true)
public class RevenueController {

    @Autowired
    private RevenueDto revenueDto;

    @RequestMapping(path="/sales-report", method = RequestMethod.GET)
    public ResponseEntity<?> getMonthlyProductRevenue() {
        try {
            RevenueListData data = revenueDto.getMonthlyProductRevenue();
            return ResponseEntity.ok(data);
        } catch (ApiException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @RequestMapping(path = "/filtered-sales-report", method = RequestMethod.POST)
    public ResponseEntity<?> getFilteredSalesReport(@Valid @RequestBody SalesReportFilterForm form) {
        try {
            RevenueListData data = revenueDto.getFilteredSalesReport(form);
            return ResponseEntity.ok(data);
        } catch (ApiException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}