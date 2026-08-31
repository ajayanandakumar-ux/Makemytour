package com.makemytrip.makemytrip.controllers;

import com.makemytrip.makemytrip.models.Users.Booking;
import com.makemytrip.makemytrip.services.CancellationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/cancellation")
@CrossOrigin(origins = "*")
public class CancellationController {

    @Autowired
    private CancellationService cancellationService;

    @PostMapping("/cancel")
    public ResponseEntity<Booking> cancelBooking(
            @RequestParam String userId,
            @RequestParam String bookingId,
            @RequestParam(required = false, defaultValue = "Personal Reasons") String reason) {
        Booking cancelledBooking = cancellationService.cancelBooking(userId, bookingId, reason);
        return ResponseEntity.ok(cancelledBooking);
    }
}
