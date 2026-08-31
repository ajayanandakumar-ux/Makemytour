package com.makemytrip.makemytrip.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Document(collection = "user_preferences")
public class UserPreferences {
    @Id
    private String id;
    private String userId;
    private Map<String, Integer> categoryScores = new HashMap<>(); // e.g. "Beach": 5, "Luxury": 3
    private List<String> savedDestinations = new ArrayList<>();
    private List<RecommendationFeedback> feedbacks = new ArrayList<>();

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public Map<String, Integer> getCategoryScores() {
        return categoryScores;
    }

    public void setCategoryScores(Map<String, Integer> categoryScores) {
        this.categoryScores = categoryScores;
    }

    public List<String> getSavedDestinations() {
        return savedDestinations;
    }

    public void setSavedDestinations(List<String> savedDestinations) {
        this.savedDestinations = savedDestinations;
    }

    public List<RecommendationFeedback> getFeedbacks() {
        return feedbacks;
    }

    public void setFeedbacks(List<RecommendationFeedback> feedbacks) {
        this.feedbacks = feedbacks;
    }

    public static class RecommendationFeedback {
        private String recommendationId;
        private String entityType;
        private boolean helpful;

        public String getRecommendationId() {
            return recommendationId;
        }

        public void setRecommendationId(String recommendationId) {
            this.recommendationId = recommendationId;
        }

        public String getEntityType() {
            return entityType;
        }

        public void setEntityType(String entityType) {
            this.entityType = entityType;
        }

        public boolean isHelpful() {
            return helpful;
        }

        public void setHelpful(boolean helpful) {
            this.helpful = helpful;
        }
    }
}
