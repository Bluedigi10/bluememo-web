package com.bluedigi.bluememo.identity.domain.repository;

import java.util.Optional;
import java.util.UUID;

import com.bluedigi.bluememo.identity.domain.model.User;

public interface UserRepository {
    User save(User user);
    Optional<User> findById(UUID id);
}