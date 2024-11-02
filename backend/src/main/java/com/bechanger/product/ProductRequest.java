package com.bechanger.product;


import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

public record ProductRequest(
        Integer id,
        @NotNull(message = "100")
        @NotEmpty(message = "100")
        String name,
        @NotNull(message = "100")
        @NotEmpty(message = "100")
        String brand,
        @NotNull(message = "100")
        @NotEmpty(message = "100")
        String identifier,
        @NotNull(message = "100")
        @NotEmpty(message = "100")
        String description,
        boolean available
) {
}
