package com.ssafy.demo;

import com.ssafy.model.User;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class DemoApplication {

	public static void main(String[] args) {
		SpringApplication.run(DemoApplication.class, args);
		User user = new User("kim","010");
		System.out.println(user);
	}

}
