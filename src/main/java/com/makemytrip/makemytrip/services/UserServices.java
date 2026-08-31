package com.makemytrip.makemytrip.services;

import com.makemytrip.makemytrip.models.Users;
import com.makemytrip.makemytrip.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserServices {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Users login(String email, String password) {
        if (email == null || password == null) {
            return null;
        }
        Users user = userRepository.findByEmail(email);
        if (user != null && passwordEncoder.matches(password, user.getPassword())) {
            return user;
        }
        return null;
    }

    public Users signup(Users user) {
        if (user == null || user.getEmail() == null) {
            throw new IllegalArgumentException("User details and email are required");
        }
        if (userRepository.findByEmail(user.getEmail()) != null) {
            throw new RuntimeException("Email is already registered");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        if (user.getRole() == null) {
            user.setRole("USER");
        }
        return userRepository.save(user);
    }

    public Users getUserByEmail(String email) {
        if (email == null) return null;
        return userRepository.findByEmail(email);
    }

    public Users editprofile(String id, Users updatedUser) {
        if (id == null || updatedUser == null) return null;
        Users user = userRepository.findById(id).orElse(null);
        if (user != null) {
            user.setFirstName(updatedUser.getFirstName());
            user.setLastName(updatedUser.getLastName());
            user.setPhoneNumber(updatedUser.getPhoneNumber());
            return userRepository.save(user);
        }
        return null;
    }

    public Users updatePreferences(String id, String preferredSeat, String preferredRoomType) {
        if (id == null) return null;
        Users user = userRepository.findById(id).orElse(null);
        if (user != null) {
            if (preferredSeat != null) user.setPreferredSeat(preferredSeat);
            if (preferredRoomType != null) user.setPreferredRoomType(preferredRoomType);
            return userRepository.save(user);
        }
        return null;
    }
}
