package com.ssafy.chat.model.service;

import com.ssafy.chat.model.User;

public interface UserService {
	
	User getUser(User user) throws Exception;	
	int registUser(User user) throws Exception;
	
}
