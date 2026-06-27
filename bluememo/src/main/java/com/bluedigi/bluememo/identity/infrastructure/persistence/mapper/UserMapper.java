package com.bluedigi.bluememo.identity.infrastructure.persistence.mapper;

import java.util.Objects;

import com.bluedigi.bluememo.identity.domain.model.User;
import com.bluedigi.bluememo.identity.infrastructure.persistence.entity.UserEntity;

public class UserMapper {
    public UserEntity toUserEntity(User user) {
        Objects.requireNonNull(user, "User cannot be null");
        UserEntity entity = new UserEntity();
        entity.setId(user.getId());
        entity.setName(user.getName());
        entity.setEmail(user.getEmail());
        entity.setPhone(user.getPhone());
        entity.setPassword(user.getPassword());
        entity.setBirthday(user.getBirthday());
        entity.setCreatedAt(user.getCreatedAt());
        entity.setUpdatedAt(user.getUpdatedAt());
        return entity;
    }

    public User toUser(UserEntity entity) {
        Objects.requireNonNull(entity, "UserEntity cannot be null");
        User user = new User();
        user.setId(entity.getId());
        user.setName(entity.getName());
        user.setEmail(entity.getEmail());
        user.setPhone(entity.getPhone());
        user.setPassword(entity.getPassword());
        user.setBirthday(entity.getBirthday());
        user.setCreatedAt(entity.getCreatedAt());
        user.setUpdatedAt(entity.getUpdatedAt());
        return user;
    }
}
