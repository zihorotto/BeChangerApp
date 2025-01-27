package com.bechanger.product;

import com.bechanger.common.PageResponse;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
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
    public ResponseEntity<Integer> saveProduct(@Valid @RequestBody ProductRequest request) {
        return ResponseEntity.ok(service.save(request));
    }

    @GetMapping("{product-id}")
    public ResponseEntity<ProductResponse> findProductById(@PathVariable("product-id") Integer productId) {
        return ResponseEntity.ok(service.findById(productId));
    }

    @GetMapping
    public ResponseEntity<PageResponse<ProductResponse>> findAllProducts(@RequestParam(name = "page", defaultValue = "0", required = false) int page,
                                                                      @RequestParam(name = "size", defaultValue = "10", required = false) int size,
                                                                      Authentication connectedUser) {
        return ResponseEntity.ok(service.findAllProducts(page, size, connectedUser));
    }

    @GetMapping("/owner")
    public ResponseEntity<PageResponse<ProductResponse>> findAllProductsByOwner(@RequestParam(name = "page", defaultValue = "0", required = false) int page,
                                                                             @RequestParam(name = "size", defaultValue = "10", required = false) int size,
                                                                             Authentication connectedUser) {
        return ResponseEntity.ok(service.findAllProductsByOwner(page, size, connectedUser));
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
    public ResponseEntity<Integer> updateAvailableStatus(@PathVariable("product-id") Integer productId,
                                                        Authentication connectedUser) {
        return ResponseEntity.ok(service.updateAvailableStatus(productId, connectedUser));
    }

    @PatchMapping("/borrowed/{product-id}")
    public ResponseEntity<Integer> updateBorrowStatus(@PathVariable("product-id") Integer productId,
                                                       Authentication connectedUser) {
        return ResponseEntity.ok(service.updateBorrowStatus(productId, connectedUser));
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

    @PostMapping(value = "/cover/{product-id}", consumes = "multipart/form-data")
    public ResponseEntity<?> uploadProductCoverPicture(@PathVariable("product-id") Integer productId,
                                                       @Parameter()
                                                       @RequestPart("file") MultipartFile file,
                                                       Authentication connectedUser) {
        service.uploadProductCoverPicture(file, connectedUser, productId);
        return ResponseEntity.accepted().build();
    }

    @DeleteMapping("{product-id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable("product-id") Integer productId, Authentication connectedUser) {
        service.deleteProduct(productId, connectedUser);
        return new ResponseEntity<>(HttpStatus.OK);
    }

}
