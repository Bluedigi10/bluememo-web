package com.bluedigi.bluememo.identity.infrastructure.web.response;

public record RegisterUserResponse(
    String name,
    String token
) {
}
