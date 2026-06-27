package com.bluedigi.bluememo.identity.infrastructure.web;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;



@RestController
@RequestMapping("/users")
public class UserController {
    @GetMapping
    public String getUsers(@RequestParam String param) {
        //TODO: process GET request with param
        return new String();
    }

    @GetMapping("/{id}")
    public String getUser(@PathVariable String id) {
        return new String();
    }
    

    @PostMapping
    public String registerUser(@RequestBody String entity) {
        //TODO: process POST request
        
        return entity;
    }

    @PutMapping("/{id}")
    public String updateUser(@PathVariable String id, @RequestBody String entity) {
        //TODO: process PUT request
        return entity;
    }

    @DeleteMapping("/{id}")
    public String deleteUser(@PathVariable String id) {
        //TODO: process DELETE request
        return new String();
    }
    
    
}
