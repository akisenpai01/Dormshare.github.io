package com.dormshare.backend.controller;

import com.dormshare.backend.model.User;
import com.dormshare.backend.repository.UserRepository;
import com.dormshare.backend.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    UserRepository userRepository;

    @Autowired
    JwtUtils jwtUtils;

    @Autowired
    PasswordEncoder passwordEncoder;

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@RequestBody Map<String, String> loginRequest) {
        String email = loginRequest.get("email");
        String password = loginRequest.get("password");

        Optional<User> user = userRepository.findByEmail(email);
        if (user.isPresent() && passwordMatches(password, user.get())) {
            if (user.get().getPassword().equals(password)) {
                user.get().setPassword(passwordEncoder.encode(password));
                userRepository.save(user.get());
            }
            String jwt = jwtUtils.generateJwtToken(email);
            Map<String, Object> response = new HashMap<>();
            response.put("token", jwt);
            response.put("userId", user.get().getId());
            response.put("name", user.get().getName());
            response.put("tokens", user.get().getTokens());
            response.put("hostelBlock", user.get().getHostelBlock());
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body("Error: Invalid credentials");
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody User signUpRequest) {
        if (userRepository.findByEmail(signUpRequest.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Error: Email is already in use!");
        }

        User user = new User(signUpRequest.getName(), signUpRequest.getEmail(), 
                             passwordEncoder.encode(signUpRequest.getPassword()), signUpRequest.getHostelBlock());
        userRepository.save(user);

        return ResponseEntity.ok("User registered successfully!");
    }

    private boolean passwordMatches(String rawPassword, User user) {
        return user.getPassword().equals(rawPassword) || passwordEncoder.matches(rawPassword, user.getPassword());
    }
}
