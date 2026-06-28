package com.bluedigi.bluememo.identity.infrastructure.web.response;

public record UpdateUserResponse(
    String name,
    String email,
    String phone
) {
}
