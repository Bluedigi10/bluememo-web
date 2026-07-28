package com.bluedigi.bluememo.identity.infrastructure.web;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bluedigi.bluememo.identity.infrastructure.web.request.UpdateUserRequest;
import com.bluedigi.bluememo.identity.infrastructure.web.response.GetUserResponse;
import com.bluedigi.bluememo.identity.infrastructure.web.response.UpdateUserResponse;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

import java.util.List;
import java.util.UUID;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;



@RestController
@RequestMapping("/users")
public class UserController {
    
    @GetMapping
    public List<GetUserResponse> getUsers() {
        //TODO: process GET request with param
        return List.of(new GetUserResponse(new String(), new String(), new String(), new String(), new String(), new String()));
    }

    @Operation(summary = "Get user details by ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "details get "),
            @ApiResponse(responseCode = "403", description = "not authorized to access this resource")
    })
    @GetMapping("/{id}")
    public GetUserResponse getUser(@PathVariable UUID id) {
        return new GetUserResponse(new String(), new String(), new String(), new String(), new String(), new String());
    }

    @PutMapping("/{id}")
    public UpdateUserResponse updateUser(@PathVariable UUID id, @RequestBody UpdateUserRequest entity) {
        //TODO: process PUT request
        return new UpdateUserResponse(entity.name(), entity.email(), entity.phone());
    }

    @DeleteMapping("/{id}")
    public String deleteUser(@PathVariable UUID id) {
        //TODO: process DELETE request
        return new String();
    }
}
