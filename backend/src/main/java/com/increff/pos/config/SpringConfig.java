package com.increff.pos.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.*;
import org.springframework.context.support.PropertySourcesPlaceholderConfigurer;
import org.springframework.core.env.Environment;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@Configuration
@EnableTransactionManagement
@ComponentScan(basePackages = {
    "com.increff.pos.controller",
    "com.increff.pos.service",
    "com.increff.pos.dao",
    "com.increff.pos.api",
    "com.increff.pos.dto",
    "com.increff.pos.util",
    "com.increff.pos.model",
    "com.increff.pos.helpers",
    "com.increff.pos.flow",
    "com.increff.pos.Scheduler",
    "com.increff.pos.config"
})
@PropertySources({ 
    @PropertySource("classpath:taken.properties"),
    @PropertySource("classpath:application.yml")
})
public class SpringConfig {

    @Autowired
    private Environment env;

    @Bean
    public static PropertySourcesPlaceholderConfigurer propertySourcesPlaceholderConfigurer() {
        return new PropertySourcesPlaceholderConfigurer();
    }
}
