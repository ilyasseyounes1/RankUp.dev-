package com.roadmap.service;

import com.roadmap.model.User;
import com.roadmap.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.userdetails.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class UserService implements UserDetailsService {

    private final UserRepository userRepo;
    private final PasswordEncoder encoder;

    // @Lazy on PasswordEncoder breaks the cycle:
    // SecurityConfig creates PasswordEncoder bean, but SecurityConfig also depends on UserService.
    // Making the PasswordEncoder injection lazy means UserService can be fully constructed first.
    @Autowired
    public UserService(UserRepository userRepo, @Lazy PasswordEncoder encoder) {
        this.userRepo = userRepo;
        this.encoder = encoder;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
        return org.springframework.security.core.userdetails.User
                .withUsername(user.getUsername())
                .password(user.getPassword())
                .roles("USER")
                .build();
    }

    public User register(String username, String password, String displayName) {
        if (userRepo.existsByUsername(username))
            throw new RuntimeException("Username already taken");
        User u = new User();
        u.setUsername(username);
        u.setPassword(encoder.encode(password));
        u.setDisplayName(displayName != null ? displayName : username);
        return userRepo.save(u);
    }

    public User getByUsername(String username) {
        return userRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User updateActivity(User user) {
        user.setLastActive(LocalDateTime.now());
        return userRepo.save(user);
    }

    public User addXp(User user, int xpGain) {
        user.setXp(user.getXp() + xpGain);
        user.setLevel(1 + user.getXp() / 200);
        user.setTotalTasksDone(user.getTotalTasksDone() + 1);
        return userRepo.save(user);
    }

    public User removeXp(User user, int xpLoss) {
        int newXp = Math.max(0, user.getXp() - xpLoss);
        user.setXp(newXp);
        user.setLevel(1 + newXp / 200);
        int newTasks = Math.max(0, user.getTotalTasksDone() - 1);
        user.setTotalTasksDone(newTasks);
        return userRepo.save(user);
    }
}
