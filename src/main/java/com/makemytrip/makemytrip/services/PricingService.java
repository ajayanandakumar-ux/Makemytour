package com.makemytrip.makemytrip.services;

import com.makemytrip.makemytrip.models.PriceHistory;
import com.makemytrip.makemytrip.models.PriceHistory.PriceLock;
import com.makemytrip.makemytrip.models.PriceHistory.PricePoint;
import com.makemytrip.makemytrip.repositories.PriceHistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Optional;

@Service
public class PricingService {

    @Autowired
    private PriceHistoryRepository priceHistoryRepository;

    public PriceHistory getOrGeneratePriceHistory(String entityType, String entityId, double basePrice) {
        Optional<PriceHistory> historyOpt = priceHistoryRepository.findByEntityTypeAndEntityId(entityType, entityId);
        if (historyOpt.isPresent()) {
            return historyOpt.get();
        }

        PriceHistory ph = new PriceHistory();
        ph.setEntityType(entityType);
        ph.setEntityId(entityId);
        ph.setBasePrice(basePrice);
        ph.setSurgeMultiplier(1.20); // +20% surge during peak demand
        ph.setDemandLevel("HIGH");
        ph.setCurrentPrice(basePrice * 1.20);

        // Populate historical trend points for price history graph
        ph.getHistory().add(new PricePoint(LocalDate.now().minusDays(14).toString(), basePrice * 0.85));
        ph.getHistory().add(new PricePoint(LocalDate.now().minusDays(7).toString(), basePrice * 0.95));
        ph.getHistory().add(new PricePoint(LocalDate.now().minusDays(3).toString(), basePrice * 1.10));
        ph.getHistory().add(new PricePoint(LocalDate.now().toString(), basePrice * 1.20));

        return priceHistoryRepository.save(ph);
    }

    public PriceLock lockPrice(String entityType, String entityId, String userId, double price) {
        PriceHistory history = getOrGeneratePriceHistory(entityType, entityId, price);

        PriceLock lock = new PriceLock();
        lock.setUserId(userId);
        lock.setLockedPrice(price);
        lock.setLockExpiration(LocalDateTime.now().plusHours(24).toString());

        history.getPriceLocks().removeIf(l -> l.getUserId().equals(userId));
        history.getPriceLocks().add(lock);
        priceHistoryRepository.save(history);

        return lock;
    }
}
