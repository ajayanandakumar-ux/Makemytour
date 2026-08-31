package com.makemytrip.makemytrip.controllers;

import com.makemytrip.makemytrip.models.PriceHistory;
import com.makemytrip.makemytrip.models.PriceHistory.PriceLock;
import com.makemytrip.makemytrip.services.PricingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/pricing")
@CrossOrigin(origins = "*")
public class PricingController {

    @Autowired
    private PricingService pricingService;

    @GetMapping("/history")
    public ResponseEntity<PriceHistory> getPriceHistory(
            @RequestParam String entityType,
            @RequestParam String entityId,
            @RequestParam(required = false, defaultValue = "5000") double basePrice) {
        return ResponseEntity.ok(pricingService.getOrGeneratePriceHistory(entityType, entityId, basePrice));
    }

    @PostMapping("/freeze")
    public ResponseEntity<PriceLock> freezePrice(
            @RequestParam String entityType,
            @RequestParam String entityId,
            @RequestParam String userId,
            @RequestParam double price) {
        return ResponseEntity.ok(pricingService.lockPrice(entityType, entityId, userId, price));
    }
}
