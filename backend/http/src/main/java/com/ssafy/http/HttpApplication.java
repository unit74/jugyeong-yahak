package com.ssafy.http;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.servers.Server;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class HttpApplication {

    public static void main(String[] args) {
        SpringApplication.run(HttpApplication.class, args);
    }

}
