package com.bechanger.feedback;

import com.bechanger.common.PageResponse;
import com.bechanger.exception.OperationNotPermittedException;
import com.bechanger.product.Product;
import com.bechanger.product.ProductRepository;
import com.bechanger.user.User;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class FeedbackService {

    private final ProductRepository productRepository;
    private final FeedbackMapper feedbackMapper;
    private final FeedBackRepository feedbackRepository;

    public Integer save(FeedbackRequest request, Authentication connectedUser) {
        Product product = productRepository.findById(request.productId())
                .orElseThrow(() -> new EntityNotFoundException("No products found with the ID: " + request.productId()));
        if (product.isArchived() || !product.isAvailable()) {
            throw new OperationNotPermittedException("You can not give a feedback for an archived or not available product.");
        }
        User user = ((User) connectedUser.getPrincipal());
        if (Objects.equals(product.getCreatedBy(), connectedUser.getName())) {
            throw new OperationNotPermittedException("You can not give a feedback to your own product");
        }
        Feedback feedback = feedbackMapper.toFeedBack(request);
        return feedbackRepository.save(feedback).getId();
    }


    public PageResponse<FeedbackResponse> findAllFeedbacksByProduct(Integer productId, int page, int size, Authentication connectedUser) {
        Pageable pageable = PageRequest.of(page, size);
        User user = ((User) connectedUser.getPrincipal());
        Page<Feedback> feedbacks = feedbackRepository.findAllByProductId(productId, pageable);
        List<FeedbackResponse> feedbackResponses = feedbacks.stream()
                .map(f -> feedbackMapper.toFeedbackResponse(f, user.getId()))
                .toList();
        return new PageResponse<>(
                feedbackResponses,
                feedbacks.getNumber(),
                feedbacks.getSize(),
                feedbacks.getTotalElements(),
                feedbacks.getTotalPages(),
                feedbacks.isFirst(),
                feedbacks.isLast()
        );
    }
}
