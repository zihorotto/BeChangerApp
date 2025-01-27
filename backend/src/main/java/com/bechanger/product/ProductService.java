package com.bechanger.product;

import com.bechanger.common.PageResponse;
import com.bechanger.exception.OperationNotPermittedException;
import com.bechanger.file.FileStorageService;
import com.bechanger.history.ProductTransactionHistory;
import com.bechanger.history.ProductTransactionHistoryRepository;
import com.bechanger.notification.Notification;
import com.bechanger.notification.NotificationService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Objects;

import static com.bechanger.notification.NotificationStatus.*;
import static com.bechanger.product.ProductSpecification.withOwnerId;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductMapper productMapper;
    private final ProductRepository productRepository;
    private final ProductTransactionHistoryRepository productTransactionHistoryRepository;
    private final FileStorageService fileStorageService;
    private final NotificationService notificationService;

    public Integer save(ProductRequest request) {
        Product product = productMapper.toProduct(request);
        return productRepository.save(product).getId();
    }

    public ProductResponse findById(Integer productId) {
        return productRepository.findById(productId)
                .map(productMapper::toProductResponse)
                .orElseThrow(() -> new EntityNotFoundException("Product not found"));
    }

    public PageResponse<ProductResponse> findAllProducts(int page, int size, Authentication connectedUser) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdDate").descending());
        Page<Product> products = productRepository.findAllDisplayableProducts(pageable, connectedUser.getName());
        List<ProductResponse> productResponses = products.stream()
                .map(productMapper::toProductResponse)
                .toList();
        return new PageResponse<>(
                productResponses,
                products.getNumber(),
                products.getSize(),
                products.getTotalElements(),
                products.getTotalPages(),
                products.isFirst(),
                products.isLast()
        );
    }

    public PageResponse<ProductResponse> findAllProductsByOwner(int page, int size, Authentication connectedUser) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdDate").descending());
        Page<Product> products = productRepository.findAll(withOwnerId(connectedUser.getName()), pageable);

        List<ProductResponse> productResponses = products.stream()
                .map(productMapper::toProductResponse)
                .toList();
        return new PageResponse<>(
                productResponses,
                products.getNumber(),
                products.getSize(),
                products.getTotalElements(),
                products.getTotalPages(),
                products.isFirst(),
                products.isLast()
        );
    }

    public PageResponse<BorrowedProductResponse> findAllBorrowedProducts(int page, int size, Authentication connectedUser) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdDate").descending());
        Page<ProductTransactionHistory> allBorrowedProducts = productTransactionHistoryRepository.findAllBorrowedProducts(pageable, connectedUser.getName());
        List<BorrowedProductResponse> productResponse = allBorrowedProducts.stream()
                .map(productMapper::toBorrowedBookResponse)
                .toList();
        return new PageResponse<>(
                productResponse,
                allBorrowedProducts.getNumber(),
                allBorrowedProducts.getSize(),
                allBorrowedProducts.getTotalElements(),
                allBorrowedProducts.getTotalPages(),
                allBorrowedProducts.isFirst(),
                allBorrowedProducts.isLast()
        );
    }

    public PageResponse<BorrowedProductResponse> findAllReturnedProducts(int page, int size, Authentication connectedUser) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdDate").descending());
        Page<ProductTransactionHistory> allBorrowedProducts = productTransactionHistoryRepository.findAllReturnedProducts(pageable, connectedUser.getName());
        List<BorrowedProductResponse> productResponse = allBorrowedProducts.stream()
                .map(productMapper::toBorrowedBookResponse)
                .toList();
        return new PageResponse<>(
                productResponse,
                allBorrowedProducts.getNumber(),
                allBorrowedProducts.getSize(),
                allBorrowedProducts.getTotalElements(),
                allBorrowedProducts.getTotalPages(),
                allBorrowedProducts.isFirst(),
                allBorrowedProducts.isLast()
        );
    }

    public Integer updateAvailableStatus(Integer productId, Authentication connectedUser) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new EntityNotFoundException("No products found with the ID: " + productId));
        if (!Objects.equals(product.getCreatedBy(), connectedUser.getName())) {
            throw new OperationNotPermittedException("You can not update others products available status");
        }
        product.setAvailable(!product.isAvailable());
        productRepository.save(product);
        return productId;
    }

    public Integer updateBorrowStatus(Integer productId, Authentication connectedUser) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new EntityNotFoundException("No products found with the ID: " + productId));
        product.setBorrowed(!product.isBorrowed());
        productRepository.save(product);
        return productId;
    }

    public Integer borrowProduct(Integer productId, Authentication connectedUser) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new EntityNotFoundException("No products found with the ID: " + productId));

        if (product.isBorrowed() || !product.isAvailable()) {
            throw new OperationNotPermittedException("The requested product cannot be borrowed since it is borrowed or not available");
        }
        if (Objects.equals(product.getCreatedBy(), connectedUser.getName())) {
            throw new OperationNotPermittedException("You can not borrow your own product");
        }
        final boolean isAlreadyBorrowed = productTransactionHistoryRepository.isAlreadyBorrowedByUser(productId, connectedUser.getName());
        if (isAlreadyBorrowed) {
            throw new OperationNotPermittedException("The requested product is already borrowed");
        }

        ProductTransactionHistory productTransactionHistory = ProductTransactionHistory.builder()
                .userId(connectedUser.getName())
                .product(product)
                .returned(false)
                .borrowed(true)
                .returnApproved(false)
                .build();
        notificationService.sendNotification(
                product.getCreatedBy(),
                Notification.builder()
                        .status(BORROWED)
                        .message("Your product has been borrowed")
                        .productTitle(product.getName())
                        .build()
        );
        updateBorrowStatus(productId,connectedUser);

        return productTransactionHistoryRepository.save(productTransactionHistory).getId();
    }

    public Integer returnBorrowedProduct(Integer productId, Authentication connectedUser) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new EntityNotFoundException("No products found with the ID: " + productId));
        if (!product.isBorrowed() || !product.isAvailable()) {
            throw new OperationNotPermittedException("The requested product cannot be borrowed since it is borrowed or not available");
        }
        if (Objects.equals(product.getCreatedBy(), connectedUser.getName())) {
            throw new OperationNotPermittedException("You can not borrow or return your own product");
        }
        ProductTransactionHistory productTransactionHistory = productTransactionHistoryRepository.findByProductIdAndUserId(productId, connectedUser.getName())
                .orElseThrow(() -> new OperationNotPermittedException("You did not borrow this product"));
        productTransactionHistory.setReturned(true);
        productTransactionHistory.setBorrowed(false);

        var saved =  productTransactionHistoryRepository.save(productTransactionHistory);
        notificationService.sendNotification(
                product.getCreatedBy(),
                Notification.builder()
                        .status(RETURNED)
                        .message("Your product has been returned")
                        .productTitle(product.getName())
                        .build()
        );
        return saved.getId();
    }

    public Integer approveReturnBorrowedProduct(Integer productId, Authentication connectedUser) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new EntityNotFoundException("No products found with the ID: " + productId));
        if (!product.isBorrowed() || !product.isAvailable()) {
            throw new OperationNotPermittedException("The requested product cannot be borrowed since it is borrowed or not available");
        }
        if (!Objects.equals(product.getCreatedBy(), connectedUser.getName())) {
            throw new OperationNotPermittedException("You cannot approve the return of a book you do not own");
        }
        ProductTransactionHistory productTransactionHistory = productTransactionHistoryRepository.findByProductIdAndOwnerId(productId, connectedUser.getName())
                .orElseThrow(() -> new OperationNotPermittedException("The product is not returned yet. You can not approve ist return"));
        productTransactionHistory.setReturnApproved(true);
        productTransactionHistory.setBorrowed(false);

        updateBorrowStatus(productId,connectedUser);

        var saved = productTransactionHistoryRepository.save(productTransactionHistory);
        notificationService.sendNotification(
                productTransactionHistory.getCreatedBy(),
                Notification.builder()
                        .status(RETURN_APPROVED)
                        .message("Your product return has been approved")
                        .productTitle(product.getName())
                        .build()
        );
        return saved.getId();
    }

    public void uploadProductCoverPicture(MultipartFile file, Authentication connectedUser, Integer productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new EntityNotFoundException("No products found with the ID: " + productId));
        var productCover = fileStorageService.saveFile(file,connectedUser.getName());
        product.setCoverImage(productCover);
        productRepository.save(product);
    }

    @Transactional
    public void deleteProduct(Integer productId, Authentication connectedUser) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new EntityNotFoundException("Product not found with ID: " + productId));
        if (!product.getCreatedBy().equals(connectedUser.getName())) {
            throw new OperationNotPermittedException("You do not have permission to delete this product");
        }
        productTransactionHistoryRepository.deleteByProductId(productId);
        productRepository.delete(product);
    }
}

