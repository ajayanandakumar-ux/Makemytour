package com.makemytrip.makemytrip.controllers;

import com.makemytrip.makemytrip.models.Flight;
import com.makemytrip.makemytrip.models.Hotel;
import com.makemytrip.makemytrip.models.Users;
import com.makemytrip.makemytrip.models.Review;
import com.makemytrip.makemytrip.models.Users.Booking;
import com.makemytrip.makemytrip.services.ReviewService;
import com.makemytrip.makemytrip.repositories.FlightRepository;
import com.makemytrip.makemytrip.repositories.HotelRepository;
import com.makemytrip.makemytrip.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private HotelRepository hotelRepository;

    @Autowired
    private FlightRepository flightRepository;

    @Autowired
    private ReviewService reviewService;

    @GetMapping("/users")
    public ResponseEntity<List<Users>> getallusers() {
        List<Users> users = userRepository.findAll();
        return ResponseEntity.ok(users);
    }

    @PostMapping("/flight")
    public ResponseEntity<Flight> addflight(@RequestBody Flight flight) {
        Flight saved = flightRepository.save(flight);
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/hotel")
    public ResponseEntity<Hotel> addhotel(@RequestBody Hotel hotel) {
        Hotel saved = hotelRepository.save(hotel);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/flight/{id}")
    public ResponseEntity<Flight> editflight(@PathVariable String id, @RequestBody Flight updatedFlight) {
        Optional<Flight> flightOptional = flightRepository.findById(id);
        if (flightOptional.isPresent()) {
            Flight flight = flightOptional.get();
            flight.setFlightName(updatedFlight.getFlightName());
            flight.setFrom(updatedFlight.getFrom());
            flight.setTo(updatedFlight.getTo());
            flight.setDepartureTime(updatedFlight.getDepartureTime());
            flight.setArrivalTime(updatedFlight.getArrivalTime());
            flight.setPrice(updatedFlight.getPrice());
            flight.setAvailableSeats(updatedFlight.getAvailableSeats());
            flightRepository.save(flight);
            return ResponseEntity.ok(flight);
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/hotel/{id}")
    public ResponseEntity<Hotel> editHotel(@PathVariable String id, @RequestBody Hotel updatedHotel) {
        Optional<Hotel> hotelOptional = hotelRepository.findById(id);
        if (hotelOptional.isPresent()) {
            Hotel hotel = hotelOptional.get();
            hotel.setHotelName(updatedHotel.getHotelName());
            hotel.setLocation(updatedHotel.getLocation());
            hotel.setAvailableRooms(updatedHotel.getAvailableRooms());
            hotel.setPricePerNight(updatedHotel.getPricePerNight());
            hotel.setAmenities(updatedHotel.getAmenities());
            hotelRepository.save(hotel);
            return ResponseEntity.ok(hotel);
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/refunds/{userId}/{bookingId}/status")
    public ResponseEntity<Booking> updateRefundStatus(
            @PathVariable String userId,
            @PathVariable String bookingId,
            @RequestParam String status) {
        Optional<Users> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            Users user = userOpt.get();
            Optional<Booking> bookingOpt = user.getBookings().stream()
                    .filter(b -> b.getBookingId().equals(bookingId) || (b.getItemReferenceId() != null && b.getItemReferenceId().equals(bookingId)))
                    .findFirst();
            if (bookingOpt.isPresent()) {
                Booking booking = bookingOpt.get();
                booking.setRefundStatus(status.toUpperCase());
                if ("COMPLETED".equalsIgnoreCase(status)) {
                    booking.setExpectedRefundTimeline("Completed - Credited to Account");
                } else if ("PROCESSED".equalsIgnoreCase(status)) {
                    booking.setExpectedRefundTimeline("1-2 Business Days");
                }
                userRepository.save(user);
                return ResponseEntity.ok(booking);
            }
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/reviews/flagged")
    public ResponseEntity<List<Review>> getFlaggedReviews() {
        return ResponseEntity.ok(reviewService.getFlaggedReviews());
    }

    @PostMapping("/reviews/{reviewId}/approve")
    public ResponseEntity<Review> approveReview(@PathVariable String reviewId) {
        return ResponseEntity.ok(reviewService.approveReview(reviewId));
    }

    @DeleteMapping("/reviews/{reviewId}")
    public ResponseEntity<Void> deleteReview(@PathVariable String reviewId) {
        reviewService.deleteReview(reviewId);
        return ResponseEntity.ok().build();
    }
}
