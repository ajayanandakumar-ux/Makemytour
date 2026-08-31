package com.makemytrip.makemytrip.controllers;

import com.makemytrip.makemytrip.models.Users;
import com.makemytrip.makemytrip.services.UserServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
@CrossOrigin(origins = "*")
public class UserController {
    @Autowired
    private UserServices userServices;

    @PostMapping("/login")
    public ResponseEntity<Users> login(@RequestParam String email, @RequestParam String password) {
        Users user = userServices.login(email, password);
        if (user != null) {
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    @PostMapping("/signup")
    public ResponseEntity<Users> signup(@RequestBody Users user) {
        return ResponseEntity.ok(userServices.signup(user));
    }

    @GetMapping("/email")
    public ResponseEntity<Users> getuserbyemail(@RequestParam String email) {
        Users user = userServices.getUserByEmail(email);
        if (user != null) {
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/edit")
    public ResponseEntity<Users> editprofile(@RequestParam String id, @RequestBody Users updatedUser) {
        Users user = userServices.editprofile(id, updatedUser);
        if (user != null) {
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/preferences")
    public ResponseEntity<Users> updatePreferences(
            @RequestParam String userId,
            @RequestParam(required = false) String preferredSeat,
            @RequestParam(required = false) String preferredRoomType) {
        Users user = userServices.updatePreferences(userId, preferredSeat, preferredRoomType);
        if (user != null) {
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.notFound().build();
    }
}
