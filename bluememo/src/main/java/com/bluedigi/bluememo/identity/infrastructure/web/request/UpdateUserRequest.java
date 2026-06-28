package com.bluedigi.bluememo.identity.infrastructure.web.request;

public record UpdateUserRequest(
    String name,
    String email,
    String phone,
    String password
) {
}
