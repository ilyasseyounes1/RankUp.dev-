package com.roadmap.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Entity
@Table(name = "daily_activity", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_id", "activity_date"})
})
@Data
@NoArgsConstructor
public class DailyActivity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "activity_date")
    private LocalDate activityDate;

    private int tasksCompleted = 0;
}
