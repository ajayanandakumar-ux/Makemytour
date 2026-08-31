package com.makemytrip.makemytrip.services;

import com.makemytrip.makemytrip.models.Flight;
import com.makemytrip.makemytrip.models.FlightStatus;
import com.makemytrip.makemytrip.repositories.FlightRepository;
import com.makemytrip.makemytrip.repositories.FlightStatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class FlightStatusService {

    @Autowired
    private FlightStatusRepository flightStatusRepository;

    @Autowired
    private FlightRepository flightRepository;

    public FlightStatus getOrGenerateStatus(String flightId) {
        Optional<FlightStatus> statusOpt = flightStatusRepository.findByFlightId(flightId);
        if (statusOpt.isPresent()) {
            return statusOpt.get();
        }

        // Generate status from flight details or default mock data
        Flight flight = flightRepository.findById(flightId).orElse(null);
        FlightStatus status = new FlightStatus();
        status.setFlightId(flightId);
        status.setFlightName(flight != null ? flight.getFlightName() : "Air India AI-101");
        status.setFrom(flight != null ? flight.getFrom() : "Delhi");
        status.setTo(flight != null ? flight.getTo() : "Mumbai");
        status.setStatus("ON_TIME");
        status.setDelayMinutes(0);
        status.setDelayReason("Weather clear");
        status.setOriginalDeparture(flight != null ? flight.getDepartureTime() : "08:00 AM");
        status.setRevisedDeparture(flight != null ? flight.getDepartureTime() : "08:00 AM");
        status.setEstimatedArrival(flight != null ? flight.getArrivalTime() : "10:15 AM");
        status.setTerminal("T3");
        status.setGate("Gate 14");
        status.setLastUpdated(LocalDateTime.now().toString());

        return flightStatusRepository.save(status);
    }

    public FlightStatus updateFlightStatus(String flightId, String statusStr, int delayMinutes, String reason) {
        FlightStatus status = getOrGenerateStatus(flightId);
        status.setStatus(statusStr);
        status.setDelayMinutes(delayMinutes);
        status.setDelayReason(reason);
        status.setLastUpdated(LocalDateTime.now().toString());
        return flightStatusRepository.save(status);
    }

    public List<FlightStatus> getAllStatuses() {
        return flightStatusRepository.findAll();
    }
}
