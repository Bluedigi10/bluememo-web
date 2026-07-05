package com.bluedigi.bluememo.identity.application.service;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.bluedigi.bluememo.identity.domain.model.User;
import com.bluedigi.bluememo.identity.domain.repository.UserRepository;
import com.bluedigi.bluememo.identity.infrastructure.persistence.mapper.UserMapper;
import com.bluedigi.bluememo.identity.infrastructure.security.JwtService;
import com.bluedigi.bluememo.identity.infrastructure.web.request.LoginUserRequest;
import com.bluedigi.bluememo.identity.infrastructure.web.request.RegisterUserRequest;
import com.bluedigi.bluememo.identity.infrastructure.web.response.AuthResponse;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository, UserMapper userMapper, JwtService jwtService) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
        this.jwtService = jwtService;
    }

    public AuthResponse registerUser(RegisterUserRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists");
        }

        User savedUser = userRepository.save(userMapper.registerUserRequestToUser(request));
    
        return new AuthResponse(jwtService.generateToken(savedUser));
    }
    
    public AuthResponse loginUser(LoginUserRequest loginUserRequest) {
        //TODO: Implement login logic
        return null;
    }
}