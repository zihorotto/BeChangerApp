package com.bechanger.feedback;

import com.bechanger.product.Product;
import org.springframework.stereotype.Service;

import java.util.Objects;

@Service
public class FeedbackMapper {


    public Feedback toFeedBack(FeedbackRequest request) {
        return Feedback.builder()
                .note(request.note())
                .comment(request.comment())
                .product(Product.builder()
                        .id(request.productId())
                        .archived(false) // Not required and has no impact :: just to satisfy lombok
                        .available(false)  // Not required and has no impact :: just to satisfy lombok
                        .build()
                )
                .build();
    }

    public FeedbackResponse toFeedbackResponse(Feedback feedback, Integer id) {
        return FeedbackResponse.builder()
                .note(feedback.getNote())
                .comment(feedback.getComment())
                .ownFeedback(Objects.equals(feedback.getCreatedBy(), id))
                .build();
    }
}
