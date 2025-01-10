package com.bechanger.history;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ProductTransactionHistoryRepository extends JpaRepository<ProductTransactionHistory, Integer> {

    @Query("""
            SELECT history
            FROM ProductTransactionHistory history
            WHERE history.userId =:userId
            """)
    Page<ProductTransactionHistory> findAllBorrowedProducts(Pageable pageable, String userId);

    @Query("""
            SELECT history
            FROM ProductTransactionHistory history
            WHERE history.product.createdBy =:userId
            """)
    Page<ProductTransactionHistory> findAllReturnedProducts(Pageable pageable, String userId);


    @Query("""
            SELECT
            (COUNT(*) > 0) AS isBorrowed
            FROM ProductTransactionHistory productTransactionHistory
            WHERE productTransactionHistory.userId =:userId
            AND productTransactionHistory.product.id =:productId
            AND productTransactionHistory.returnApproved = false
            """)
    boolean isAlreadyBorrowedByUser(@Param("productId") Integer productId, @Param("userId") String userId);


    @Query("""
            SELECT transaction
            FROM ProductTransactionHistory transaction
            WHERE transaction.userId =:userId
            AND transaction.product.id =:productId
            AND transaction.returned = false
            AND transaction.returnApproved = false
            """)
    Optional<ProductTransactionHistory> findByProductIdAndUserId(@Param("productId") Integer productId, @Param("userId") String userId);


    @Query("""
            SELECT transaction
            FROM ProductTransactionHistory transaction
            WHERE transaction.product.createdBy =:userId
            AND transaction.product.id =:productId
            AND transaction.returned = true
            AND transaction.returnApproved = false
            """)
    Optional<ProductTransactionHistory> findByProductIdAndOwnerId(@Param("productId") Integer productId, @Param("userId") String userId);
}
