package com.ssafy.chat.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

public class User {

//	@ApiModelProperty(value = "유저 아이디")
	private String userId;
	
//	@ApiModelProperty(value = "유저 비밀번호")
	private String userPwd;

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public String getUserPwd() {
		return userPwd;
	}

	public void setUserPwd(String userPwd) {
		this.userPwd = userPwd;
	}

	public User(String userId, String userPwd) {
		super();
		this.userId = userId;
		this.userPwd = userPwd;
	}

	@Override
	public String toString() {
		return "User [userId=" + userId + ", userPwd=" + userPwd + "]";
	}
	
}
