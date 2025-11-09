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

// Load product details FROM BACKEND API
async function loadProductDetails() {
    const productId = getProductIdFromURL();

    if (!productId) {
        window.location.href = '/product';
        return;
    }

    try {
        // ← GỌI API BACKEND LẤY CHI TIẾT SẢN PHẨM
        const response = await fetch(`/api/products/${productId}`);
        if (!response.ok) {
            throw new Error('Product not found');
        }

        const product = await response.json();

        // Update product details on page
        document.getElementById('productTitle').textContent = product.name || 'Sản phẩm';
        document.getElementById('productPrice').textContent = formatPrice(product.price || 0);
        document.getElementById('mainProductImage').src = product.imageUrl || productImages[0];

        const qtyInput = document.getElementById('productQuantity');
        const stock = parseInt(product.stockQuantity) || 50;
        qtyInput.setAttribute('max', stock);

        // Update short description if available
        if (product.description && document.getElementById('productShortDesc')) {
            document.getElementById('productShortDesc').textContent = product.description;
        }

        // Set main image source
        const mainImage = document.getElementById('mainProductImage');
        mainImage.src = product.imageUrl || productImages[0];

        // Update thumbnails
        const thumbnails = document.querySelectorAll('.thumbnail');
        thumbnails.forEach((thumb, index) => {
            thumb.src = index === 0 ? product.imageUrl : productImages[index];
        });

        // Update stock status
        const stockStatus = document.getElementById('stockStatus');
        if (stock > 0) {
            stockStatus.textContent = `Còn hàng (${stock} sản phẩm)`;
            stockStatus.style.color = '#4caf50';
        } else {
            stockStatus.textContent = 'Hết hàng';
            stockStatus.style.color = '#f44336';
        }

        // ← GỌI API BACKEND LẤY REVIEWS
        await loadProductReviews(productId);

    } catch (error) {
        console.error('Error loading product details:', error);
        alert('Không tìm thấy sản phẩm!');
        window.location.href = '/product';
    }
}

// ← THÊM MỚI: Function load reviews từ Backend
async function loadProductReviews(productId) {
    try {
        const response = await fetch(`/api/products/${productId}/reviews`);
        if (!response.ok) return;

        const reviews = await response.json();

        const reviewsList = document.querySelector('.reviews-list');
        if (!reviewsList || reviews.length === 0) return;

        reviewsList.innerHTML = '';

        reviews.forEach(review => {
            const reviewCard = `
                <div class="review-item">
                    <div class="reviewer-info">
                        <div class="reviewer-avatar">${review.account.fullName ? review.account.fullName.charAt(0).toUpperCase() : 'U'}</div>
                        <div class="reviewer-details">
                            <h4 class="reviewer-name">${review.account.fullName || review.account.username}</h4>
                            <div class="review-stars">
                                ${'<i class="fas fa-star"></i>'.repeat(review.rating)}
                            </div>
                        </div>
                    </div>
                    <p class="review-text">${review.comment || ''}</p>
                    <span class="review-date">${new Date(review.reviewDate).toLocaleDateString('vi-VN')}</span>
                </div>
            `;
            reviewsList.innerHTML += reviewCard;
        });

    } catch (error) {
        console.error('Error loading reviews:', error);
    }
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

    addToCartBtn.addEventListener('click', async function() {
        const productId = getProductIdFromURL();
        if (!productId) {
            showToast('Không tìm thấy sản phẩm!', 'warning');
            return;
        }

        const quantity = parseInt(document.getElementById('productQuantity').value);

        // Get product info from page
        const productName = document.getElementById('productTitle').textContent;
        const productPriceText = document.getElementById('productPrice').textContent;
        const productPrice = parseFloat(productPriceText.replace(/[^\d]/g, ''));
        const productImage = document.getElementById('mainProductImage').src;
        const productStock = parseInt(document.getElementById('productQuantity').getAttribute('max'));

        // Disable button during request
        addToCartBtn.disabled = true;
        addToCartBtn.textContent = 'Đang thêm...';

        try {
            const result = await addToCart(
                productId,
                productName,
                productPrice,
                quantity,
                productImage || '',
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
            const icon = addToCartBtn.querySelector('i');
            addToCartBtn.innerHTML = icon ? icon.outerHTML + ' Thêm vào giỏ hàng' : 'Thêm vào giỏ hàng';
        }
    });
}

// Show toast notification
function showToast(message, type = 'success') {
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

    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
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

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    loadProductDetails();
    initThumbnailGallery();
    initQuantitySelector();
    initAddToCart();
    initTabs();
});