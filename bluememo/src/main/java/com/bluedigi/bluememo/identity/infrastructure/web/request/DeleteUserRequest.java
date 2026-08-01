package com.bluedigi.bluememo.identity.infrastructure.web.request;

import jakarta.validation.constraints.NotBlank;

public record DeleteUserRequest (
    @NotBlank
    String password
) {
}
