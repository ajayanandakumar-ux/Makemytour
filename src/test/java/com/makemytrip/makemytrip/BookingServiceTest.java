package com.makemytrip.makemytrip;

import com.makemytrip.makemytrip.models.Flight;
import com.makemytrip.makemytrip.models.Hotel;
import com.makemytrip.makemytrip.models.Users;
import com.makemytrip.makemytrip.repositories.FlightRepository;
import com.makemytrip.makemytrip.repositories.HotelRepository;
import com.makemytrip.makemytrip.repositories.UserRepository;
import com.makemytrip.makemytrip.services.BookingService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class BookingServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private FlightRepository flightRepository;

    @Mock
    private HotelRepository hotelRepository;

    @InjectMocks
    private BookingService bookingService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testBookFlightSuccess() {
        Users user = new Users();
        user.setId("u123");

        Flight flight = new Flight();
        flight.setId("f123");
        flight.setAvailableSeats(10);

        when(userRepository.findById("u123")).thenReturn(Optional.of(user));
        when(flightRepository.findById("f123")).thenReturn(Optional.of(flight));

        Users.Booking booking = bookingService.bookFlight("u123", "f123", 2, 500.0);

        assertNotNull(booking);
        assertEquals("Flight", booking.getType());
        assertEquals(8, flight.getAvailableSeats());
        assertEquals(1, user.getBookings().size());
    }

    @Test
    void testBookHotelSuccess() {
        Users user = new Users();
        user.setId("u123");

        Hotel hotel = new Hotel();
        hotel.setId("h123");
        hotel.setAvailableRooms(5);

        when(userRepository.findById("u123")).thenReturn(Optional.of(user));
        when(hotelRepository.findById("h123")).thenReturn(Optional.of(hotel));

        Users.Booking booking = bookingService.bookhotel("u123", "h123", 1, 150.0);

        assertNotNull(booking);
        assertEquals("Hotel", booking.getType());
        assertEquals(4, hotel.getAvailableRooms());
        assertEquals(1, user.getBookings().size());
    }
}
