package com.makemytrip.makemytrip.repositories;

import com.makemytrip.makemytrip.models.UserPreferences;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface UserPreferencesRepository extends MongoRepository<UserPreferences, String> {
    Optional<UserPreferences> findByUserId(String userId);
}
