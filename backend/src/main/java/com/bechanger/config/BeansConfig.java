package com.bechanger.config;


import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.AuditorAware;
import org.springframework.http.HttpHeaders;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;
import java.util.List;

import static org.springframework.http.HttpHeaders.*;

@Configuration
@RequiredArgsConstructor
public class BeansConfig {

    @Value("${application.cors.origins:*}")
    private List<String> allowedOrigins;

    @Bean
    public AuditorAware<String> auditorAware() {
        return new ApplicationAuditAware();
    }

    @Bean
    public CorsFilter corsFilter() {
        final UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        final CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.setAllowedOriginPatterns(List.of("https://bechangerapp-ancient-frost-9304.fly.dev",           // éles frontend alkalmazás URL-je
        "https://bechangerapp-ancient-frost-9304.fly.dev:4200",       // éles frontend Angular port
        "https://localhost:4200",                                      // fejlesztési frontend URL (ha szükséges, az éles helyett)
        "http://localhost:8080",                                       // fejlesztési backend API
        "http://localhost:8088",                                       // másik fejlesztési backend API
        "https://bechangerapp-ancient-frost-9304.fly.dev:8080",        // éles backend API port 8080
        "https://bechangerapp-ancient-frost-9304.fly.dev:8088" ));        // éles backend API port 8088);
        config.setAllowedHeaders(Arrays.asList(
                HttpHeaders.ORIGIN,
                CONTENT_TYPE,
                ACCEPT,
                AUTHORIZATION
        ));
        config.setAllowedMethods(Arrays.asList(
                "GET",
                "POST",
                "DELETE",
                "PUT",
                "PATCH"
        ));
        config.addExposedHeader(HttpHeaders.AUTHORIZATION);
        config.addExposedHeader(HttpHeaders.CONTENT_TYPE);
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}
