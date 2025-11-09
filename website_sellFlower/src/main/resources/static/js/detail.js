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
// Product data is now loaded server-side via Thymeleaf, so we just initialize interactions
document.addEventListener('DOMContentLoaded', function() {
    initThumbnailGallery();
    initQuantitySelector();
    initAddToCart();
    initTabs();
});