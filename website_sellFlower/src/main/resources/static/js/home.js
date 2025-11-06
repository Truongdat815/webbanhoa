// Helper function để format giá tiền
function formatPrice(price) {
    // Convert to number if it's a string
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    // Format with thousands separator and add ₫
    return '₫' + numPrice.toLocaleString('vi-VN');
}

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

        if (this.value < min) {
            this.value = min;
        } else if (max && this.value > max) {
            this.value = max;
            showToast(`Số lượng vượt quá tồn kho! Tồn kho hiện có: ${max}`, 'warning');
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
    btn.addEventListener('click', async function(e) {
        e.preventDefault();

        // Check if user is logged in
        if (!isUserLoggedIn()) {
            showLoginRequiredMessage();
            return;
        }

        const productCard = this.closest('.product-card');
        const productId = parseInt(productCard.getAttribute('data-product-id'));
        const productName = productCard.getAttribute('data-product-name') || productCard.querySelector('.product-name').textContent;
        const productPrice = parseFloat(productCard.getAttribute('data-product-price')) || 0;
        const productImage = productCard.getAttribute('data-product-image') || '';
        const productStock = productCard.getAttribute('data-product-stock') ? parseInt(productCard.getAttribute('data-product-stock')) : null;
        const quantity = parseInt(productCard.querySelector('.qty-input').value);

        // Disable button during request
        const originalText = this.innerHTML;
        this.disabled = true;
        this.innerHTML = '<span>Đang thêm...</span>';

        // Animate button
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = '';
        }, 150);

        try {
            // Add to cart via API
            const result = await addToCart(productId, productName, productPrice, quantity, productImage, productStock);
            
            if (result.success) {
                showToast(result.message || 'Đã thêm vào giỏ!');
                // Cart count will be updated automatically by cart-utils.js
            } else {
                showToast(result.message || 'Có lỗi xảy ra!', 'warning');
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            showToast('Có lỗi xảy ra khi thêm vào giỏ hàng!', 'warning');
        } finally {
            // Re-enable button
            this.disabled = false;
            this.innerHTML = originalText;
        }
    });
});

// Toast notification
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastSpan = toast.querySelector('span');
    toastSpan.textContent = message;

    // Remove existing type classes
    toast.classList.remove('warning', 'error', 'success');

    // Add type class
    if (type !== 'success') {
        toast.classList.add(type);
    } else {
        toast.classList.add('success');
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

// Cart count is now handled by cart-utils.js

// Newsletter form
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = this.querySelector('input[type="email"]').value;

        if (email) {
            showToast('Đăng ký thành công!');
            this.reset();
        }
    });
}

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

    // Lấy max stock từ quantity input của product card
    const qtyInput = productCard.querySelector('.qty-input');
    const maxStock = qtyInput ? qtyInput.getAttribute('max') : null;

    // Fill modal with product data
    document.getElementById('modalProductImage').src = productImage;
    document.getElementById('modalProductName').textContent = productName;
    document.getElementById('modalProductPrice').textContent = formatPrice(productPrice);
    const modalQtyInput = document.getElementById('modalQuantity');
    modalQtyInput.value = '1';

    // Set max stock cho modal quantity input
    if (maxStock) {
        modalQtyInput.setAttribute('max', maxStock);
    } else {
        modalQtyInput.removeAttribute('max');
    }

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
        const min = parseInt(modalQtyInput.getAttribute('min')) || 1;
        if (currentValue > min) {
            modalQtyInput.value = currentValue - 1;
            animateInput(modalQtyInput);
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
        animateInput(modalQtyInput);
    });

    modalQtyInput.addEventListener('change', function() {
        const min = parseInt(this.getAttribute('min')) || 1;
        const max = parseInt(this.getAttribute('max'));

        if (this.value < min) {
            this.value = min;
        } else if (max && this.value > max) {
            this.value = max;
            showToast(`Số lượng vượt quá tồn kho! Tồn kho hiện có: ${max}`, 'warning');
        }
    });
}

// Modal Add to Cart button
const modalAddToCartBtn = document.getElementById('modalAddToCartBtn');
if (modalAddToCartBtn) {
    modalAddToCartBtn.addEventListener('click', async function(e) {
        e.preventDefault();

        // Check if user is logged in
        if (!isUserLoggedIn()) {
            showLoginRequiredMessage();
            return;
        }

        const modal = document.getElementById('quickViewModal');
        const productId = parseInt(modal.getAttribute('data-current-product-id'));
        const quantity = parseInt(document.getElementById('modalQuantity').value);
        const productName = document.getElementById('modalProductName').textContent;
        
        // Get product data from the product card that opened the modal
        const productCard = document.querySelector(`[data-product-id="${productId}"]`);
        const productPrice = productCard ? parseFloat(productCard.getAttribute('data-product-price')) || 0 : 0;
        const productImage = productCard ? productCard.getAttribute('data-product-image') || '' : '';
        const productStock = productCard ? (productCard.getAttribute('data-product-stock') ? parseInt(productCard.getAttribute('data-product-stock')) : null) : null;

        // Disable button during request
        const originalText = this.innerHTML;
        this.disabled = true;
        this.innerHTML = '<i class="fas fa-shopping-cart"></i> Đang thêm...';

        // Animate button
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = '';
        }, 150);

        try {
            // Add to cart via API
            const result = await addToCart(productId, productName, productPrice, quantity, productImage, productStock);
            
            if (result.success) {
                showToast(result.message || 'Đã thêm vào giỏ!');
                // Cart count will be updated automatically by cart-utils.js
                
                // Close modal after adding to cart
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
            // Re-enable button
            this.disabled = false;
            this.innerHTML = originalText;
        }
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

// Product Tabs Functionality
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const tabId = this.getAttribute('data-tab');

        // Remove active class from all tabs
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

        // Add active class to clicked tab
        this.classList.add('active');
        document.getElementById(tabId).classList.add('active');

        // Reset carousel position when switching tabs
        if (tabId === 'new-arrival') {
            resetNewArrivalCarousel();
        }
    });
});

// New Arrival Carousel Functionality
function initNewArrivalCarousel() {
    const track = document.getElementById('newArrivalTrack');
    const prevBtn = document.getElementById('newArrivalPrev');
    const nextBtn = document.getElementById('newArrivalNext');
    const container = track?.closest('.carousel-container');
    const grid = track?.querySelector('.carousel-grid');
    const productCards = grid?.querySelectorAll('.product-card');

    if (!track || !prevBtn || !nextBtn || !container || !productCards || productCards.length === 0) {
        return;
    }

    const productsPerView = 3;
    const totalProducts = productCards.length;
    const maxSlide = Math.max(0, totalProducts - productsPerView);
    let currentSlide = 0;

    // Calculate slide distance (1 product card width + gap)
    function calculateSlideDistance() {
        if (productCards.length === 0) return 0;
        // Wait for layout to complete
        const cardWidth = productCards[0].offsetWidth;
        const gap = 40; // gap from CSS
        return cardWidth + gap;
    }

    function updateCarousel() {
        const slideDistance = calculateSlideDistance();
        const transformX = -currentSlide * slideDistance;
        track.style.transform = `translateX(${transformX}px)`;

        // Update button states
        if (prevBtn && nextBtn) {
            prevBtn.disabled = currentSlide === 0;
            nextBtn.disabled = currentSlide >= maxSlide;
        }
    }

    function nextSlide() {
        if (currentSlide < maxSlide) {
            currentSlide++;
            updateCarousel();
        }
    }

    function prevSlide() {
        if (currentSlide > 0) {
            currentSlide--;
            updateCarousel();
        }
    }

    // Add event listeners (only once)
    nextBtn.onclick = nextSlide;
    prevBtn.onclick = prevSlide;

    // Initialize
    setTimeout(() => {
        updateCarousel();
    }, 100);

    // Store functions for reset
    window.newArrivalCarousel = {
        reset: function() {
            currentSlide = 0;
            updateCarousel();
        },
        update: updateCarousel,
        next: nextSlide,
        prev: prevSlide
    };
}

function resetNewArrivalCarousel() {
    if (window.newArrivalCarousel && window.newArrivalCarousel.reset) {
        window.newArrivalCarousel.reset();
    }
}

// Function to navigate to product detail page
function goToProductDetail(productCard) {
    const productId = productCard.getAttribute('data-product-id');
    
    // Navigate to product detail page using path parameter
    window.location.href = `/product/detail/${productId}`;
}

// Initialize carousel on page load
window.addEventListener('DOMContentLoaded', function() {
    initNewArrivalCarousel();
    
    // Initialize hero banner carousel
    initHeroBannerCarousel();
});

// Hero Banner Carousel
function initHeroBannerCarousel() {
    const slides = document.querySelectorAll('.hero-slide');
    if (slides.length === 0) return;
    
    let currentSlide = 0;
    
    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.remove('active');
            if (i === index) {
                slide.classList.add('active');
            }
        });
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }
    
    // Auto play every 5 seconds
    setInterval(nextSlide, 5000);
    
    // Initialize first slide
    showSlide(0);
}

// Reinitialize on window resize
let resizeTimer;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
        initNewArrivalCarousel();
    }, 250);
});
