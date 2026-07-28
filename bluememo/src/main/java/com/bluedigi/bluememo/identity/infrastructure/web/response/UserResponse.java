package com.bluedigi.bluememo.identity.infrastructure.web.response;

import java.time.LocalDate;
import java.util.Date;

public record UserResponse(
    String name,
    String email,
    String phone,
    LocalDate birthdate,
    Date createdAt,
    Date updatedAt
) {
}
