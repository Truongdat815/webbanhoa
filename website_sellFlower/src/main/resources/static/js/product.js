// Helper function to format price
function formatPrice(price) {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return '₫' + numPrice.toLocaleString('vi-VN');
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
async function loadProducts() {
    const productsGrid = document.getElementById('productsGrid');

    if (!productsGrid) {
        console.error('Products grid not found');
        return;
    }

    // Show loading message
    productsGrid.innerHTML = '<p style="text-align: center; padding: 40px; color: #666;">Đang tải sản phẩm...</p>';

    try {
        // ← GỌI API BACKEND
        const response = await fetch('/api/products');
        if (!response.ok) throw new Error('Failed to load products');

        const products = await response.json();

        // Clear loading message
        productsGrid.innerHTML = '';

        // Check if products exist
        if (!products || products.length === 0) {
            productsGrid.innerHTML = '<p style="text-align: center; padding: 40px; color: #666;">Không có sản phẩm nào.</p>';
            return;
        }

        // Display products
        products.forEach(product => {
            const productCard = createProductCard(product);
            productsGrid.innerHTML += productCard;
        });

        // Initialize quantity selectors and add to cart buttons
        initProductInteractions();

    } catch (error) {
        console.error('Error loading products:', error);
        productsGrid.innerHTML = '<p style="text-align: center; padding: 40px; color: #f44336;">Không thể tải sản phẩm. Vui lòng thử lại sau.</p>';
    }
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

    document.getElementById('modalProductImage').src = productImage;
    document.getElementById('modalProductName').textContent = productName;
    document.getElementById('modalProductPrice').textContent = formatPrice(productPrice);
    const modalQtyInput = document.getElementById('modalQuantity');
    modalQtyInput.value = '1';

    if (productStock) {
        modalQtyInput.setAttribute('max', productStock);
    } else {
        modalQtyInput.removeAttribute('max');
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