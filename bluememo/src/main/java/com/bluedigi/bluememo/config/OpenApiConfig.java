package com.bluedigi.bluememo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI blueMemoOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("BlueMemo API")
                        .version("v1")
                        .description("API documentation for BlueMemo"));
    }
}