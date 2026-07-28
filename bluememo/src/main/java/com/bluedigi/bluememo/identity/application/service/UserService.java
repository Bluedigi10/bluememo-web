package com.bluedigi.bluememo.identity.application.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.bluedigi.bluememo.identity.infrastructure.web.response.GetUserResponse;

@Service
public class UserService {
    public List<GetUserResponse> getUsers() {
        return new ArrayList<>();
    }

    public GetUserResponse getUserById(String id) {
        return new GetUserResponse("prueba", new String(), new String(), new String(), new String(), new String());
    }
}
