package com.increff.pos.config;

import java.util.Properties;

import javax.sql.DataSource;

import lombok.extern.java.Log;
import org.apache.commons.dbcp.BasicDataSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@Configuration
@EnableTransactionManagement
@Log
public class DbConfig {

    public static final String PACKAGE_POJO = "com.increff.pos.pojo";

    @Value("${jdbc.driverClassName}")
    private String jdbcDriver;
    @Value("${jdbc.url}")
    private String jdbcUrl;
    @Value("${jdbc.username}")
    private String jdbcUsername;
    @Value("${jdbc.password}")
    private String jdbcPassword;
    @Value("${hibernate.dialect}")
    private String hibernateDialect;
    @Value("${hibernate.show_sql}")
    private String hibernateShowSql;
    @Value("${hibernate.hbm2ddl.auto}")
    private String hibernateHbm2ddl;

    @Bean(name = "dataSource")
    public DataSource getDataSource() {
        BasicDataSource bean = new BasicDataSource();
        bean.setDriverClassName(jdbcDriver);
        bean.setUrl(jdbcUrl);
        bean.setUsername(jdbcUsername);
        bean.setPassword(jdbcPassword);
        bean.setInitialSize(2);
        bean.setDefaultAutoCommit(false);
        bean.setMinIdle(2);
        bean.setValidationQuery("Select 1");
        bean.setTestWhileIdle(true);
        bean.setTimeBetweenEvictionRunsMillis(10 * 60 * 100);
        bean.setTestOnBorrow(true);
        bean.setTestOnReturn(true);
        bean.setTestWhileIdle(true);
        bean.setTimeBetweenEvictionRunsMillis(60000);
        bean.setMinEvictableIdleTimeMillis(30000);
        return bean;
    }

    @Bean(name = "entityManagerFactory")
    @Autowired
    public LocalContainerEntityManagerFactoryBean entityManagerFactory(DataSource dataSource) {
        LocalContainerEntityManagerFactoryBean bean = new LocalContainerEntityManagerFactoryBean();
        bean.setDataSource(dataSource);
        bean.setPackagesToScan(PACKAGE_POJO);
        HibernateJpaVendorAdapter jpaAdapter = new HibernateJpaVendorAdapter();
        bean.setJpaVendorAdapter(jpaAdapter);
        Properties jpaProperties = new Properties();
        jpaProperties.put("hibernate.dialect", hibernateDialect);
        jpaProperties.put("hibernate.show_sql", hibernateShowSql);
        jpaProperties.put("hibernate.format_sql", "true");
        jpaProperties.put("hibernate.hbm2ddl.auto", hibernateHbm2ddl);
        jpaProperties.put("hibernate.id.new_generator_mappings", "true");
        jpaProperties.put("hibernate.jdbc.batch_size", "1000");
        jpaProperties.put("hibernate.order_inserts", "true");
        jpaProperties.put("hibernate.order_updates", "true");
        jpaProperties.put("hibernate.jdbc.batch_versioned_data", "true");
        jpaProperties.put("hibernate.connection.provider_disables_autocommit", "true");
        bean.setJpaProperties(jpaProperties);
        return bean;
    }

    @Bean(name = "transactionManager")
    @Autowired
    public PlatformTransactionManager transactionManager(LocalContainerEntityManagerFactoryBean emf) {
        JpaTransactionManager bean = new JpaTransactionManager();
        bean.setEntityManagerFactory(emf.getObject());
        return bean;
    }
}