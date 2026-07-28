package com.bluedigi.bluememo.identity.application.service;

import java.util.UUID;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

import com.bluedigi.bluememo.identity.domain.model.User;
import com.bluedigi.bluememo.identity.domain.repository.UserRepository;

@Service
public class CustomUserService implements UserDetailsService {
    private final UserRepository userRepository;

    public CustomUserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public UserDetails loadUserByUsername(String userId) {
        User user = userRepository.findById(UUID.fromString(userId))
                .orElseThrow(() -> new RuntimeException("User not found"));
        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getId().toString())
                .password(user.getPassword())
                .roles("USER")
                .build();
    }
}
