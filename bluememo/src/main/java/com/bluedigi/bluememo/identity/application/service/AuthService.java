package com.bluedigi.bluememo.identity.application.service;

import org.springframework.stereotype.Service;

import com.bluedigi.bluememo.identity.domain.repository.UserRepository;
import com.bluedigi.bluememo.identity.infrastructure.persistence.mapper.UserMapper;
import com.bluedigi.bluememo.identity.infrastructure.web.request.RegisterUserRequest;
import com.bluedigi.bluememo.identity.infrastructure.web.response.RegisterUserResponse;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;

    public AuthService(UserRepository userRepository, UserMapper userMapper) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
    }

    public RegisterUserResponse registerUser(RegisterUserRequest userToRegister) {
        return userMapper.userToRegisterUserResponse(userRepository.save(userMapper.registerUserRequestToUser(userToRegister)));
    }
    
}