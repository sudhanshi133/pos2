package com.increff.pos.api;

import com.increff.pos.dao.DailyReportDao;
import com.increff.pos.pojo.DailyReportPojo;
import com.increff.pos.model.data.DailyReportListData;
import com.increff.pos.helpers.exception.ApiException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Component
@Transactional
public class DailyReportApi {

    private static final Logger logger = LoggerFactory.getLogger(DailyReportApi.class);

    @Autowired
    private DailyReportDao dailyReportDao;

    // Add a new daily report
    public void add(DailyReportPojo p) throws ApiException {
        try {
            dailyReportDao.insert(p);
            logger.info("Successfully added daily report for date: {}", p.getDate());
        } catch (Exception e) {
            logger.error("Error adding daily report for date {}: {}", p.getDate(), e.getMessage());
            throw new ApiException("Error adding daily report for date: " + p.getDate());
        }
    }

    // Update an existing daily report
    public void update(DailyReportPojo p) throws ApiException {
        try {
            dailyReportDao.update(p);
            logger.info("Successfully updated daily report for date: {}", p.getDate());
        } catch (Exception e) {
            logger.error("Error updating daily report for date {}: {}", p.getDate(), e.getMessage());
            throw new ApiException("Error updating daily report for date: " + p.getDate());
        }
    }

    // Get daily report for a specific date
    public DailyReportPojo getByDate(LocalDate date) throws ApiException {
        try {
            DailyReportPojo report = dailyReportDao.selectByDate(date);
            if (report == null) {
                logger.warn("No daily report found for date: {}", date);
                throw new ApiException("No daily report found for date: " + date);
            }
            return report;
        } catch (ApiException e) {
            throw e;
        } catch (Exception e) {
            logger.error("Error retrieving daily report for date {}: {}", date, e.getMessage());
            throw new ApiException("Error retrieving daily report for date: " + date);
        }
    }

    // Get all daily reports
    public List<DailyReportPojo> getAll() throws ApiException {
        try {
            List<DailyReportPojo> reports = dailyReportDao.selectAll();
            logger.info("Retrieved {} daily reports", reports.size());
            return reports;
        } catch (Exception e) {
            logger.error("Error getting all daily reports: {}", e.getMessage());
            throw new ApiException("Error retrieving all daily reports");
        }
    }

    // Get all daily reports as data objects
    public List<DailyReportListData> getAllDailyReports() throws ApiException {
        try {
            List<DailyReportPojo> pojos = dailyReportDao.selectAll();
            logger.info("Converting {} daily reports to data objects", pojos.size());
            return pojos.stream()
                    .map(this::convertToData)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            logger.error("Error converting daily reports to data objects: {}", e.getMessage());
            throw new ApiException("Error converting daily reports to data objects");
        }
    }

    // Get daily reports between a specific date range
    public List<DailyReportListData> getReportsBetweenDates(LocalDate startDate, LocalDate endDate) throws ApiException {
        try {
            logger.info("Getting daily reports between dates: {} and {}", startDate, endDate);
            List<DailyReportPojo> pojos = dailyReportDao.selectReportsBetweenDates(startDate, endDate);
            logger.info("Found {} daily reports between {} and {}", pojos.size(), startDate, endDate);
            return pojos.stream()
                    .map(this::convertToData)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            logger.error("Error getting reports between dates {} and {}: {}", startDate, endDate, e.getMessage());
            throw new ApiException("Error retrieving reports between dates " + startDate + " and " + endDate);
        }
    }

    // Convert DailyReportPojo to DailyReportListData
    private DailyReportListData convertToData(DailyReportPojo pojo) {
        return new DailyReportListData(
                pojo.getDate().toString(),
                pojo.getOrderCount(),
                pojo.getTotalItems(),
                pojo.getRevenue()
        );
    }
}
