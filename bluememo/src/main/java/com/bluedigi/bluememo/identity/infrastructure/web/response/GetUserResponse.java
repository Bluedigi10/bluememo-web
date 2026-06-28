package com.bluedigi.bluememo.identity.infrastructure.web.response;

public record GetUserResponse(
    String name,
    String email,
    String phone,
    String birthday,
    String createdAt,
    String updatedAt
) {
}
