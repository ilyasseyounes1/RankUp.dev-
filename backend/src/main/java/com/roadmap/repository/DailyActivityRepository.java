package com.roadmap.repository;

import com.roadmap.model.DailyActivity;
import com.roadmap.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface DailyActivityRepository extends JpaRepository<DailyActivity, Long> {
    List<DailyActivity> findByUserOrderByActivityDateDesc(User user);
    Optional<DailyActivity> findByUserAndActivityDate(User user, LocalDate date);
    List<DailyActivity> findByUserAndActivityDateBetween(User user, LocalDate from, LocalDate to);
}
