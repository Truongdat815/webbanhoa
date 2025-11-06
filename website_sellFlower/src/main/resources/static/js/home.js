// Header scroll effect
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Sync quantity selector width with product image width
function syncQuantitySelectorWidth() {
    document.querySelectorAll('.product-card').forEach(card => {
        const imageContainer = card.querySelector('.product-image-container');
        const quantitySelector = card.querySelector('.quantity-selector');
        
        if (imageContainer && quantitySelector) {
            const imageWidth = imageContainer.offsetWidth;
            quantitySelector.style.width = imageWidth + 'px';
            quantitySelector.style.maxWidth = imageWidth + 'px';
        }
    });
}

// Sync on page load
window.addEventListener('load', syncQuantitySelectorWidth);
// Sync on window resize
window.addEventListener('resize', syncQuantitySelectorWidth);
// Initial sync
setTimeout(syncQuantitySelectorWidth, 100);

// Quantity selector
document.querySelectorAll('.quantity-selector').forEach(selector => {
    const minusBtn = selector.querySelector('.minus-btn');
    const plusBtn = selector.querySelector('.plus-btn');
    const qtyInput = selector.querySelector('.qty-input');

    minusBtn.addEventListener('click', function() {
        let currentValue = parseInt(qtyInput.value);
        if (currentValue > 1) {
            qtyInput.value = currentValue - 1;
            animateInput(qtyInput);
        }
    });

    plusBtn.addEventListener('click', function() {
        let currentValue = parseInt(qtyInput.value);
        qtyInput.value = currentValue + 1;
        animateInput(qtyInput);
    });

    qtyInput.addEventListener('change', function() {
        if (this.value < 1) {
            this.value = 1;
        }
    });
});

function animateInput(input) {
    input.style.transform = 'scale(1.2)';
    setTimeout(() => {
        input.style.transform = 'scale(1)';
    }, 200);
}

// Add to Cart functionality
document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Check if user is logged in
        if (!isUserLoggedIn()) {
            showLoginRequiredMessage();
            return;
        }
        
        const productCard = this.closest('.product-card');
        const productName = productCard.querySelector('.product-name').textContent;
        const quantity = productCard.querySelector('.qty-input').value;
        
        // Animate button
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = '';
        }, 150);

        // Show toast notification
        showToast('Đã thêm vào giỏ!');

        // Update cart count
        updateCartCount(parseInt(quantity));

        // Here you would typically send data to server
        // For now, we'll just show visual feedback
        console.log(`Added ${quantity} x ${productName} to cart`);
    });
});

// Toast notification
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastSpan = toast.querySelector('span');
    toastSpan.textContent = message;
    
    // Remove existing type classes
    toast.classList.remove('warning', 'error', 'success');
    
    // Add type class if not success
    if (type !== 'success') {
        toast.classList.add(type);
    }
    
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Function to check if user is logged in
function isUserLoggedIn() {
    const mainContent = document.querySelector('.main-content');
    return mainContent && mainContent.getAttribute('data-is-logged-in') === 'true';
}

// Function to show login required message
function showLoginRequiredMessage() {
    showToast('Vui lòng đăng nhập để tiếp tục', 'warning');
}

// Update cart count
function updateCartCount(quantity) {
    const cartCount = document.getElementById('cartCount');
    let currentCount = parseInt(cartCount.textContent) || 0;
    cartCount.textContent = currentCount + quantity;
    
    // Animate cart count
    cartCount.style.animation = 'none';
    setTimeout(() => {
        cartCount.style.animation = 'pulse 0.5s ease';
    }, 10);
}

// Newsletter form
document.querySelector('.newsletter-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = this.querySelector('input[type="email"]').value;
    
    if (email) {
        showToast('Đăng ký thành công!');
        this.reset();
    }
});

// Quick view button functionality
document.querySelectorAll('.quick-view-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.stopPropagation();
        const productCard = this.closest('.product-card');
        openQuickViewModal(productCard);
    });
});

// Open Quick View Modal
function openQuickViewModal(productCard) {
    const modal = document.getElementById('quickViewModal');
    
    // Lấy dữ liệu từ data attributes để đảm bảo chính xác
    const productId = productCard.getAttribute('data-product-id');
    const productName = productCard.getAttribute('data-product-name');
    const productPrice = productCard.getAttribute('data-product-price');
    const productImage = productCard.getAttribute('data-product-image');
    
    // Fill modal with product data
    document.getElementById('modalProductImage').src = productImage;
    document.getElementById('modalProductName').textContent = productName;
    document.getElementById('modalProductPrice').textContent = productPrice;
    document.getElementById('modalQuantity').value = '1';
    
    // Lưu product ID vào modal để có thể dùng khi thêm vào giỏ hàng
    modal.setAttribute('data-current-product-id', productId);
    
    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close Quick View Modal
function closeQuickViewModal() {
    const modal = document.getElementById('quickViewModal');
    const modalBody = modal.querySelector('.modal-body');
    
    // Reset modal body opacity for smooth close animation
    if (modalBody) {
        modalBody.style.animation = 'none';
        setTimeout(() => {
            modalBody.style.animation = '';
        }, 10);
    }
    
    // Remove active class to trigger close animation
    modal.classList.remove('active');
    
    // Wait for animation to complete before allowing body scroll
    setTimeout(() => {
        if (!modal.classList.contains('active')) {
            document.body.style.overflow = '';
        }
    }, 400);
}

// Close modal button
const modalCloseBtn = document.getElementById('modalCloseBtn');
if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeQuickViewModal);
}

// Close modal when clicking overlay
const modalOverlay = document.querySelector('.modal-overlay');
if (modalOverlay) {
    modalOverlay.addEventListener('click', closeQuickViewModal);
}

// Close modal with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const modal = document.getElementById('quickViewModal');
        if (modal && modal.classList.contains('active')) {
            closeQuickViewModal();
        }
    }
});

// Modal quantity selector
const modalMinusBtn = document.querySelector('.modal-minus-btn');
const modalPlusBtn = document.querySelector('.modal-plus-btn');
const modalQtyInput = document.getElementById('modalQuantity');

if (modalMinusBtn && modalPlusBtn && modalQtyInput) {
    modalMinusBtn.addEventListener('click', function() {
        let currentValue = parseInt(modalQtyInput.value);
        if (currentValue > 1) {
            modalQtyInput.value = currentValue - 1;
            animateInput(modalQtyInput);
        }
    });

    modalPlusBtn.addEventListener('click', function() {
        let currentValue = parseInt(modalQtyInput.value);
        modalQtyInput.value = currentValue + 1;
        animateInput(modalQtyInput);
    });

    modalQtyInput.addEventListener('change', function() {
        if (this.value < 1) {
            this.value = 1;
        }
    });
}

// Modal Add to Cart button
const modalAddToCartBtn = document.getElementById('modalAddToCartBtn');
if (modalAddToCartBtn) {
    modalAddToCartBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Check if user is logged in
        if (!isUserLoggedIn()) {
            showLoginRequiredMessage();
            return;
        }
        
        const modal = document.getElementById('quickViewModal');
        const productId = modal.getAttribute('data-current-product-id');
        const quantity = document.getElementById('modalQuantity').value;
        const productName = document.getElementById('modalProductName').textContent;
        
        // Animate button
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = '';
        }, 150);

        // Show toast notification
        showToast('Đã thêm vào giỏ!');

        // Update cart count
        updateCartCount(parseInt(quantity));

        // Here you would typically send data to server
        console.log(`Added ${quantity} x ${productName} (ID: ${productId}) to cart`);
        
        // Close modal after adding to cart
        setTimeout(() => {
            closeQuickViewModal();
        }, 500);
    });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
