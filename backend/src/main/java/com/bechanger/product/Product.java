package com.bechanger.product;

import com.bechanger.common.BaseEntity;
import com.bechanger.feedback.Feedback;
import com.bechanger.history.ProductTransactionHistory;
import com.bechanger.user.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.util.List;


@Getter
@Setter
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Product extends BaseEntity {

    private String name; // title
    private String brand; // authorName
    private String identifier; //isbn
    private String description; // synopsis
    private String coverImage; // bookCover
    private boolean archived;
    private boolean available; // shareable

    @ManyToOne
    @JoinColumn(name = "owner_id")
    private User owner;

    @OneToMany(mappedBy = "product")
    private List<Feedback> feedbacks;

    @OneToMany(mappedBy = "product")
    private List<ProductTransactionHistory> histories;

    @Transient
    public double getRate() {
        if (feedbacks == null || feedbacks.isEmpty()) {
            return 0.0;
        }
        var rate = this.feedbacks.stream()
                .mapToDouble(Feedback::getNote)
                .average()
                .orElse(0.0);
        //3.23 -> 3.0 || 3.65 --> 4.0
        double rounderRate = Math.round(rate * 10.0) / 10.0;
        return rounderRate;
    }

}
