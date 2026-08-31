package com.makemytrip.makemytrip.services;

import com.makemytrip.makemytrip.models.Review;
import com.makemytrip.makemytrip.repositories.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    public Review addReview(Review review) {
        if (review.getRating() < 1 || review.getRating() > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5 stars");
        }
        review.setCreatedAt(LocalDateTime.now().toString());
        return reviewRepository.save(review);
    }

    public List<Review> getReviews(String entityType, String entityId, String sortBy) {
        List<Review> reviews = reviewRepository.findByEntityTypeAndEntityId(entityType, entityId);

        if ("highest_rated".equalsIgnoreCase(sortBy)) {
            reviews.sort(Comparator.comparingInt(Review::getRating).reversed());
        } else if ("most_helpful".equalsIgnoreCase(sortBy)) {
            reviews.sort(Comparator.comparingInt(Review::getHelpfulCount).reversed());
        } else {
            // Default "newest"
            reviews.sort(Comparator.comparing(Review::getCreatedAt, Comparator.nullsLast(Comparator.reverseOrder())));
        }
        return reviews;
    }

    public Review addReply(String reviewId, String userId, String userName, String comment) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        Review.Reply reply = new Review.Reply();
        reply.setReplyId(UUID.randomUUID().toString());
        reply.setUserId(userId);
        reply.setUserName(userName);
        reply.setComment(comment);
        reply.setCreatedAt(LocalDateTime.now().toString());

        review.getReplies().add(reply);
        return reviewRepository.save(review);
    }

    public Review markHelpful(String reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));
        review.setHelpfulCount(review.getHelpfulCount() + 1);
        return reviewRepository.save(review);
    }

    public Review flagReview(String reviewId, String reason) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));
        review.setFlagged(true);
        review.setFlagReason(reason);
        return reviewRepository.save(review);
    }

    public List<Review> getFlaggedReviews() {
        return reviewRepository.findByFlaggedTrue();
    }

    public Review approveReview(String reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));
        review.setFlagged(false);
        review.setFlagReason(null);
        return reviewRepository.save(review);
    }

    public void deleteReview(String reviewId) {
        reviewRepository.deleteById(reviewId);
    }
}
