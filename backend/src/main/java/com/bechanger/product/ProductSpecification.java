package com.bechanger.product;

import org.springframework.data.jpa.domain.Specification;

public class ProductSpecification {

    public static Specification<Product> withOwnerId(Integer ownerId) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("ownerId").get("id"), ownerId);
    }
}
