package com.roadmap.controller;

import com.roadmap.model.User;
import com.roadmap.service.ProgressService;
import com.roadmap.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/progress")
public class ProgressController {

    @Autowired private ProgressService progressService;
    @Autowired private UserService userService;

    @GetMapping
    public ResponseEntity<?> getProgress(@AuthenticationPrincipal UserDetails ud) {
        User user = userService.getByUsername(ud.getUsername());
        Set<String> completed = progressService.getCompletedKeys(user);
        int streak = progressService.getCurrentStreak(user);
        return ResponseEntity.ok(Map.of(
            "completedKeys", completed,
            "streak", streak,
            "level", user.getLevel(),
            "xp", user.getXp(),
            "totalTasksDone", user.getTotalTasksDone(),
            "displayName", user.getDisplayName()
        ));
    }

    @PostMapping("/toggle")
    public ResponseEntity<?> toggle(@AuthenticationPrincipal UserDetails ud,
                                     @RequestBody Map<String, String> req) {
        User user = userService.getByUsername(ud.getUsername());
        boolean completed = progressService.toggleTask(user, req.get("taskKey"));
        User updated = userService.getByUsername(ud.getUsername());
        return ResponseEntity.ok(Map.of(
            "completed", completed,
            "level", updated.getLevel(),
            "xp", updated.getXp(),
            "totalTasksDone", updated.getTotalTasksDone()
        ));
    }

    @GetMapping("/activity")
    public ResponseEntity<?> getActivity(@AuthenticationPrincipal UserDetails ud) {
        User user = userService.getByUsername(ud.getUsername());
        return ResponseEntity.ok(Map.of(
            "activity", progressService.getLast30DaysActivity(user),
            "streak", progressService.getCurrentStreak(user)
        ));
    }
}
