package com.bluedigi.bluememo.identity.infrastructure.web;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.bluedigi.bluememo.identity.application.service.AuthService;
import com.bluedigi.bluememo.identity.infrastructure.web.request.LoginUserRequest;
import com.bluedigi.bluememo.identity.infrastructure.web.request.RegisterUserRequest;
import com.bluedigi.bluememo.identity.infrastructure.web.response.AuthResponse;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public AuthResponse registerUser(@RequestBody @Valid RegisterUserRequest entity) {
        return authService.registerUser(entity);
    }

    @PostMapping("/login")
    public AuthResponse loginUser(@RequestBody @Valid LoginUserRequest loginUserRequest) {
        //TODO: process POST request
        
        return authService.loginUser(loginUserRequest);
    }
    
    
}
