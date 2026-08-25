package com.makemytrip.makemytrip.controllers;

import com.makemytrip.makemytrip.models.Users;
import com.makemytrip.makemytrip.services.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/booking")
@CrossOrigin(origins = "*")
public class BookingController {
    @Autowired
    private BookingService bookingService;

    @PostMapping("/flight")
    public ResponseEntity<Users.Booking> bookFlight(
            @RequestParam String userId,
            @RequestParam String flightId,
            @RequestParam int seats,
            @RequestParam double price) {
        Users.Booking booking = bookingService.bookFlight(userId, flightId, seats, price);
        return ResponseEntity.ok(booking);
    }

    @PostMapping("/hotel")
    public ResponseEntity<Users.Booking> bookhotel(
            @RequestParam String userId,
            @RequestParam String hotelId,
            @RequestParam int rooms,
            @RequestParam double price) {
        Users.Booking booking = bookingService.bookhotel(userId, hotelId, rooms, price);
        return ResponseEntity.ok(booking);
    }
}
