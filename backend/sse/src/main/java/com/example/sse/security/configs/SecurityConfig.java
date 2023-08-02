package com.example.sse.security.configs;

import java.util.Arrays;
import java.util.List;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsUtils;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final String[] AUTH_BLACK_LIST = {"/api/v1/private/**"};

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.authorizeRequests()
            .requestMatchers(CorsUtils::isPreFlightRequest)
            .permitAll()

            .and()
            .cors()
            .configurationSource(request -> {
                CorsConfiguration cors = new CorsConfiguration();
                cors.setAllowedOrigins(List.of("*"));
                cors.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
                cors.setAllowedHeaders(List.of("*"));
                return cors;
            })

            .and()
            .csrf()
            .disable()
            .httpBasic()
            .disable()
            .formLogin()
            .disable()
            .sessionManagement()
            .sessionCreationPolicy(SessionCreationPolicy.STATELESS)

            .and()
            .authorizeRequests()
            .antMatchers(AUTH_BLACK_LIST)
            .authenticated()
            .anyRequest()
            .permitAll();

        return http.build();
    }

}
