package com.roadmap.controller;

import com.roadmap.model.User;
import com.roadmap.security.JwtUtil;
import com.roadmap.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired private AuthenticationManager authManager;
    @Autowired private UserService userService;
    @Autowired private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> req) {
        try {
            authManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.get("username"), req.get("password"))
            );
            UserDetails ud = userService.loadUserByUsername(req.get("username"));
            String token = jwtUtil.generateToken(ud.getUsername());
            User user = userService.getByUsername(req.get("username"));
            return ResponseEntity.ok(Map.of(
                "token", token,
                "username", user.getUsername(),
                "displayName", user.getDisplayName(),
                "level", user.getLevel(),
                "xp", user.getXp()
            ));
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> req) {
        try {
            User user = userService.register(
                req.get("username"), req.get("password"),
                req.getOrDefault("displayName", req.get("username"))
            );
            String token = jwtUtil.generateToken(user.getUsername());
            return ResponseEntity.ok(Map.of(
                "token", token,
                "username", user.getUsername(),
                "displayName", user.getDisplayName(),
                "level", user.getLevel(),
                "xp", user.getXp()
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
