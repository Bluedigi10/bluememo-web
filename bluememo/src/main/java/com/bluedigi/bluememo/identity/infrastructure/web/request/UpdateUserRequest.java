package com.bluedigi.bluememo.identity.infrastructure.web.request;

import java.time.LocalDate;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

public record UpdateUserRequest(
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    String name,
    @Email(message = "Email is invalid")
    String email,
    @Size(min = 10, max = 10, message = "Phone number must be exactly 10 characters")
    String phone,
    LocalDate birthdate,
    @Size(min = 8, message = "Password must be at least 8 characters long")
    String password,
    @Size(min = 8, message = "New password must be at least 8 characters long")
    String newPassword
) {
}
