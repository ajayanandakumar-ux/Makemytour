package com.makemytrip.makemytrip.services;

import com.makemytrip.makemytrip.models.Users;
import com.makemytrip.makemytrip.models.Users.Booking;
import com.makemytrip.makemytrip.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

@Service
public class CancellationService {

    @Autowired
    private UserRepository userRepository;

    public Booking cancelBooking(String userId, String bookingId, String reason) {
        Users user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Booking targetBooking = user.getBookings().stream()
                .filter(b -> b.getBookingId().equals(bookingId) || b.getItemReferenceId() != null && b.getItemReferenceId().equals(bookingId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if ("CANCELLED".equalsIgnoreCase(targetBooking.getStatus())) {
            throw new RuntimeException("Booking is already cancelled");
        }

        targetBooking.setStatus("CANCELLED");
        targetBooking.setCancellationReason(reason != null ? reason : "Personal Reasons");
        targetBooking.setCancellationDate(LocalDate.now().toString());

        // Policy: 50% refund if within 1 day of booking date, 75% refund if prior
        double refundPercentage = 0.50;
        try {
            if (targetBooking.getDate() != null) {
                LocalDate bookingDate = LocalDate.parse(targetBooking.getDate());
                long daysDifference = ChronoUnit.DAYS.between(bookingDate, LocalDate.now());
                if (daysDifference == 0) {
                    refundPercentage = 0.50; // 50% within 24h
                } else if (daysDifference < 0) {
                    refundPercentage = 0.80; // 80% advance cancellation
                }
            }
        } catch (Exception e) {
            refundPercentage = 0.50;
        }

        double calculatedRefund = targetBooking.getTotalPrice() * refundPercentage;
        targetBooking.setRefundAmount(calculatedRefund);
        targetBooking.setRefundStatus("PROCESSED");
        targetBooking.setExpectedRefundTimeline("3-5 Business Days");

        userRepository.save(user);
        return targetBooking;
    }
}
