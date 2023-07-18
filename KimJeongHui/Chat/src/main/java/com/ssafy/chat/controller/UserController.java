package com.ssafy.chat.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.chat.model.User;
import com.ssafy.chat.model.service.UserServiceImpl;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;

// http://localhost:8000/swagger-ui/

@RestController
@Api(value = "/user", description = "About user", consumes = "application/json")
@RequestMapping("/user")
public class UserController {

	private final UserServiceImpl userService;

	public UserController(UserServiceImpl userService) {
		super();
		this.userService = userService;
	}
	
	@ApiOperation(value="유저 로그인 확인", notes="아이디, 비밀번호를 통해 해당 유저 정보에 해당하는 유저가 존재하는지 확인", response = User.class)
	@ApiResponses({
	        @ApiResponse(code = 200, message = "API 정상 작동"),
	        @ApiResponse(code = 204, message = "login 실패"),
	        @ApiResponse(code = 500, message = "서버 에러")
	})
	@PostMapping("/login")
	public ResponseEntity<?> login(@RequestBody User user) throws Exception{
		
		User loginUser = userService.getUser(user);

		if(loginUser != null) {	
			return new ResponseEntity<User>(loginUser, HttpStatus.OK);
		}
		else {
			return new ResponseEntity<Void>(HttpStatus.NO_CONTENT);
		}
	}
	
	@ApiOperation(value="유저 등록", notes="새로운 유저 등록", response = User.class)
	@PostMapping("/regist")
	public ResponseEntity<?> regist(@RequestBody User user) throws Exception {
		
		int cnt = userService.registUser(user);

		if(cnt == 1) {
			// 등록이 된 경우 OK
			return new ResponseEntity<Void>(HttpStatus.OK);
		}
		else {
			return new ResponseEntity<Void>(HttpStatus.NO_CONTENT);
		}
	}
	
	
}
