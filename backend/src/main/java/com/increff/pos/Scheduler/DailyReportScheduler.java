package com.increff.pos.Scheduler;

import com.increff.pos.api.DailyReportApi;
import com.increff.pos.api.RevenueApi;
import com.increff.pos.dao.OrderDao;
import com.increff.pos.model.data.DailyReportListData;
import com.increff.pos.model.data.DailyRevenueData;
import com.increff.pos.pojo.DailyReportPojo;
import com.increff.pos.pojo.OrderPojo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import javax.annotation.PostConstruct;
import java.time.LocalDate;
import java.util.List;

@Component
public class DailyReportScheduler {
    private static final Logger logger = LoggerFactory.getLogger(DailyReportScheduler.class);

    @Autowired
    private RevenueApi revenueApi;

    @Autowired
    private DailyReportApi dailyReportApi;

    @Autowired
    private OrderDao orderDao;

    @PostConstruct
    public void init() {
        logger.info("Initializing DailyReportScheduler - running first report generation");
        try {
            // Check if there are any orders
            Long orderCount = orderDao.getOrderCount();
            logger.info("Found {} orders in database", orderCount);
            
            if (orderCount > 0) {
                // Get recent orders to verify data
                List<OrderPojo> recentOrders = orderDao.getRecentOrders();
                for (OrderPojo order : recentOrders) {
                    logger.info("Recent order - ID: {}, Time: {}, Client: {}", 
                        order.getOrderId(), order.getOrderTime(), order.getClientName());
                }
                
                // Force generate reports for today
                generateDailyReport();
            } else {
                logger.warn("No orders found in database. Daily reports will be empty.");
            }
        } catch (Exception e) {
            logger.error("Error in scheduler initialization: {}", e.getMessage(), e);
        }
    }

    @Scheduled(cron = "0 * * * * ?") // Run every minute
    public void generateDailyReport() {
        try {
            logger.info("Starting daily report generation");
            LocalDate today = LocalDate.now();
            
            // Get daily revenue data for today
            List<DailyRevenueData> dailyRevenue = revenueApi.getDailyRevenue(today, today);

            if (dailyRevenue.isEmpty()) {
                logger.info("No revenue data found for today: {}", today);
                return;
            }
            
            DailyRevenueData todayRevenue = dailyRevenue.get(0);
            logger.info("Found revenue data for today: orders={}, items={}, revenue={}", 
                todayRevenue.getOrderCount(), todayRevenue.getTotalItems(), todayRevenue.getRevenue());
            
            // Create or update daily report
            DailyReportPojo existingReport = dailyReportApi.getByDate(today);
                    if (existingReport == null) {
                logger.info("Creating new report for date: {}", today);
                        DailyReportPojo pojo = new DailyReportPojo();
                pojo.setDate(today);
                pojo.setOrderCount(todayRevenue.getOrderCount());
                pojo.setTotalItems(todayRevenue.getTotalItems());
                pojo.setRevenue(todayRevenue.getRevenue());
                        dailyReportApi.add(pojo);
                        logger.info("Created new report for date: {} with orderCount: {}, totalItems: {}, revenue: {}", 
                    today, pojo.getOrderCount(), pojo.getTotalItems(), pojo.getRevenue());
                    } else {
                logger.info("Updating existing report for date: {}", today);
                existingReport.setOrderCount(todayRevenue.getOrderCount());
                existingReport.setTotalItems(todayRevenue.getTotalItems());
                existingReport.setRevenue(todayRevenue.getRevenue());
                dailyReportApi.update(existingReport);
                logger.info("Updated report for date: {} with orderCount: {}, totalItems: {}, revenue: {}", 
                    today, existingReport.getOrderCount(), existingReport.getTotalItems(), existingReport.getRevenue());
                }
            
            logger.info("Completed daily report generation for date: {}", today);
        } catch (Exception e) {
            logger.error("Error generating daily report: {}", e.getMessage(), e);
        }
    }

    // Method to manually trigger report generation for testing
    public void triggerReportGeneration() {
        generateDailyReport();
    }
}