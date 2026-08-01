package com.bluedigi.bluememo.identity.domain.repository;

import java.util.Optional;
import java.util.UUID;

import com.bluedigi.bluememo.identity.domain.model.User;

public interface UserRepository {
    User save(User user);
    void deleteById(UUID id);
    Optional<User> findById(UUID id);
    Optional<User> findByEmail(String email);
    boolean existsById(UUID id);
    boolean existsByEmail(String email);
    boolean existsByPhone(String phone);
    User update(User user);
}