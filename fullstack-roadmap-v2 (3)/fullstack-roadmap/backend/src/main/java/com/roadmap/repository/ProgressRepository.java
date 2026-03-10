package com.roadmap.repository;

import com.roadmap.model.Progress;
import com.roadmap.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ProgressRepository extends JpaRepository<Progress, Long> {
    List<Progress> findByUserAndCompleted(User user, boolean completed);
    List<Progress> findByUser(User user);
    Optional<Progress> findByUserAndTaskKey(User user, String taskKey);
    long countByUserAndCompleted(User user, boolean completed);
}
