package com.bechanger.product;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

public interface ProductRepository extends JpaRepository<Product, Integer>, JpaSpecificationExecutor<Product> {
    @Query("""
            SELECT product
            FROM Product product
            WHERE product.archived = false
            AND product.available = true
            AND product.createdBy != : userId
            """)
    Page<Product> findAllDisplayableProducts(Pageable pageable, String userId);
}
