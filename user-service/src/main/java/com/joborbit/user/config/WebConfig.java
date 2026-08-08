package com.joborbit.user.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.multipart.MultipartResolver;
import org.springframework.web.multipart.support.StandardServletMultipartResolver;

/**
 * WHY: Registers the standard Servlet multipart resolver so @RequestParam
 * MultipartFile works for the resume-upload endpoint.
 */
@Configuration
public class WebConfig {

    @Bean
    public MultipartResolver multipartResolver() {
        return new StandardServletMultipartResolver();
    }
}
