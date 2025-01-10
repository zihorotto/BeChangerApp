package com.bechanger.history;

import com.bechanger.common.BaseEntity;
import com.bechanger.product.Product;
import com.bechanger.user.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
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
public class ProductTransactionHistory extends BaseEntity {

    @Column(name = "user_id")
    private String userId;
    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;
    private boolean returned;
    private boolean returnApproved;
}
