package com.bechanger.feedback;

import com.bechanger.common.BaseEntity;
import com.bechanger.product.Product;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;


@Getter
@Setter
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Feedback extends BaseEntity {

    private Double note;
    private String comment;


    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

}
