package com.makemytrip.makemytrip.controllers;

import com.makemytrip.makemytrip.models.Review;
import com.makemytrip.makemytrip.services.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reviews")
@CrossOrigin(origins = "*")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @PostMapping
    public ResponseEntity<Review> addReview(@RequestBody Review review) {
        return ResponseEntity.ok(reviewService.addReview(review));
    }

    @GetMapping
    public ResponseEntity<List<Review>> getReviews(
            @RequestParam String entityType,
            @RequestParam String entityId,
            @RequestParam(required = false, defaultValue = "newest") String sortBy) {
        return ResponseEntity.ok(reviewService.getReviews(entityType, entityId, sortBy));
    }

    @PostMapping("/{reviewId}/reply")
    public ResponseEntity<Review> addReply(
            @PathVariable String reviewId,
            @RequestParam String userId,
            @RequestParam String userName,
            @RequestParam String comment) {
        return ResponseEntity.ok(reviewService.addReply(reviewId, userId, userName, comment));
    }

    @PostMapping("/{reviewId}/helpful")
    public ResponseEntity<Review> markHelpful(@PathVariable String reviewId) {
        return ResponseEntity.ok(reviewService.markHelpful(reviewId));
    }

    @PostMapping("/{reviewId}/flag")
    public ResponseEntity<Review> flagReview(
            @PathVariable String reviewId,
            @RequestParam(required = false, defaultValue = "Inappropriate content") String reason) {
        return ResponseEntity.ok(reviewService.flagReview(reviewId, reason));
    }

    @GetMapping("/flagged")
    public ResponseEntity<List<Review>> getFlaggedReviews() {
        return ResponseEntity.ok(reviewService.getFlaggedReviews());
    }
}
