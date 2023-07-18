package com.ssafy.chat.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;

@Configuration
public class SwaggerConfig {

	private ApiInfo swaggerInfo() {
		return new ApiInfoBuilder().title("Chat API")
				.description("Chat API 연습").build();
	}

	@Bean
	public Docket swaggerApi() {
		return new Docket(DocumentationType.SWAGGER_2)
				.apiInfo(swaggerInfo()).select()
				.apis(RequestHandlerSelectors.basePackage("com.ssafy.chat"))
				.paths(PathSelectors.any())
				.build();
	}

}
