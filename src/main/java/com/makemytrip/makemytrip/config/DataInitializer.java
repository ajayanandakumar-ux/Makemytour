package com.makemytrip.makemytrip.config;

import com.makemytrip.makemytrip.models.Flight;
import com.makemytrip.makemytrip.models.Hotel;
import com.makemytrip.makemytrip.repositories.FlightRepository;
import com.makemytrip.makemytrip.repositories.HotelRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
public class DataInitializer implements CommandLineRunner {

    private final FlightRepository flightRepository;
    private final HotelRepository hotelRepository;

    public DataInitializer(FlightRepository flightRepository, HotelRepository hotelRepository) {
        this.flightRepository = flightRepository;
        this.hotelRepository = hotelRepository;
    }

    @Override
    public void run(String... args) {
        if (flightRepository.count() == 0) {
            Flight f1 = new Flight();
            f1.setFlightName("Air India AI-101");
            f1.setFrom("Delhi");
            f1.setTo("Mumbai");
            f1.setDepartureTime("2026-09-01T08:00:00");
            f1.setArrivalTime("2026-09-01T10:15:00");
            f1.setPrice(4500.0);
            f1.setAvailableSeats(60);

            Flight f2 = new Flight();
            f2.setFlightName("IndiGo 6E-204");
            f2.setFrom("Mumbai");
            f2.setTo("Bengaluru");
            f2.setDepartureTime("2026-09-01T11:30:00");
            f2.setArrivalTime("2026-09-01T13:15:00");
            f2.setPrice(3800.0);
            f2.setAvailableSeats(45);

            Flight f3 = new Flight();
            f3.setFlightName("Vistara UK-812");
            f3.setFrom("Delhi");
            f3.setTo("Goa");
            f3.setDepartureTime("2026-09-02T06:00:00");
            f3.setArrivalTime("2026-09-02T08:30:00");
            f3.setPrice(5900.0);
            f3.setAvailableSeats(30);

            flightRepository.saveAll(Arrays.asList(f1, f2, f3));
            System.out.println("✅ Sample flight records initialized.");
        }

        if (hotelRepository.count() == 0) {
            Hotel h1 = new Hotel();
            h1.setHotelName("Taj Mahal Palace");
            h1.setLocation("Mumbai");
            h1.setPricePerNight(15000.0);
            h1.setAvailableRooms(15);
            h1.setAmenities("WiFi, Pool, Spa, Ocean View, Fine Dining");

            Hotel h2 = new Hotel();
            h2.setHotelName("The Leela Palace");
            h2.setLocation("Bengaluru");
            h2.setPricePerNight(12000.0);
            h2.setAvailableRooms(20);
            h2.setAmenities("WiFi, Fitness Center, Swimming Pool, Breakfast Included");

            Hotel h3 = new Hotel();
            h3.setHotelName("Grand Hyatt");
            h3.setLocation("Goa");
            h3.setPricePerNight(9500.0);
            h3.setAvailableRooms(25);
            h3.setAmenities("Beach Access, Pool, Spa, Bar, Free WiFi");

            hotelRepository.saveAll(Arrays.asList(h1, h2, h3));
            System.out.println("✅ Sample hotel records initialized.");
        }
    }
}
