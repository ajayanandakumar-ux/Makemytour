package com.makemytrip.makemytrip.services;

import com.makemytrip.makemytrip.models.Hotel;
import com.makemytrip.makemytrip.models.UserPreferences;
import com.makemytrip.makemytrip.models.UserPreferences.RecommendationFeedback;
import com.makemytrip.makemytrip.repositories.HotelRepository;
import com.makemytrip.makemytrip.repositories.UserPreferencesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class RecommendationService {

    @Autowired
    private UserPreferencesRepository userPreferencesRepository;

    @Autowired
    private HotelRepository hotelRepository;

    public List<Map<String, Object>> getRecommendations(String userId) {
        UserPreferences prefs = userPreferencesRepository.findByUserId(userId)
                .orElseGet(() -> {
                    UserPreferences p = new UserPreferences();
                    p.setUserId(userId);
                    p.getCategoryScores().put("Beach", 5);
                    p.getCategoryScores().put("Luxury", 3);
                    return userPreferencesRepository.save(p);
                });

        List<Hotel> hotels = hotelRepository.findAll();
        List<Map<String, Object>> recommendations = new ArrayList<>();

        for (Hotel hotel : hotels) {
            Map<String, Object> rec = new HashMap<>();
            rec.put("id", hotel.getId());
            rec.put("title", hotel.getHotelName());
            rec.put("location", hotel.getLocation());
            rec.put("pricePerNight", hotel.getPricePerNight());
            rec.put("amenities", hotel.getAmenities());
            rec.put("category", hotel.getLocation().equalsIgnoreCase("Goa") ? "Beach" : "Luxury");
            rec.put("reason", "Based on your interest in " + (hotel.getLocation().equalsIgnoreCase("Goa") ? "Beach & Coastal Escapes" : "Luxury Heritage Stays") + " and top ratings.");
            rec.put("matchScore", "94% Match");
            recommendations.add(rec);
        }

        // Add a curated featured travel recommendation
        Map<String, Object> baliRec = new HashMap<>();
        baliRec.put("id", "rec-bali-01");
        baliRec.put("title", "Villa Resort Bali");
        baliRec.put("location", "Bali, Indonesia");
        baliRec.put("pricePerNight", 11500.0);
        baliRec.put("amenities", "Private Pool, Oceanfront, Spa");
        baliRec.put("category", "Beach");
        baliRec.put("reason", "You liked beaches! Try Bali based on your past destination preferences.");
        baliRec.put("matchScore", "98% Match");
        recommendations.add(baliRec);

        return recommendations;
    }

    public UserPreferences recordFeedback(String userId, String recommendationId, String entityType, boolean helpful) {
        UserPreferences prefs = userPreferencesRepository.findByUserId(userId)
                .orElseGet(() -> {
                    UserPreferences p = new UserPreferences();
                    p.setUserId(userId);
                    return p;
                });

        RecommendationFeedback feedback = new RecommendationFeedback();
        feedback.setRecommendationId(recommendationId);
        feedback.setEntityType(entityType);
        feedback.setHelpful(helpful);

        prefs.getFeedbacks().removeIf(f -> f.getRecommendationId().equals(recommendationId));
        prefs.getFeedbacks().add(feedback);

        return userPreferencesRepository.save(prefs);
    }
}
