package com.makemytrip.makemytrip;

import com.makemytrip.makemytrip.models.Users;
import com.makemytrip.makemytrip.models.Users.Booking;
import com.makemytrip.makemytrip.repositories.UserRepository;
import com.makemytrip.makemytrip.services.CancellationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class CancellationServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private CancellationService cancellationService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testCancelBookingCalculatesFiftyPercentRefundWithin24h() {
        Users user = new Users();
        user.setId("u999");

        Booking booking = new Booking();
        booking.setBookingId("b101");
        booking.setDate(LocalDate.now().toString());
        booking.setTotalPrice(1000.0);
        booking.setStatus("CONFIRMED");

        user.getBookings().add(booking);

        when(userRepository.findById("u999")).thenReturn(Optional.of(user));
        when(userRepository.save(any(Users.class))).thenAnswer(i -> i.getArguments()[0]);

        Booking result = cancellationService.cancelBooking("u999", "b101", "Schedule Changed");

        assertNotNull(result);
        assertEquals("CANCELLED", result.getStatus());
        assertEquals("Schedule Changed", result.getCancellationReason());
        assertEquals(500.0, result.getRefundAmount(), 0.01);
        assertEquals("PROCESSED", result.getRefundStatus());
    }
}
