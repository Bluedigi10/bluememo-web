package com.bluedigi.bluememo.identity.infrastructure.persistence;

import java.util.Optional;
import java.util.UUID;

import com.bluedigi.bluememo.identity.domain.model.User;
import com.bluedigi.bluememo.identity.domain.repository.UserRepository;
import com.bluedigi.bluememo.identity.infrastructure.persistence.entity.UserEntity;
import com.bluedigi.bluememo.identity.infrastructure.persistence.mapper.UserMapper;
import com.bluedigi.bluememo.identity.infrastructure.persistence.repository.UserJpaRepository;

public class UserRepositoryAdapter implements UserRepository {
    private final UserJpaRepository repository;
    private final UserMapper mapper;
    
    public UserRepositoryAdapter(UserJpaRepository repository, UserMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Override
    public User save(User user) {
        UserEntity userEntity = mapper.toUserEntity(new User());
        return mapper.toUser(repository.save(userEntity));
    }

    @Override
    public Optional<User> findById(UUID id) {
        // Use userJpaRepository to find UserEntity by id
        // Convert UserEntity to User and return as Optional
        return Optional.empty(); // Placeholder for actual implementation
    }
    
}
