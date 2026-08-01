package com.bluedigi.bluememo.identity.infrastructure.web;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bluedigi.bluememo.identity.application.service.UserService;
import com.bluedigi.bluememo.identity.infrastructure.web.request.UpdateUserRequest;
import com.bluedigi.bluememo.identity.infrastructure.web.request.DeleteUserRequest;
import com.bluedigi.bluememo.identity.infrastructure.web.response.UserResponse;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;



@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @Operation(summary = "Get user details")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "details get "),
            @ApiResponse(responseCode = "404", description = "resource not found")
    })
    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser(@AuthenticationPrincipal UserDetails loggedUser) {
        return ResponseEntity.ok(
            userService.getUserById(loggedUser.getUsername())
        );
    }

    @PatchMapping("/me")
    public ResponseEntity<UserResponse> updateUser(@AuthenticationPrincipal UserDetails loggedUser, @Valid @RequestBody UpdateUserRequest entity) {
        return ResponseEntity.ok(
            userService.updateUser(loggedUser.getUsername(), entity)
        );
    }

    @DeleteMapping("/me")
    public ResponseEntity<Void> deleteUser(@AuthenticationPrincipal UserDetails loggedUser, @Valid @RequestBody DeleteUserRequest deleteUserRequest) {
        userService.deleteUserById(loggedUser.getUsername(), deleteUserRequest);
        return ResponseEntity.noContent().build();
    }
}
