package com.bluedigi.bluememo.identity.infrastructure.persistence.mapper;

import java.time.ZoneId;
import java.util.Date;
import java.util.Objects;

import org.springframework.stereotype.Component;

import com.bluedigi.bluememo.identity.domain.model.User;
import com.bluedigi.bluememo.identity.infrastructure.persistence.entity.UserEntity;
import com.bluedigi.bluememo.identity.infrastructure.web.request.RegisterUserRequest;
import com.bluedigi.bluememo.identity.infrastructure.web.response.UserResponse;

@Component
public class UserMapper {

    private final ZoneId MEXICO_CITY = ZoneId.of("America/Mexico_City");

    public User registerUserRequestToUser(RegisterUserRequest request) {
        Objects.requireNonNull(request, "RegisterUserRequest cannot be null");
        User user = new User();
        user.setName(request.name());
        user.setEmail(request.email());
        user.setPassword(request.password());
        return user;
    }
    
    public UserEntity userToUserEntity(User user) {
        Objects.requireNonNull(user, "User cannot be null");
        UserEntity entity = new UserEntity();
        entity.setId(user.getId());
        entity.setName(user.getName());
        entity.setEmail(user.getEmail());
        entity.setPhone(user.getPhone());
        entity.setPassword(user.getPassword());
        entity.setBirthdate(user.getBirthdate());
        return entity;
    }

    public User userEntityToUser(UserEntity entity) {
        Objects.requireNonNull(entity, "UserEntity cannot be null");
        User user = new User();
        user.setId(entity.getId());
        user.setName(entity.getName());
        user.setEmail(entity.getEmail());
        user.setPhone(entity.getPhone());
        user.setPassword(entity.getPassword());
        user.setBirthdate(entity.getBirthdate());
        user.setCreatedAt(Date.from(entity.getCreatedAt().atZone(MEXICO_CITY).toInstant()));
        user.setUpdatedAt(Date.from(entity.getUpdatedAt().atZone(MEXICO_CITY).toInstant()));
        return user;
    }

    public UserResponse userToUserResponse(User user) {
        Objects.requireNonNull(user, "User cannot be null");

        return new UserResponse(
            user.getName(),
            user.getEmail(),
            user.getPhone(),
            user.getBirthdate(),
            user.getCreatedAt(),
            user.getUpdatedAt()
        );
    }

    public void updateUserEntity(User user, UserEntity entity) {
        entity.setName(user.getName());
        entity.setEmail(user.getEmail());
        entity.setPhone(user.getPhone());
        entity.setPassword(user.getPassword());
        entity.setBirthdate(user.getBirthdate());
    }
}
