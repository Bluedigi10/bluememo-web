package com.bluedigi.bluememo.identity.domain.model;

import java.util.UUID;

import lombok.Data;

@Data
public class User {
    private UUID id;
    private String name;
    private String email;
    private String phone;
    private String password;
    private String birthday;
}
