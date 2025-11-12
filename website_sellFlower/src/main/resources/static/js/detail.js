// Get product ID from URL path parameter
function getProductIdFromURL() {
    const pathParts = window.location.pathname.split('/');
    const idIndex = pathParts.indexOf('detail');
    if (idIndex !== -1 && pathParts[idIndex + 1]) {
        return pathParts[idIndex + 1];
    }
    return null;
}

// Sample product images for thumbnails
const productImages = [
    'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=400',
    'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400',
    'https://images.unsplash.com/photo-1464047736614-af63643285bf?w=400',
    'https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=400'
];

// Helper function to format price
function formatPrice(price) {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return '₫' + numPrice.toLocaleString('vi-VN');
}

// NOTE: Product details and reviews are now loaded server-side via Thymeleaf
// This function is no longer needed but kept for reference
function loadProductDetails() {
    // Products are now rendered server-side, so we just need to initialize interactions
    // Product data is available in the DOM via data attributes
}

// Thumbnail click handler
function initThumbnailGallery() {
    const thumbnails = document.querySelectorAll('.thumbnail');
    const mainImage = document.getElementById('mainProductImage');

    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', function() {
            thumbnails.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            mainImage.src = this.src;
        });
    });
}

// Quantity selector
function initQuantitySelector() {
    const minusBtn = document.querySelector('.minus-btn-detail');
    const plusBtn = document.querySelector('.plus-btn-detail');
    const qtyInput = document.getElementById('productQuantity');

    if (!qtyInput || !minusBtn || !plusBtn) return;

    qtyInput.setCustomValidity('');
    qtyInput.addEventListener('invalid', function(e) {
        e.preventDefault();
        e.stopPropagation();
        this.setCustomValidity('');
        return false;
    });

    minusBtn.addEventListener('click', function() {
        let currentValue = parseInt(qtyInput.value);
        const min = parseInt(qtyInput.getAttribute('min')) || 1;
        if (currentValue > min) {
            qtyInput.value = currentValue - 1;
            animateInput(qtyInput);
        }
    });

    plusBtn.addEventListener('click', function() {
        let currentValue = parseInt(qtyInput.value);
        const max = parseInt(qtyInput.getAttribute('max'));
        if (max && currentValue >= max) {
            showToast(`Số lượng vượt quá tồn kho! Tồn kho hiện có: ${max}`, 'warning');
            return;
        }
        qtyInput.value = currentValue + 1;
        animateInput(qtyInput);
    });

    qtyInput.addEventListener('change', function() {
        const min = parseInt(this.getAttribute('min')) || 1;
        const max = parseInt(this.getAttribute('max'));

        let currentValue = parseInt(this.value);

        if (isNaN(currentValue)) {
            currentValue = min;
        }

        if (currentValue < min) {
            this.value = min;
        } else if (max && currentValue > max) {
            this.value = max;
            showToast(`Số lượng vượt quá tồn kho! Tồn kho hiện có: ${max}`, 'warning');
        } else {
            this.value = currentValue;
        }
    });
}

function animateInput(input) {
    input.style.transform = 'scale(1.2)';
    setTimeout(() => {
        input.style.transform = 'scale(1)';
    }, 200);
}

// Add to cart
function initAddToCart() {
    const addToCartBtn = document.getElementById('addToCartBtn');
    if (!addToCartBtn) return;

    addToCartBtn.addEventListener('click', async function() {
        // Get product info from data attributes on product-info-detail div
        const productInfoDiv = document.querySelector('.product-info-detail');
        if (!productInfoDiv) {
            showToast('Không tìm thấy sản phẩm!', 'warning');
            return;
        }

        const productId = productInfoDiv.getAttribute('data-product-id');
        const productName = productInfoDiv.getAttribute('data-product-name');
        const productPrice = parseFloat(productInfoDiv.getAttribute('data-product-price')) || 0;
        const productImage = productInfoDiv.getAttribute('data-product-image') || '';
        const productStock = productInfoDiv.getAttribute('data-product-stock') ? parseInt(productInfoDiv.getAttribute('data-product-stock')) : null;
        const quantity = parseInt(document.getElementById('productQuantity').value);

        if (!productId) {
            showToast('Không tìm thấy sản phẩm!', 'warning');
            return;
        }

        // Disable button during request
        const originalHTML = addToCartBtn.innerHTML;
        addToCartBtn.disabled = true;
        addToCartBtn.innerHTML = '<i class="fas fa-shopping-cart"></i> Đang thêm...';

        try {
            const result = await addToCart(
                productId,
                productName,
                productPrice,
                quantity,
                productImage,
                productStock
            );

            if (result.success) {
                showToast(result.message || 'Đã thêm vào giỏ hàng!', 'success');
            } else {
                showToast(result.message || 'Có lỗi xảy ra!', 'warning');
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            showToast('Có lỗi xảy ra khi thêm vào giỏ hàng!', 'warning');
        } finally {
            addToCartBtn.disabled = false;
            addToCartBtn.innerHTML = originalHTML;
        }
    });
}

// Show toast notification
function showToast(message, type = 'success') {
    // Don't show toast if message is empty or undefined
    if (!message || message.trim() === '') {
        return;
    }
    
    let toast = document.getElementById('toast');

    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.className = 'toast';
        toast.innerHTML = '<i class="fas fa-check-circle"></i><span></span>';
        document.body.appendChild(toast);
    }

    const toastText = toast.querySelector('span');
    const toastIcon = toast.querySelector('i');

    if (toastText) toastText.textContent = message;

    if (type === 'warning') {
        toast.style.backgroundColor = '#f59e0b';
        if (toastIcon) toastIcon.className = 'fas fa-exclamation-circle';
    } else if (type === 'error') {
        toast.style.backgroundColor = '#ef4444';
        if (toastIcon) toastIcon.className = 'fas fa-times-circle';
    } else {
        toast.style.backgroundColor = '#4caf50';
        if (toastIcon) toastIcon.className = 'fas fa-check-circle';
    }

    // Remove any existing show class and timeout, then show
    toast.classList.remove('show');
    clearTimeout(toast._hideTimeout);
    
    // Force display and add show class
    toast.style.display = 'flex';
    toast.classList.add('show');

    // Hide after 3 seconds
    toast._hideTimeout = setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.style.display = 'none';
            if (toastText) toastText.textContent = '';
        }, 300); // Wait for transition to complete
    }, 3000);
}

// Tab functionality
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content-detail');

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');

            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            this.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });
}

// Initialize rating stars for review form
function initReviewRating() {
    // CHỈ chọn sao trong form THÊM (dùng class riêng)
    const ratingStars = document.querySelectorAll('.add-rating-stars i');
    const ratingInput = document.getElementById('reviewRating');

    // Kiểm tra tồn tại
    if (!ratingStars.length || !ratingInput) {
        console.warn('Rating stars or input not found!');
        return;
    }

    // Lấy giá trị hiện tại, mặc định = 0 (chưa chọn)
    let currentRating = parseInt(ratingInput.value, 10) || 0;


     // Cập nhật giao diện sao

    function updateStars(rating) {
        ratingStars.forEach((star, index) => {
            if (index < rating) {
                star.classList.remove('far');
                star.classList.add('fas', 'filled');
            } else {
                star.classList.remove('fas', 'filled');
                star.classList.add('far');
            }
        });
    }

    // Khởi tạo: không fill sao nếu chưa chọn
    updateStars(currentRating);

    // Xử lý click chọn sao
    ratingStars.forEach((star, index) => {
        const ratingValue = index + 1;

        star.addEventListener('click', function () {
            currentRating = ratingValue;
            ratingInput.value = currentRating; // CẬP NHẬT INPUT
            updateStars(currentRating);
            console.log('Rating selected:', currentRating); // Debug
        });

        // Hover preview
        star.addEventListener('mouseenter', function () {
            updateStars(ratingValue);
        });
    });

    // Khi rời chuột: khôi phục trạng thái đã chọn
    const container = document.querySelector('.add-rating-stars');
    if (container) {
        container.addEventListener('mouseleave', function () {
            updateStars(currentRating);
        });
    }
}


 // Validate form trước khi submit

function validateReview() {
    const rating = document.getElementById('reviewRating').value;
    if (!rating || parseInt(rating) === 0) {
        alert('Vui lòng chọn số sao đánh giá!');
        return false;
    }
    return true;
}

// Scroll to reviews section smoothly
function scrollToReviews() {
    const reviewsSection = document.getElementById('reviews');
    if (reviewsSection) {
        // Wait a bit for page to fully render
        setTimeout(() => {
            // Get the position of reviews section
            const reviewsPosition = reviewsSection.getBoundingClientRect().top + window.pageYOffset;
            // Scroll to reviews section with offset for header
            const offset = 100; // Offset from top
            window.scrollTo({
                top: reviewsPosition - offset,
                behavior: 'smooth'
            });
        }, 100);
    }
}

// Initialize flash messages as toast notifications
// Only called once per page load to prevent duplicate notifications
let flashMessagesInitialized = false;

function initFlashMessages() {
    // Prevent multiple initializations (e.g., when switching tabs)
    if (flashMessagesInitialized) {
        return;
    }
    flashMessagesInitialized = true;
    
    // Check for success flash message
    const successFlash = document.getElementById('flashSuccess');
    if (successFlash && successFlash.textContent && successFlash.textContent.trim()) {
        const message = successFlash.textContent.trim();
        // Only show toast if message is not empty
        if (message) {
            // Scroll to reviews section
            scrollToReviews();
            // Small delay to ensure toast is ready
            setTimeout(() => {
                showToast(message, 'success');
                // Remove the flash message element after showing to prevent re-display
                successFlash.remove();
            }, 100);
        } else {
            // Remove empty flash messages
            successFlash.remove();
        }
    }
    
    // Check for error flash message
    const errorFlash = document.getElementById('flashError');
    if (errorFlash && errorFlash.textContent && errorFlash.textContent.trim()) {
        const message = errorFlash.textContent.trim();
        // Only show toast if message is not empty
        if (message) {
            // Scroll to reviews section
            scrollToReviews();
            // Small delay to ensure toast is ready
            setTimeout(() => {
                showToast(message, 'error');
                // Remove the flash message element after showing to prevent re-display
                errorFlash.remove();
            }, 100);
        } else {
            // Remove empty flash messages
            errorFlash.remove();
        }
    }
    
    // Also check if URL has #reviews hash (for direct navigation)
    if (window.location.hash === '#reviews') {
        // Delay to ensure page is fully loaded
        setTimeout(() => {
            scrollToReviews();
        }, 200);
    }
}

// Initialize edit/delete review handlers
function initReviewActions() {
    // Edit button handlers
    document.querySelectorAll('.edit-review-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const reviewId = this.getAttribute('data-review-id');
            showEditReviewForm(reviewId);
        });
    });

    // Delete button handlers
    document.querySelectorAll('.delete-review-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const reviewId = this.getAttribute('data-review-id');
            const productId = this.getAttribute('data-product-id');
            showDeleteConfirmModal(reviewId, productId);
        });
    });

    // Cancel delete button
    const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
    if (cancelDeleteBtn) {
        cancelDeleteBtn.addEventListener('click', function() {
            hideDeleteConfirmModal();
        });
    }

    // Confirm delete button
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', function() {
            const reviewId = confirmDeleteBtn.getAttribute('data-review-id');
            const productId = confirmDeleteBtn.getAttribute('data-product-id');
            if (reviewId && productId) {
                deleteReview(reviewId, productId);
                hideDeleteConfirmModal();
            }
        });
    }

    // Cancel edit button handlers
    document.querySelectorAll('.cancel-edit-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const reviewId = this.getAttribute('data-review-id');
            hideEditReviewForm(reviewId);
        });
    });

    // Edit form submission handlers
    document.querySelectorAll('.edit-review-form').forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const reviewId = this.getAttribute('data-review-id');
            const productId = this.getAttribute('data-product-id');
            updateReview(reviewId, productId, this);
        });
    });

    // Initialize rating stars for edit forms
    document.querySelectorAll('.edit-rating-stars').forEach(starsContainer => {
        const reviewId = starsContainer.getAttribute('data-review-id');
        initEditRatingStars(reviewId);
    });
}

// Show edit review form
function showEditReviewForm(reviewId) {
    const displayDiv = document.getElementById('review-display-' + reviewId);
    const editDiv = document.getElementById('review-edit-' + reviewId);
    
    if (displayDiv && editDiv) {
        displayDiv.style.display = 'none';
        editDiv.style.display = 'block';
        
        // Get current rating and initialize stars
        const ratingInput = document.getElementById('editRating-' + reviewId);
        if (ratingInput) {
            const currentRating = parseInt(ratingInput.value) || 5;
            updateEditRatingStars(reviewId, currentRating);
        }
    }
}

// Hide edit review form
function hideEditReviewForm(reviewId) {
    const displayDiv = document.getElementById('review-display-' + reviewId);
    const editDiv = document.getElementById('review-edit-' + reviewId);
    
    if (displayDiv && editDiv) {
        displayDiv.style.display = 'block';
        editDiv.style.display = 'none';
    }
}

// Initialize rating stars for edit form
function initEditRatingStars(reviewId) {
    const starsContainer = document.querySelector(`.edit-rating-stars[data-review-id="${reviewId}"]`);
    const ratingInput = document.getElementById('editRating-' + reviewId);
    
    if (!starsContainer || !ratingInput) return;
    
    const stars = starsContainer.querySelectorAll('i');
    let currentRating = parseInt(ratingInput.value) || 5;
    
    // Initialize stars display
    updateEditRatingStars(reviewId, currentRating);
    
    // Add click and hover events
    stars.forEach((star, index) => {
        star.addEventListener('click', function() {
            currentRating = index + 1;
            ratingInput.value = currentRating;
            updateEditRatingStars(reviewId, currentRating);
        });
        
        star.addEventListener('mouseenter', function() {
            updateEditRatingStars(reviewId, index + 1);
        });
    });
    
    starsContainer.addEventListener('mouseleave', function() {
        updateEditRatingStars(reviewId, currentRating);
    });
}

// Update rating stars display for edit form
function updateEditRatingStars(reviewId, rating) {
    const starsContainer = document.querySelector(`.edit-rating-stars[data-review-id="${reviewId}"]`);
    if (!starsContainer) return;
    
    const stars = starsContainer.querySelectorAll('i');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('filled', 'active');
            star.classList.remove('far');
            star.classList.add('fas');
        } else {
            star.classList.remove('filled', 'active');
            star.classList.remove('fas');
            star.classList.add('far');
        }
    });
}

// Update review
function updateReview(reviewId, productId, form) {
    const ratingInput = form.querySelector('input[name="rating"]');
    const commentTextarea = form.querySelector('textarea[name="comment"]');
    
    if (!ratingInput || !commentTextarea) {
        showToast('Có lỗi xảy ra!', 'error');
        return;
    }
    
    const rating = parseInt(ratingInput.value);
    const comment = commentTextarea.value.trim();
    
    if (!comment) {
        showToast('Vui lòng nhập bình luận!', 'warning');
        return;
    }
    
    // Create form data
    const formData = new FormData();
    formData.append('rating', rating);
    formData.append('comment', comment);
    
    // Submit form to API endpoint
    fetch(`/api/product/detail/${productId}/review/${reviewId}/update`, {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => response.text())
    .then(text => {
        try {
            const data = JSON.parse(text);
            if (data.success) {
                // Update the review in DOM
                updateReviewInDOM(reviewId, rating, comment);
                // Hide edit form and show display
                hideEditReviewForm(reviewId);
                // Show success toast
                showToast('Đánh giá đã được cập nhật thành công!', 'success');
                // Maintain scroll position - don't scroll
            } else {
                showToast(data.message || 'Có lỗi xảy ra khi cập nhật đánh giá!', 'error');
            }
        } catch (e) {
            console.error('Error parsing response:', e);
            showToast('Có lỗi xảy ra khi cập nhật đánh giá!', 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showToast('Có lỗi xảy ra khi cập nhật đánh giá!', 'error');
    });
}

// Update review in DOM
function updateReviewInDOM(reviewId, rating, comment) {
    const reviewDisplay = document.getElementById('review-display-' + reviewId);
    if (!reviewDisplay) return;
    
    // Update rating stars
    const reviewStars = reviewDisplay.querySelector('.review-stars');
    if (reviewStars) {
        reviewStars.innerHTML = '';
        for (let i = 1; i <= 5; i++) {
            const star = document.createElement('i');
            if (i <= rating) {
                star.className = 'fas fa-star filled';
            } else {
                star.className = 'far fa-star';
            }
            reviewStars.appendChild(star);
        }
    }
    
    // Update comment text
    const reviewText = reviewDisplay.querySelector('.review-text');
    if (reviewText) {
        reviewText.textContent = comment;
    }
    
    // Update review date to show it was just updated
    const reviewDatePill = reviewDisplay.querySelector('.review-date-pill');
    if (reviewDatePill) {
        const today = new Date();
        const day = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const year = today.getFullYear();
        reviewDatePill.textContent = `${day}/${month}/${year}`;
    }
}

// Show delete confirmation modal
function showDeleteConfirmModal(reviewId, productId) {
    const modal = document.getElementById('deleteConfirmModal');
    const confirmBtn = document.getElementById('confirmDeleteBtn');
    
    if (modal && confirmBtn) {
        confirmBtn.setAttribute('data-review-id', reviewId);
        confirmBtn.setAttribute('data-product-id', productId);
        modal.classList.add('show');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
}

// Hide delete confirmation modal
function hideDeleteConfirmModal() {
    const modal = document.getElementById('deleteConfirmModal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = ''; // Restore scrolling
    }
}

// Delete review
function deleteReview(reviewId, productId) {
    // Create form data
    const formData = new FormData();
    
    // Submit delete request to API endpoint
    fetch(`/api/product/detail/${productId}/review/${reviewId}/delete`, {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
        },
        credentials: 'same-origin'
    })
    .then(response => response.text())
    .then(text => {
        try {
            const data = JSON.parse(text);
            if (data.success) {
                // Remove the review from DOM after successful deletion
                removeReviewFromDOM(reviewId);
                // Show success toast at bottom right
                showToast('Đánh giá đã được xóa thành công!', 'success');
            } else {
                // If delete failed, show error
                showToast(data.message || 'Có lỗi xảy ra khi xóa đánh giá!', 'error');
                // Reload after a delay to restore the review
                setTimeout(() => {
                    window.location.href = `/product/detail/${productId}#reviews`;
                }, 2000);
            }
        } catch (e) {
            showToast('Có lỗi xảy ra khi xóa đánh giá!', 'error');
            // Reload on parse error
            setTimeout(() => {
                window.location.href = `/product/detail/${productId}#reviews`;
            }, 2000);
        }
    })
    .catch(error => {
        showToast('Có lỗi xảy ra khi xóa đánh giá!', 'error');
        // On error, reload to show the actual state
        setTimeout(() => {
            window.location.href = `/product/detail/${productId}#reviews`;
        }, 2000);
    });
}

// Remove review from DOM
function removeReviewFromDOM(reviewId) {
    const reviewItem = document.querySelector(`.review-item[data-review-id="${reviewId}"]`);
    if (reviewItem) {
        // Add fade out animation
        reviewItem.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        reviewItem.style.opacity = '0';
        reviewItem.style.transform = 'translateX(-20px)';
        
        // Remove after animation
        setTimeout(() => {
            reviewItem.remove();
            
            // Check if no reviews left
            const reviewsContainer = document.querySelector('.reviews-list-column');
            const remainingReviews = reviewsContainer.querySelectorAll('.review-item');
            if (remainingReviews.length === 0) {
                // Show "no reviews" message
                const noReviewsDiv = document.createElement('div');
                noReviewsDiv.className = 'no-reviews';
                noReviewsDiv.innerHTML = '<p>Chưa có đánh giá nào cho sản phẩm này. Hãy là người đầu tiên đánh giá!</p>';
                reviewsContainer.appendChild(noReviewsDiv);
            }
        }, 300);
    }
}

// Close modal when clicking outside
document.addEventListener('click', function(event) {
    const modal = document.getElementById('deleteConfirmModal');
    if (modal && event.target === modal) {
        hideDeleteConfirmModal();
    }
});

// Initialize on page load
// Product data is now loaded server-side via Thymeleaf, so we just initialize interactions
// Function to reset toast state
function resetToastState() {
    const toast = document.getElementById('toast');
    if (toast) {
        toast.classList.remove('show');
        toast.style.display = 'none';
        const toastText = toast.querySelector('span');
        if (toastText) {
            toastText.textContent = ''; // Clear text
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Reset toast state on page load
    resetToastState();
    
    initThumbnailGallery();
    initQuantitySelector();
    initAddToCart();
    initTabs();
    initReviewRating();
    initFlashMessages();
    initReviewActions();
});

// Reset toast when page becomes visible (e.g., when switching back to tab)
document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        // Page is now visible, reset toast to prevent showing stale notifications
        resetToastState();
    }
});

// Reset toast when window gains focus (e.g., when switching back to tab)
window.addEventListener('focus', function() {
    resetToastState();
});

async function addToCart(productId, productName, productPrice, quantity, productImage, productStock) {
    try {
        const response = await fetch('/cart/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                productId,
                quantity
            })
        });

        const data = await response.json();

        // Nếu backend trả về số lượng giỏ hàng -> cập nhật hiển thị
        if (data.cartCount !== undefined) {
            updateCartCount(data.cartCount);
        }

        return data;
    } catch (error) {
        console.error('Error calling addToCart:', error);
        return { success: false, message: 'Không thể kết nối tới máy chủ!' };
    }
}

function updateCartCount(count) {
    const cartCounts = document.querySelectorAll('.cart-count');
    cartCounts.forEach(el => el.textContent = count);
}