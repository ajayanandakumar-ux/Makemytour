package com.makemytrip.makemytrip.controllers;

import com.makemytrip.makemytrip.models.FlightStatus;
import com.makemytrip.makemytrip.services.FlightStatusService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/flight-status")
@CrossOrigin(origins = "*")
public class FlightStatusController {

    @Autowired
    private FlightStatusService flightStatusService;

    @GetMapping("/{flightId}")
    public ResponseEntity<FlightStatus> getFlightStatus(@PathVariable String flightId) {
        return ResponseEntity.ok(flightStatusService.getOrGenerateStatus(flightId));
    }

    @PostMapping("/update")
    public ResponseEntity<FlightStatus> updateStatus(
            @RequestParam String flightId,
            @RequestParam String status,
            @RequestParam(required = false, defaultValue = "0") int delayMinutes,
            @RequestParam(required = false, defaultValue = "Operational delay") String reason) {
        return ResponseEntity.ok(flightStatusService.updateFlightStatus(flightId, status, delayMinutes, reason));
    }

    @GetMapping("/all")
    public ResponseEntity<List<FlightStatus>> getAllStatuses() {
        return ResponseEntity.ok(flightStatusService.getAllStatuses());
    }
}
