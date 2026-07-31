package com.bluedigi.bluememo.identity.infrastructure.persistence;

import java.util.Optional;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Repository;
import org.springframework.web.server.ResponseStatusException;

import com.bluedigi.bluememo.identity.domain.model.User;
import com.bluedigi.bluememo.identity.domain.repository.UserRepository;
import com.bluedigi.bluememo.identity.infrastructure.persistence.entity.UserEntity;
import com.bluedigi.bluememo.identity.infrastructure.persistence.mapper.UserMapper;
import com.bluedigi.bluememo.identity.infrastructure.persistence.repository.UserJpaRepository;

@Repository
public class UserRepositoryAdapter implements UserRepository {
    private final UserJpaRepository repository;
    private final UserMapper mapper;
    
    public UserRepositoryAdapter(UserJpaRepository repository, UserMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Override
    public User save(User user) {
        UserEntity userEntity = mapper.userToUserEntity(user);
        return mapper.userEntityToUser(repository.save(userEntity));
    }

    @Override
    public Optional<User> findById(UUID id) {
        return repository.findById(id).map(mapper::userEntityToUser);
    }

    @Override
    public Optional<User> findByEmail(String email) {
        return repository.findByEmail(email).map(mapper::userEntityToUser);
    }
    
    @Override
    public boolean existsById(UUID id) {
        return repository.existsById(id);
    }

    @Override
    public boolean existsByEmail(String email) {
        return repository.existsByEmail(email);
    }

    @Override
    public boolean existsByPhone(String phone) {
        return repository.existsByPhone(phone);
    }

    @Override
    public User update(User user) {
        UserEntity existingEntity = repository.findById(user.getId())
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "User not found"
                        )
                );
            
        mapper.updateUserEntity(user, existingEntity);
            
        UserEntity updatedEntity =
                repository.saveAndFlush(existingEntity);
            
        return mapper.userEntityToUser(updatedEntity);
    }  
}
