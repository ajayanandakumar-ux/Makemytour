package com.makemytrip.makemytrip;

import com.makemytrip.makemytrip.repositories.FlightRepository;
import com.makemytrip.makemytrip.repositories.HotelRepository;
import com.makemytrip.makemytrip.repositories.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

@SpringBootTest
class MakemytripApplicationTests {

    @MockBean
    private FlightRepository flightRepository;

    @MockBean
    private HotelRepository hotelRepository;

    @MockBean
    private UserRepository userRepository;

    @Test
    void contextLoads() {
    }

}
