package com.bluedigi.bluememo.identity.infrastructure.web.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record RegisterUserRequest(
    @NotBlank
    String name,
    @Email
    @NotBlank
    String email,
    @NotBlank
    String password
) {
}
