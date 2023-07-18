package com.ssafy.chat.model.mapper;

import java.sql.SQLException;

import org.apache.ibatis.annotations.Mapper;

import com.ssafy.chat.model.User;

@Mapper
public interface UserMapper {

	User getUser(User user) throws SQLException;

	int registUser(User user) throws SQLException;

}
