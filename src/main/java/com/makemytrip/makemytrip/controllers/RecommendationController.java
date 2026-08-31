package com.makemytrip.makemytrip.controllers;

import com.makemytrip.makemytrip.models.UserPreferences;
import com.makemytrip.makemytrip.services.RecommendationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/recommendations")
@CrossOrigin(origins = "*")
public class RecommendationController {

    @Autowired
    private RecommendationService recommendationService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Map<String, Object>>> getRecommendations(@PathVariable String userId) {
        return ResponseEntity.ok(recommendationService.getRecommendations(userId));
    }

    @PostMapping("/feedback")
    public ResponseEntity<UserPreferences> recordFeedback(
            @RequestParam String userId,
            @RequestParam String recommendationId,
            @RequestParam(required = false, defaultValue = "HOTEL") String entityType,
            @RequestParam boolean helpful) {
        return ResponseEntity.ok(recommendationService.recordFeedback(userId, recommendationId, entityType, helpful));
    }
}
