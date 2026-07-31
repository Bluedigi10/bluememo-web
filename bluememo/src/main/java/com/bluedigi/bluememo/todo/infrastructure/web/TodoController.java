package com.bluedigi.bluememo.todo.infrastructure.web;

import org.springframework.web.bind.annotation.RestController;

import com.bluedigi.bluememo.todo.application.service.TodoService;
import com.bluedigi.bluememo.todo.infrastructure.web.request.CreateTodoRequest;
import com.bluedigi.bluememo.todo.infrastructure.web.request.UpdateTodoRequest;
import com.bluedigi.bluememo.todo.infrastructure.web.response.PageResponse;
import com.bluedigi.bluememo.todo.infrastructure.web.response.TodoResponse;

import jakarta.validation.Valid;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;




@RestController
@RequestMapping("/todos")
public class TodoController {

    private final TodoService service;

    public TodoController(TodoService service) {
        this.service = service;
    }
    
    @PostMapping
    public ResponseEntity<TodoResponse> createTodo(
        @AuthenticationPrincipal UserDetails loggedUser, 
        @Valid @RequestBody CreateTodoRequest createTodoRequest
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.createTodo(loggedUser.getUsername(), createTodoRequest));
    }

    @GetMapping
    public ResponseEntity<PageResponse<TodoResponse>> getAllTodos(
        @AuthenticationPrincipal UserDetails loggedUser,
        @RequestParam(required = false) String status,
        @RequestParam(defaultValue = "createdAt") String sortBy,
        @RequestParam(defaultValue = "desc") String direction,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size
    ) {
        Page<TodoResponse> response = service.getTodos(loggedUser.getUsername(), status, sortBy, direction, page, size);
        return ResponseEntity.ok(PageResponse.from(response));
    }

    @GetMapping("/{todoId}")
    public ResponseEntity<TodoResponse> getTodo(
        @AuthenticationPrincipal UserDetails loggedUser,
        @PathVariable String todoId
    ) {
        return ResponseEntity.ok(service.getTodo(loggedUser.getUsername(), todoId));
    }
    

    @PutMapping("/{todoId}")
    public ResponseEntity<TodoResponse> updateTodo(
        @AuthenticationPrincipal UserDetails loggedUser,
        @PathVariable String todoId, 
        @Valid @RequestBody UpdateTodoRequest request
    ) {
        return ResponseEntity.ok(service.updateTodo(loggedUser.getUsername(), todoId, request));
    }

    @PatchMapping("/{todoId}")
    public ResponseEntity<TodoResponse> updateStatus(
        @AuthenticationPrincipal UserDetails loggedUser,
        @PathVariable String todoId,
        @RequestParam String status
    ) {
        return ResponseEntity.ok(service.updateStatus(loggedUser.getUsername(), todoId, status));
    }
    
    @DeleteMapping("/{todoId}")
    public ResponseEntity<Void> deleteTodo (
        @AuthenticationPrincipal UserDetails loggedUser,
        @PathVariable String todoId
    ) {

        service.deleteTodo(loggedUser.getUsername(), todoId);

        return ResponseEntity.noContent().build();
    }
    
}
