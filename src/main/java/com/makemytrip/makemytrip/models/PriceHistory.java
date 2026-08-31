package com.makemytrip.makemytrip.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Document(collection = "price_history")
public class PriceHistory {
    @Id
    private String id;
    private String entityId;
    private String entityType; // "FLIGHT" or "HOTEL"
    private double basePrice;
    private double currentPrice;
    private double surgeMultiplier = 1.0;
    private String demandLevel = "NORMAL"; // LOW, NORMAL, HIGH, PEAK
    private List<PricePoint> history = new ArrayList<>();
    private List<PriceLock> priceLocks = new ArrayList<>();

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getEntityId() {
        return entityId;
    }

    public void setEntityId(String entityId) {
        this.entityId = entityId;
    }

    public String getEntityType() {
        return entityType;
    }

    public void setEntityType(String entityType) {
        this.entityType = entityType;
    }

    public double getBasePrice() {
        return basePrice;
    }

    public void setBasePrice(double basePrice) {
        this.basePrice = basePrice;
    }

    public double getCurrentPrice() {
        return currentPrice;
    }

    public void setCurrentPrice(double currentPrice) {
        this.currentPrice = currentPrice;
    }

    public double getSurgeMultiplier() {
        return surgeMultiplier;
    }

    public void setSurgeMultiplier(double surgeMultiplier) {
        this.surgeMultiplier = surgeMultiplier;
    }

    public String getDemandLevel() {
        return demandLevel;
    }

    public void setDemandLevel(String demandLevel) {
        this.demandLevel = demandLevel;
    }

    public List<PricePoint> getHistory() {
        return history;
    }

    public void setHistory(List<PricePoint> history) {
        this.history = history;
    }

    public List<PriceLock> getPriceLocks() {
        return priceLocks;
    }

    public void setPriceLocks(List<PriceLock> priceLocks) {
        this.priceLocks = priceLocks;
    }

    public static class PricePoint {
        private String date;
        private double price;

        public PricePoint() {}

        public PricePoint(String date, double price) {
            this.date = date;
            this.price = price;
        }

        public String getDate() {
            return date;
        }

        public void setDate(String date) {
            this.date = date;
        }

        public double getPrice() {
            return price;
        }

        public void setPrice(double price) {
            this.price = price;
        }
    }

    public static class PriceLock {
        private String userId;
        private double lockedPrice;
        private String lockExpiration;

        public String getUserId() {
            return userId;
        }

        public void setUserId(String userId) {
            this.userId = userId;
        }

        public double getLockedPrice() {
            return lockedPrice;
        }

        public void setLockedPrice(double lockedPrice) {
            this.lockedPrice = lockedPrice;
        }

        public String getLockExpiration() {
            return lockExpiration;
        }

        public void setLockExpiration(String lockExpiration) {
            this.lockExpiration = lockExpiration;
        }
    }
}
