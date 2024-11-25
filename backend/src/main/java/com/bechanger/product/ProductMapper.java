package com.bechanger.product;

import com.bechanger.file.FileUtils;
import com.bechanger.history.ProductTransactionHistory;
import org.springframework.stereotype.Service;

@Service
public class ProductMapper {

    public Product toProduct(ProductRequest request) {
        return Product.builder()
                .id(request.id())
                .name(request.name())
                .brand(request.brand())
                .description(request.description())
                .archived(false)
                .available(request.available())
                .build();
    }

    public ProductResponse toProductResponse(Product product) {
        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .brand(product.getBrand())
                .identifier(product.getIdentifier())
                .description(product.getDescription())
                .rate(product.getRate())
                .archived(product.isArchived())
                .available(product.isAvailable())
                //.owner(product.getOwner().fullName())
                .coverImage(FileUtils.readFileFromLocation(product.getCoverImage()))
                .build();
    }

    public BorrowedProductResponse toBorrowedBookResponse(ProductTransactionHistory history) {
        return BorrowedProductResponse.builder()
                .id(history.getProduct().getId())
                .name(history.getProduct().getName())
                .brand(history.getProduct().getBrand())
                .identifier(history.getProduct().getIdentifier())
                .rate(history.getProduct().getRate())
                .returnedApproved(history.isReturnApproved())
                .returned(history.isReturned())
                .build();
    }
}
