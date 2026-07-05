package com.bluedigi.bluememo.identity.infrastructure.web.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record LoginUserRequest(
    @Email
    @NotBlank
    String email,
    @NotBlank
    String password
) {
}
