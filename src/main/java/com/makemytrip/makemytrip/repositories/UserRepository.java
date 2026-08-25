package com.makemytrip.makemytrip.repositories;

import com.makemytrip.makemytrip.models.Users;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface UserRepository extends MongoRepository<Users, String> {
    Users findByEmail(String email);
    Optional<Users> findByEmailIgnoreCase(String email);
}
