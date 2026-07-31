package com.bluedigi.bluememo.todo.domain.model;

import java.util.Date;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Todo {
    private UUID todoId;
    private UUID userId;
    private String title;
    private String description;
    private TodoStatus status;
    private Date createdAt;
    private Date updatedAt;
}
