package com.makemytrip.makemytrip;

import com.makemytrip.makemytrip.models.Users;
import com.makemytrip.makemytrip.repositories.UserRepository;
import com.makemytrip.makemytrip.services.UserServices;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class UserServicesTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserServices userServices;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testSignupSuccess() {
        Users newUser = new Users();
        newUser.setEmail("test@example.com");
        newUser.setPassword("password123");

        when(userRepository.findByEmail("test@example.com")).thenReturn(null);
        when(passwordEncoder.encode("password123")).thenReturn("encodedPassword");
        when(userRepository.save(any(Users.class))).thenAnswer(i -> i.getArguments()[0]);

        Users createdUser = userServices.signup(newUser);

        assertNotNull(createdUser);
        assertEquals("USER", createdUser.getRole());
        assertEquals("encodedPassword", createdUser.getPassword());
        verify(userRepository, times(1)).save(any(Users.class));
    }

    @Test
    void testSignupDuplicateEmailThrowsException() {
        Users existingUser = new Users();
        existingUser.setEmail("existing@example.com");

        when(userRepository.findByEmail("existing@example.com")).thenReturn(existingUser);

        Users newUser = new Users();
        newUser.setEmail("existing@example.com");

        assertThrows(RuntimeException.class, () -> userServices.signup(newUser));
    }

    @Test
    void testLoginSuccess() {
        Users user = new Users();
        user.setEmail("user@example.com");
        user.setPassword("encodedPassword");

        when(userRepository.findByEmail("user@example.com")).thenReturn(user);
        when(passwordEncoder.matches("rawPassword", "encodedPassword")).thenReturn(true);

        Users loggedInUser = userServices.login("user@example.com", "rawPassword");

        assertNotNull(loggedInUser);
        assertEquals("user@example.com", loggedInUser.getEmail());
    }
}
