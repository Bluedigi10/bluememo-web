package com.bluedigi.bluememo.todo.infrastructure.web.response;

import java.util.Date;
import java.util.UUID;

import com.bluedigi.bluememo.todo.domain.model.TodoStatus;

public record TodoResponse(
    UUID todoId,
    String title,
    String description,
    TodoStatus status,
    Date createdAt,
    Date updatedAt
) {
}