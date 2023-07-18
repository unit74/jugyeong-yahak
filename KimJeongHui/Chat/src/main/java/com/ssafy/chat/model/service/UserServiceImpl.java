package com.ssafy.chat.model.service;

import org.springframework.stereotype.Service;

import com.ssafy.chat.model.User;
import com.ssafy.chat.model.mapper.UserMapper;

@Service
public class UserServiceImpl implements UserService{

	private UserMapper userMapper;
	
	public UserServiceImpl(UserMapper userMapper) {
		super();
		this.userMapper = userMapper;
	}

	@Override
	public User getUser(User user) throws Exception {
		System.out.println(user);
		return userMapper.getUser(user);
	}

	@Override
	public int registUser(User user) throws Exception {
		return userMapper.registUser(user);
	}
	
}
