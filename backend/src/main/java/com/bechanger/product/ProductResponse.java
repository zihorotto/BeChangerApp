package com.bechanger.product;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProductResponse {

    private Integer id;
    private String name;
    private String brand;
    private String identifier;
    private String description;
    private String owner;
    private byte[] coverImage;
    private double rate;
    private boolean archived;
    private boolean available;
}
