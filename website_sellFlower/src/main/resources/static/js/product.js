// Helper function to format price
function formatPrice(price) {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return '₫' + numPrice.toLocaleString('vi-VN');
}

// Helper function to render stars with half star support
function renderStars(selector, rating) {
    const starsContainer = document.querySelector(selector);
    if (!starsContainer) return;
    
    // Clear existing stars
    starsContainer.innerHTML = '';
    
    // Render 5 stars
    for (let i = 1; i <= 5; i++) {
        const star = document.createElement('i');
        
        if (rating >= i) {
            // Full star
            star.className = 'fas fa-star';
        } else if (rating >= i - 0.5) {
            // Half star
            star.className = 'fas fa-star-half-alt';
        } else {
            // Empty star
            star.className = 'far fa-star';
        }
        
        starsContainer.appendChild(star);
    }
}

// Function to create product card HTML
function createProductCard(product) {
    return `
        <div class="product-card" data-product-id="${product.id}" data-product-name="${product.name}" data-product-price="${product.price}" data-product-image="${product.imageUrl}" data-product-stock="${product.stockQuantity}">
            <div class="product-image-container" onclick="goToProductDetail(this.closest('.product-card'))">
                <img src="${product.imageUrl}" alt="${product.name}" class="product-image">
                <div class="product-overlay">
                    <button class="quick-view-btn" onclick="event.stopPropagation(); openQuickViewModal(this.closest('.product-card'))">Xem nhanh</button>
                </div>
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <div class="product-price-container">
                    <span class="product-price">${formatPrice(product.price)}</span>
                </div>
                <div class="quantity-selector">
                    <button class="qty-btn minus-btn">-</button>
                    <input type="number" value="1" min="1" max="${product.stockQuantity}" class="qty-input">
                    <button class="qty-btn plus-btn">+</button>
                </div>
                <button class="add-to-cart-btn">
                    <span>THÊM VÀO GIỎ</span>
                    <i class="fas fa-shopping-bag"></i>
                </button>
            </div>
        </div>
    `;
}

// Function to load and display products FROM BACKEND API
// NOTE: This function is no longer needed as products are now rendered server-side via Thymeleaf
// Keeping this for reference but it's not called anymore
async function loadProducts() {
    // Products are now loaded via Thymeleaf template, so this function is deprecated
    // Just initialize interactions on existing products
    initProductInteractions();
}

// Function to navigate to product detail page
function goToProductDetail(productCard) {
    const productId = productCard.getAttribute('data-product-id');
    window.location.href = `/product/detail/${productId}`;
}

// Function to initialize product interactions (quantity selectors, add to cart)
function initProductInteractions() {
    // Quantity selectors
    const quantitySelectors = document.querySelectorAll('.quantity-selector');
    quantitySelectors.forEach(selector => {
        const minusBtn = selector.querySelector('.minus-btn');
        const plusBtn = selector.querySelector('.plus-btn');
        const qtyInput = selector.querySelector('.qty-input');

        if (minusBtn) {
            minusBtn.addEventListener('click', function() {
                let currentValue = parseInt(qtyInput.value);
                const min = parseInt(qtyInput.getAttribute('min')) || 1;
                if (currentValue > min) {
                    qtyInput.value = currentValue - 1;
                }
            });
        }

        if (plusBtn) {
            plusBtn.addEventListener('click', function() {
                let currentValue = parseInt(qtyInput.value);
                const max = parseInt(qtyInput.getAttribute('max'));
                if (max && currentValue >= max) {
                    showToast(`Số lượng vượt quá tồn kho! Tồn kho hiện có: ${max}`, 'warning');
                    return;
                }
                qtyInput.value = currentValue + 1;
            });
        }

        if (qtyInput) {
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
    });

    // Add to cart buttons
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    addToCartButtons.forEach(btn => {
        btn.addEventListener('click', async function(e) {
            e.stopPropagation();
            const productCard = this.closest('.product-card');
            const productId = parseInt(productCard.getAttribute('data-product-id'));
            const productName = productCard.getAttribute('data-product-name');
            const productPrice = parseFloat(productCard.getAttribute('data-product-price')) || 0;
            const productImage = productCard.getAttribute('data-product-image') || '';
            const productStock = productCard.getAttribute('data-product-stock') ? parseInt(productCard.getAttribute('data-product-stock')) : null;
            const quantity = parseInt(productCard.querySelector('.qty-input').value);

            const originalText = this.innerHTML;
            this.disabled = true;
            this.innerHTML = '<span>Đang thêm...</span>';

            try {
                const result = await addToCart(productId, productName, productPrice, quantity, productImage, productStock);
                if (result.success) {
                    showToast(result.message || 'Đã thêm vào giỏ hàng!', 'success');
                } else {
                    showToast(result.message || 'Có lỗi xảy ra!', 'warning');
                }
            } catch (error) {
                console.error('Error adding to cart:', error);
                showToast('Có lỗi xảy ra khi thêm vào giỏ hàng!', 'warning');
            } finally {
                this.disabled = false;
                this.innerHTML = originalText;
            }
        });
    });
}

// Quick view modal function
function openQuickViewModal(productCard) {
    const modal = document.getElementById('quickViewModal');
    if (!modal) {
        const productId = productCard.getAttribute('data-product-id');
        window.location.href = `/product/detail/${productId}`;
        return;
    }

    const productId = productCard.getAttribute('data-product-id');
    const productName = productCard.getAttribute('data-product-name');
    const productPrice = productCard.getAttribute('data-product-price');
    const productImage = productCard.getAttribute('data-product-image');
    const productStock = productCard.getAttribute('data-product-stock');
    const productDescription = productCard.getAttribute('data-product-description');

    document.getElementById('modalProductImage').src = productImage;
    document.getElementById('modalProductName').textContent = productName;
    document.getElementById('modalProductPrice').textContent = formatPrice(productPrice);
    
    // Update description in modal
    const modalDescription = document.getElementById('modalProductDescription');
    if (modalDescription) {
        if (productDescription && productDescription.trim() !== '') {
            modalDescription.textContent = productDescription;
        } else {
            modalDescription.textContent = 'Hoa tươi cao cấp được chọn lọc kỹ lưỡng từ vườn ươm uy tín. Mỗi bông hoa đều được chăm sóc cẩn thận để đảm bảo độ tươi và vẻ đẹp hoàn hảo.';
        }
    }
    
    // Update stock status in modal
    const modalStockStatus = document.getElementById('modalStockStatus');
    const stockQuantity = productStock ? parseInt(productStock) : 0;
    if (modalStockStatus) {
        if (stockQuantity > 0) {
            modalStockStatus.textContent = `Còn hàng (${stockQuantity} sản phẩm)`;
            modalStockStatus.style.color = '#4caf50';
        } else {
            modalStockStatus.textContent = 'Hết hàng';
            modalStockStatus.style.color = '#f44336';
        }
    }
    
    // Get rating from data attributes if available (from home page)
    const productRating = productCard.getAttribute('data-product-rating');
    const productReviews = productCard.getAttribute('data-product-reviews');
    
    // Update rating in modal if elements exist
    const ratingText = document.querySelector('.modal-product-rating .rating-text');
    if (ratingText && productReviews !== null) {
        ratingText.textContent = `(${productReviews || 0} đánh giá)`;
    }
    
    // Render stars with half star support
    if (productRating !== null) {
        renderStars('.modal-product-rating .rating-stars', parseFloat(productRating) || 0);
    }
    
    const modalQtyInput = document.getElementById('modalQuantity');
    modalQtyInput.value = '1';

    const modalAddToCartBtn = document.getElementById('modalAddToCartBtn');
    if (stockQuantity > 0) {
        modalQtyInput.setAttribute('max', stockQuantity);
        modalQtyInput.disabled = false;
        if (modalAddToCartBtn) {
            modalAddToCartBtn.disabled = false;
            modalAddToCartBtn.style.opacity = '1';
            modalAddToCartBtn.style.cursor = 'pointer';
        }
    } else {
        modalQtyInput.setAttribute('max', '0');
        modalQtyInput.disabled = true;
        if (modalAddToCartBtn) {
            modalAddToCartBtn.disabled = true;
            modalAddToCartBtn.style.opacity = '0.6';
            modalAddToCartBtn.style.cursor = 'not-allowed';
        }
    }

    modal.setAttribute('data-current-product-id', productId);
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close Quick View Modal
function closeQuickViewModal() {
    const modal = document.getElementById('quickViewModal');
    if (!modal) return;

    const modalBody = modal.querySelector('.modal-body');

    if (modalBody) {
        modalBody.style.animation = 'none';
        setTimeout(() => {
            modalBody.style.animation = '';
        }, 10);
    }

    modal.classList.remove('active');

    setTimeout(() => {
        if (!modal.classList.contains('active')) {
            document.body.style.overflow = '';
        }
    }, 400);
}

// Initialize modal handlers
function initModalHandlers() {
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeQuickViewModal);
    }

    const modalOverlay = document.querySelector('.modal-overlay');
    if (modalOverlay) {
        modalOverlay.addEventListener('click', closeQuickViewModal);
    }

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const modal = document.getElementById('quickViewModal');
            if (modal && modal.classList.contains('active')) {
                closeQuickViewModal();
            }
        }
    });

    const modalMinusBtn = document.querySelector('.modal-minus-btn');
    const modalPlusBtn = document.querySelector('.modal-plus-btn');
    const modalQtyInput = document.getElementById('modalQuantity');

    if (modalMinusBtn && modalPlusBtn && modalQtyInput) {
        modalMinusBtn.addEventListener('click', function() {
            let currentValue = parseInt(modalQtyInput.value);
            const min = parseInt(modalQtyInput.getAttribute('min')) || 1;
            if (currentValue > min) {
                modalQtyInput.value = currentValue - 1;
            }
        });

        modalPlusBtn.addEventListener('click', function() {
            let currentValue = parseInt(modalQtyInput.value);
            const max = parseInt(modalQtyInput.getAttribute('max'));
            if (max && currentValue >= max) {
                showToast(`Số lượng vượt quá tồn kho! Tồn kho hiện có: ${max}`, 'warning');
                return;
            }
            modalQtyInput.value = currentValue + 1;
        });

        modalQtyInput.addEventListener('change', function() {
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

    const modalAddToCartBtn = document.getElementById('modalAddToCartBtn');
    if (modalAddToCartBtn) {
        modalAddToCartBtn.addEventListener('click', async function(e) {
            e.preventDefault();

            const modal = document.getElementById('quickViewModal');
            const productId = parseInt(modal.getAttribute('data-current-product-id'));
            const productName = document.getElementById('modalProductName').textContent;
            const quantity = parseInt(document.getElementById('modalQuantity').value);

            const productCard = document.querySelector(`[data-product-id="${productId}"]`);
            const productPrice = productCard ? parseFloat(productCard.getAttribute('data-product-price')) || 0 : 0;
            const productImage = productCard ? productCard.getAttribute('data-product-image') || '' : '';
            const productStock = productCard ? (productCard.getAttribute('data-product-stock') ? parseInt(productCard.getAttribute('data-product-stock')) : null) : null;

            const originalText = this.innerHTML;
            this.disabled = true;
            this.innerHTML = '<i class="fas fa-shopping-cart"></i> Đang thêm...';

            try {
                const result = await addToCart(productId, productName, productPrice, quantity, productImage, productStock);

                if (result.success) {
                    showToast(result.message || 'Đã thêm vào giỏ hàng!', 'success');
                    setTimeout(() => {
                        closeQuickViewModal();
                    }, 500);
                } else {
                    showToast(result.message || 'Có lỗi xảy ra!', 'warning');
                }
            } catch (error) {
                console.error('Error adding to cart:', error);
                showToast('Có lỗi xảy ra khi thêm vào giỏ hàng!', 'warning');
            } finally {
                this.disabled = false;
                this.innerHTML = originalText;
            }
        });
    }
}

// Toast notification function
function showToast(message, type = 'success') {
    // Don't show toast if message is empty or undefined
    if (!message || message.trim() === '') {
        return;
    }
    
    const toast = document.getElementById('toast');
    if (!toast) return;

    const toastSpan = toast.querySelector('span');
    const toastIcon = toast.querySelector('i');

    if (toastSpan) toastSpan.textContent = message;

    toast.classList.remove('warning', 'error', 'success');

    if (type !== 'success') {
        toast.classList.add(type);
    } else {
        toast.classList.add('success');
    }

    if (toastIcon) {
        if (type === 'warning') {
            toastIcon.className = 'fas fa-exclamation-circle';
        } else if (type === 'error') {
            toastIcon.className = 'fas fa-times-circle';
        } else {
            toastIcon.className = 'fas fa-check-circle';
        }
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
            if (toastSpan) toastSpan.textContent = '';
        }, 300); // Wait for transition to complete
    }, 3000);
}

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

// Initialize on page load
// Products are now rendered server-side via Thymeleaf, so we just initialize interactions
document.addEventListener('DOMContentLoaded', function() {
    // Reset toast state on page load
    resetToastState();
    
    initProductInteractions();
    initModalHandlers();
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