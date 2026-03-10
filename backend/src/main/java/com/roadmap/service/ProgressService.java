package com.roadmap.service;

import com.roadmap.model.DailyActivity;
import com.roadmap.model.Progress;
import com.roadmap.model.User;
import com.roadmap.repository.DailyActivityRepository;
import com.roadmap.repository.ProgressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ProgressService {

    @Autowired private ProgressRepository progressRepo;
    @Autowired private DailyActivityRepository activityRepo;
    @Autowired private UserService userService;

    public Set<String> getCompletedKeys(User user) {
        return progressRepo.findByUserAndCompleted(user, true)
                .stream().map(Progress::getTaskKey).collect(Collectors.toSet());
    }

    @Transactional
    public boolean toggleTask(User user, String taskKey) {
        Optional<Progress> existing = progressRepo.findByUserAndTaskKey(user, taskKey);
        boolean nowCompleted;

        if (existing.isPresent()) {
            Progress p = existing.get();
            nowCompleted = !p.isCompleted();
            p.setCompleted(nowCompleted);
            p.setCompletedAt(nowCompleted ? LocalDateTime.now() : null);
            progressRepo.save(p);
        } else {
            Progress p = new Progress();
            p.setUser(user);
            p.setTaskKey(taskKey);
            p.setCompleted(true);
            p.setCompletedAt(LocalDateTime.now());
            progressRepo.save(p);
            nowCompleted = true;
        }

        if (nowCompleted) {
            userService.addXp(user, 50);
            recordActivity(user);
        } else {
            userService.removeXp(user, 50);
        }

        return nowCompleted;
    }

    private void recordActivity(User user) {
        LocalDate today = LocalDate.now();
        Optional<DailyActivity> existing = activityRepo.findByUserAndActivityDate(user, today);
        if (existing.isPresent()) {
            DailyActivity a = existing.get();
            a.setTasksCompleted(a.getTasksCompleted() + 1);
            activityRepo.save(a);
        } else {
            DailyActivity a = new DailyActivity();
            a.setUser(user);
            a.setActivityDate(today);
            a.setTasksCompleted(1);
            activityRepo.save(a);
        }
    }

    public int getCurrentStreak(User user) {
        List<DailyActivity> activities = activityRepo.findByUserOrderByActivityDateDesc(user);
        if (activities.isEmpty()) return 0;
        int streak = 0;
        LocalDate expected = LocalDate.now();
        for (DailyActivity a : activities) {
            if (a.getActivityDate().equals(expected) || a.getActivityDate().equals(expected.minusDays(1))) {
                streak++;
                expected = a.getActivityDate().minusDays(1);
            } else break;
        }
        return streak;
    }

    public List<Map<String, Object>> getLast30DaysActivity(User user) {
        LocalDate from = LocalDate.now().minusDays(29);
        LocalDate to = LocalDate.now();
        List<DailyActivity> activities = activityRepo.findByUserAndActivityDateBetween(user, from, to);
        Map<LocalDate, Integer> actMap = activities.stream()
                .collect(Collectors.toMap(DailyActivity::getActivityDate, DailyActivity::getTasksCompleted));

        List<Map<String, Object>> result = new ArrayList<>();
        for (int i = 0; i < 30; i++) {
            LocalDate date = from.plusDays(i);
            Map<String, Object> entry = new HashMap<>();
            entry.put("date", date.toString());
            entry.put("tasks", actMap.getOrDefault(date, 0));
            result.add(entry);
        }
        return result;
    }
}
