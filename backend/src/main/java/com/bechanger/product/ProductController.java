package com.bechanger.product;

import com.bechanger.common.PageResponse;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("products")
@RequiredArgsConstructor
@Tag(name = "Product")
public class ProductController {

    private final ProductService service;


    @PostMapping
    public ResponseEntity<Integer> saveProduct(@Valid @RequestBody ProductRequest request,
                                               Authentication connectedUser) {
        return ResponseEntity.ok(service.save(request, connectedUser));
    }

    @GetMapping("{product-id}")
    public ResponseEntity<ProductResponse> findProductById(@PathVariable("product-id") Integer productId) {
        return ResponseEntity.ok(service.findById(productId));
    }

    @GetMapping
    public ResponseEntity<PageResponse<ProductResponse>> findAllBooks(@RequestParam(name = "page", defaultValue = "0", required = false) int page,
                                                                      @RequestParam(name = "size", defaultValue = "10", required = false) int size,
                                                                      Authentication connectedUser) {
        return ResponseEntity.ok(service.findAllBooks(page, size, connectedUser));
    }

    @GetMapping("/owner")
    public ResponseEntity<PageResponse<ProductResponse>> findAllBooksByOwner(@RequestParam(name = "page", defaultValue = "0", required = false) int page,
                                                                             @RequestParam(name = "size", defaultValue = "10", required = false) int size,
                                                                             Authentication connectedUser) {
        return ResponseEntity.ok(service.findAllBooksByOwner(page, size, connectedUser));
    }

    @GetMapping("/borrowed")
    public ResponseEntity<PageResponse<BorrowedProductResponse>> findAllBorrowedProducts(@RequestParam(name = "page", defaultValue = "0", required = false) int page,
                                                                                         @RequestParam(name = "size", defaultValue = "10", required = false) int size,
                                                                                         Authentication connectedUser) {
        return ResponseEntity.ok(service.findAllBorrowedProducts(page, size, connectedUser));
    }

    @GetMapping("/returner")
    public ResponseEntity<PageResponse<BorrowedProductResponse>> findAllReturnedProducts(@RequestParam(name = "page", defaultValue = "0", required = false) int page,
                                                                                         @RequestParam(name = "size", defaultValue = "10", required = false) int size,
                                                                                         Authentication connectedUser) {
        return ResponseEntity.ok(service.findAllReturnedProducts(page, size, connectedUser));
    }

    @PatchMapping("/available/{product-id}")
    public ResponseEntity<Integer> updaeAvailableStatus(@PathVariable("product-id") Integer productId,
                                                        Authentication connectedUser) {
        return ResponseEntity.ok(service.updateAvailableStatus(productId, connectedUser));
    }

    @PatchMapping("/archived/{product-id}")
    public ResponseEntity<Integer> updaeArchivedStatus(@PathVariable("product-id") Integer productId,
                                                       Authentication connectedUser) {
        return ResponseEntity.ok(service.updateArchivedStatus(productId, connectedUser));
    }


    @PostMapping("/borrow/{product-id}")
    public ResponseEntity<Integer> borrowProduct(@PathVariable("product-id") Integer productId,
                                                 Authentication connectedUser) {
        return ResponseEntity.ok(service.borrowProduct(productId, connectedUser));
    }

    @PatchMapping("/borrow/return/{product-id}")
    public ResponseEntity<Integer> returnBorrowProduct(@PathVariable("product-id") Integer productId,
                                                       Authentication connectedUser) {
        return ResponseEntity.ok(service.returnBorrowedProduct(productId, connectedUser));
    }


    @PatchMapping("/borrow/return/approve/{product-id}")
    public ResponseEntity<Integer> approveReturnBorrowProduct(@PathVariable("product-id") Integer productId,
                                                              Authentication connectedUser) {
        return ResponseEntity.ok(service.approveReturnBorrowedProduct(productId, connectedUser));
    }

    @PostMapping(value = "/cover/{product-id}", consumes = "multipart/form-date")
    public ResponseEntity<?> uploadProductCoverPicture(@PathVariable("product-id") Integer productId,
                                                       @Parameter()
                                                       @RequestPart("file") MultipartFile file,
                                                       Authentication connectedUser) {
        service.uploadProductCoverPicture(file, connectedUser, productId);
        return ResponseEntity.accepted().build();
    }

}
