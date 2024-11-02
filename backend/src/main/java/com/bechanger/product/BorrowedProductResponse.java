package com.bechanger.product;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BorrowedProductResponse {
    private Integer id;
    private String name;
    private String brand;
    private String identifier;
    private double rate;
    private boolean returned;
    private boolean returnedApproved;
}
