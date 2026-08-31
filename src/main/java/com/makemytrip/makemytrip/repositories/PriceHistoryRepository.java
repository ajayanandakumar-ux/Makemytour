package com.makemytrip.makemytrip.repositories;

import com.makemytrip.makemytrip.models.PriceHistory;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface PriceHistoryRepository extends MongoRepository<PriceHistory, String> {
    Optional<PriceHistory> findByEntityTypeAndEntityId(String entityType, String entityId);
}
