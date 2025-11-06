// Sample products data (will be replaced with API call later)
const sampleProducts = [
    {
        id: 1,
        name: "Cây Hoa Hồng Hồng",
        price: 420000,
        image: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=400",
        stock: 50
    },
    {
        id: 2,
        name: "Hoa Hạnh Phúc Cao Cấp",
        price: 420000,
        image: "https://images.unsplash.com/photo-1520763185298-1b434c919102?w=400",
        stock: 30
    },
    {
        id: 3,
        name: "Hoa Hồng Trắng",
        price: 380000,
        image: "https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?w=400",
        stock: 40
    },
    {
        id: 4,
        name: "Bó Hoa Hồng Đỏ",
        price: 480000,
        image: "https://images.unsplash.com/photo-1563241529-0c3e8b3d3e3f?w=400",
        stock: 25
    },
    {
        id: 5,
        name: "Khát Vọng Trái Tim",
        price: 360000,
        image: "https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=400",
        stock: 60
    },
    {
        id: 6,
        name: "Bó Hoa Hồng Đỏ",
        price: 480000,
        image: "https://images.unsplash.com/photo-1597848212624-e593b98b8c9a?w=400",
        stock: 35
    },
    {
        id: 7,
        name: "Khát Vọng Trái Tim",
        price: 360000,
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
        stock: 20
    },
    {
        id: 8,
        name: "Hoa Hồng Đỏ Tươi",
        price: 450000,
        image: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=400",
        stock: 45
    }
];

// Helper function to format price
function formatPrice(price) {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return '₫' + numPrice.toLocaleString('vi-VN');
}

// Function to create product card HTML
function createProductCard(product) {
    return `
        <div class="product-card" data-product-id="${product.id}" data-product-name="${product.name}" data-product-price="${product.price}" data-product-image="${product.image}" data-product-stock="${product.stock}">
            <div class="product-image-container" onclick="goToProductDetail(this.closest('.product-card'))">
                <img src="${product.image}" alt="${product.name}" class="product-image">
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
                    <input type="number" value="1" min="1" max="${product.stock}" class="qty-input">
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

// Function to load and display products
function loadProducts() {
    const productsGrid = document.getElementById('productsGrid');
    
    if (!productsGrid) {
        console.error('Products grid not found');
        return;
    }

    // Clear existing content
    productsGrid.innerHTML = '';

    // Display products
    sampleProducts.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.innerHTML += productCard;
    });

    // Initialize quantity selectors and add to cart buttons
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
                
                // 1. Chuyển giá trị nhập vào thành SỐ
                let currentValue = parseInt(this.value);
        
                // 2. Xử lý nếu người dùng nhập chữ (vd: "abc") hoặc rỗng
                if (isNaN(currentValue)) {
                    currentValue = min;
                }
        
                // 3. So sánh SỐ với SỐ
                if (currentValue < min) {
                    this.value = min;
                } else if (max && currentValue > max) { // So sánh (number > number)
                    this.value = max;
                    // Gọi thông báo toast
                    showToast(`Số lượng vượt quá tồn kho! Tồn kho hiện có: ${max}`, 'warning');
                } else {
                    // Cập nhật lại giá trị đã được parse (vd: "05" -> 5)
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
            const quantity = parseInt(productCard.querySelector('.qty-input').value);
            
            // Disable button during request
            const originalText = this.innerHTML;
            this.disabled = true;
            this.innerHTML = '<span>Đang thêm...</span>';
            
            try {
                const result = await addToCart(productId, productName, productPrice, quantity, productImage);
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

// Cart count is now handled by cart-utils.js

// Quick view modal function - opens modal instead of redirecting
function openQuickViewModal(productCard) {
    const modal = document.getElementById('quickViewModal');
    if (!modal) {
        // Fallback: redirect to detail page if modal doesn't exist
        const productId = productCard.getAttribute('data-product-id');
        window.location.href = `/product/detail/${productId}`;
        return;
    }

    // Get product data from data attributes
    const productId = productCard.getAttribute('data-product-id');
    const productName = productCard.getAttribute('data-product-name');
    const productPrice = productCard.getAttribute('data-product-price');
    const productImage = productCard.getAttribute('data-product-image');
    const productStock = productCard.getAttribute('data-product-stock');

    // Fill modal with product data
    document.getElementById('modalProductImage').src = productImage;
    document.getElementById('modalProductName').textContent = productName;
    document.getElementById('modalProductPrice').textContent = formatPrice(productPrice);
    const modalQtyInput = document.getElementById('modalQuantity');
    modalQtyInput.value = '1';

    // Set max stock for modal quantity input
    if (productStock) {
        modalQtyInput.setAttribute('max', productStock);
    } else {
        modalQtyInput.removeAttribute('max');
    }

    // Store product ID in modal for add to cart
    modal.setAttribute('data-current-product-id', productId);

    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close Quick View Modal
function closeQuickViewModal() {
    const modal = document.getElementById('quickViewModal');
    if (!modal) return;

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

// Initialize modal handlers
function initModalHandlers() {
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
            
            // 1. Chuyển giá trị nhập vào thành SỐ
            let currentValue = parseInt(this.value);
    
            // 2. Xử lý nếu người dùng nhập chữ (vd: "abc") hoặc rỗng
            if (isNaN(currentValue)) {
                currentValue = min;
            }
    
            // 3. So sánh SỐ với SỐ
            if (currentValue < min) {
                this.value = min;
            } else if (max && currentValue > max) { // So sánh (number > number)
                this.value = max;
                // Gọi thông báo toast
                showToast(`Số lượng vượt quá tồn kho! Tồn kho hiện có: ${max}`, 'warning');
            } else {
                // Cập nhật lại giá trị đã được parse (vd: "05" -> 5)
                this.value = currentValue;
            }
        });
    }

    // Modal Add to Cart button
    const modalAddToCartBtn = document.getElementById('modalAddToCartBtn');
    if (modalAddToCartBtn) {
        modalAddToCartBtn.addEventListener('click', async function(e) {
            e.preventDefault();
            
            const modal = document.getElementById('quickViewModal');
            const productId = parseInt(modal.getAttribute('data-current-product-id'));
            const productName = document.getElementById('modalProductName').textContent;
            const quantity = parseInt(document.getElementById('modalQuantity').value);
            
            // Get product data from the product card that opened the modal
            const productCard = document.querySelector(`[data-product-id="${productId}"]`);
            const productPrice = productCard ? parseFloat(productCard.getAttribute('data-product-price')) || 0 : 0;
            const productImage = productCard ? productCard.getAttribute('data-product-image') || '' : '';
            
            // Disable button during request
            const originalText = this.innerHTML;
            this.disabled = true;
            this.innerHTML = '<i class="fas fa-shopping-cart"></i> Đang thêm...';
            
            try {
                // Add to cart via API
                const result = await addToCart(productId, productName, productPrice, quantity, productImage);
                
                if (result.success) {
                    showToast(result.message || 'Đã thêm vào giỏ hàng!', 'success');
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
}

// Toast notification function
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    if (!toast) return;
    
    const toastSpan = toast.querySelector('span');
    const toastIcon = toast.querySelector('i');
    
    if (toastSpan) toastSpan.textContent = message;
    
    // Remove existing type classes
    toast.classList.remove('warning', 'error', 'success');
    
    // Add type class
    if (type !== 'success') {
        toast.classList.add(type);
    } else {
        toast.classList.add('success');
    }
    
    // Update icon based on type
    if (toastIcon) {
        if (type === 'warning') {
            toastIcon.className = 'fas fa-exclamation-circle';
        } else if (type === 'error') {
            toastIcon.className = 'fas fa-times-circle';
        } else {
            toastIcon.className = 'fas fa-check-circle';
        }
    }
    
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    initModalHandlers();
});

