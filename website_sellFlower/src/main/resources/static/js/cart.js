// Helper function to format price
function formatPrice(price) {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return '₫' + numPrice.toLocaleString('vi-VN');
}

// Load cart items from session
async function loadCartItems(skipAnimation = false) {
    try {
        const response = await fetch('/cart/api');
        if (!response.ok) throw new Error('Failed to load cart');
        
        const cartItems = await response.json();
        const cartItemsList = document.getElementById('cartItemsList');
        const emptyCart = document.getElementById('emptyCart');
        const cartWithItems = document.getElementById('cartWithItems');
        
        if (!cartItems || cartItems.length === 0) {
            emptyCart.style.display = 'block';
            cartWithItems.style.display = 'none';
            return;
        }
        
        emptyCart.style.display = 'none';
        cartWithItems.style.display = 'grid';
        
        // Clear existing items
        cartItemsList.innerHTML = '';
        
        // Render cart items
        cartItems.forEach(item => {
            const cartItemElement = createCartItemElement(item);
            // Disable animation if skipAnimation is true
            if (skipAnimation) {
                cartItemElement.classList.add('no-animation');
            }
            cartItemsList.appendChild(cartItemElement);
        });
        
        // Initialize quantity selectors and remove buttons
        initCartItemInteractions();
        
        // Update cart summary
        updateCartSummary(cartItems);
    } catch (error) {
        console.error('Error loading cart items:', error);
    }
}

// Create cart item element
function createCartItemElement(item) {
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    cartItem.setAttribute('data-product-id', item.productId);
    
    // Use price directly in VND
    const price = parseFloat(item.price);
    const totalPrice = price * item.quantity;
    const stock = item.stock || null;
    const maxQuantity = stock || 999999; // Use stock as max, or very high number if no stock info
    
    cartItem.innerHTML = `
        <button class="remove-item-btn" data-product-id="${item.productId}">
            <i class="fas fa-times"></i>
        </button>
        <div class="item-image">
            <img src="${item.imageUrl || 'https://via.placeholder.com/120x120?text=Product'}" alt="${item.productName}">
        </div>
        <div class="item-details">
            <h3 class="item-name">${item.productName}</h3>
            <p class="item-price">${formatPrice(price)}</p>
        </div>
        <div class="item-quantity">
            <button class="qty-btn minus-btn" data-product-id="${item.productId}">-</button>
            <input type="number" value="${item.quantity}" min="1" max="${maxQuantity}" class="qty-input" data-product-id="${item.productId}" data-unit-price="${price}" data-stock="${stock || ''}">
            <button class="qty-btn plus-btn" data-product-id="${item.productId}">+</button>
        </div>
        <div class="item-total">
            <span class="total-price">${formatPrice(totalPrice)}</span>
        </div>
    `;
    
    return cartItem;
}

// Initialize cart item interactions
function initCartItemInteractions() {
    // Quantity selectors
    document.querySelectorAll('.item-quantity').forEach(quantitySelector => {
        const minusBtn = quantitySelector.querySelector('.minus-btn');
        const plusBtn = quantitySelector.querySelector('.plus-btn');
        const qtyInput = quantitySelector.querySelector('.qty-input');
        const cartItem = quantitySelector.closest('.cart-item');
        const productId = parseInt(qtyInput.getAttribute('data-product-id'));
        const unitPrice = parseFloat(qtyInput.getAttribute('data-unit-price'));
        const stock = qtyInput.getAttribute('data-stock') ? parseInt(qtyInput.getAttribute('data-stock')) : null;
        const totalPriceElement = cartItem.querySelector('.total-price');

        minusBtn.addEventListener('click', async function() {
            let currentValue = parseInt(qtyInput.value);
            if (currentValue > 1) {
                qtyInput.value = currentValue - 1;
                await updateCartItemQuantity(productId, parseInt(qtyInput.value));
                updateItemTotal(parseInt(qtyInput.value), unitPrice, totalPriceElement);
                await updateCartSummaryOnly(); // Only update summary, don't reload items
            }
        });

        plusBtn.addEventListener('click', async function() {
            let currentValue = parseInt(qtyInput.value);
            const max = stock || parseInt(qtyInput.getAttribute('max')) || 999999;
            
            if (max && currentValue >= max) {
                showToast(`Số lượng vượt quá tồn kho! Tồn kho hiện có: ${max}`, 'warning');
                qtyInput.value = max;
                return;
            }
            
            qtyInput.value = currentValue + 1;
            const result = await updateCartItemQuantity(productId, parseInt(qtyInput.value));
            if (result && result.success) {
                updateItemTotal(parseInt(qtyInput.value), unitPrice, totalPriceElement);
                await updateCartSummaryOnly(); // Only update summary, don't reload items
            } else {
                // Revert if update failed
                qtyInput.value = currentValue;
                if (result && result.message) {
                    showToast(result.message, 'warning');
                }
            }
        });

        qtyInput.addEventListener('change', async function() {
            const min = parseInt(this.getAttribute('min')) || 1;
            const max = stock || parseInt(this.getAttribute('max')) || 999999;
            
            if (this.value < min) {
                this.value = min;
            } else if (max && this.value > max) {
                this.value = max;
                showToast(`Số lượng vượt quá tồn kho! Tồn kho hiện có: ${max}`, 'warning');
            }
            
            const result = await updateCartItemQuantity(productId, parseInt(this.value));
            if (result && result.success) {
                updateItemTotal(parseInt(this.value), unitPrice, totalPriceElement);
                await updateCartSummaryOnly(); // Only update summary, don't reload items
            } else {
                // Revert to previous value if update failed
                const previousValue = this.getAttribute('data-previous-value') || min;
                this.value = previousValue;
                if (result && result.message) {
                    showToast(result.message, 'warning');
                }
            }
        });
        
        // Store previous value for revert
        qtyInput.addEventListener('focus', function() {
            this.setAttribute('data-previous-value', this.value);
        });
    });

    // Remove item buttons
    document.querySelectorAll('.remove-item-btn').forEach(btn => {
        btn.addEventListener('click', async function() {
            const productId = parseInt(this.getAttribute('data-product-id'));
            const cartItem = this.closest('.cart-item');
            
            cartItem.style.animation = 'slideOut 0.5s ease-out';
            setTimeout(async () => {
                await removeCartItem(productId);
                await loadCartItems(); // Reload cart only when removing item
            }, 500);
        });
    });
}

// Update cart item quantity
async function updateCartItemQuantity(productId, quantity) {
    try {
        const response = await fetch('/cart/api/update', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `productId=${productId}&quantity=${quantity}`
        });
        
        if (!response.ok) throw new Error('Failed to update cart item');
        
        const result = await response.json();
        if (result.success) {
            updateCartCountInHeaderLocal(result.cartCount);
            // Also update via shared function
            if (typeof updateCartCountInHeader === 'function') {
                updateCartCountInHeader();
            }
            return result;
        } else {
            return result;
        }
    } catch (error) {
        console.error('Error updating cart item:', error);
        return { success: false, message: 'Có lỗi xảy ra khi cập nhật số lượng' };
    }
}

// Remove cart item
async function removeCartItem(productId) {
    try {
        const response = await fetch(`/cart/api/remove/${productId}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) throw new Error('Failed to remove cart item');
        
        const result = await response.json();
        if (result.success) {
            updateCartCountInHeaderLocal(result.cartCount);
            // Also update via shared function
            if (typeof updateCartCountInHeader === 'function') {
                updateCartCountInHeader();
            }
        }
    } catch (error) {
        console.error('Error removing cart item:', error);
    }
}

// Update item total price
function updateItemTotal(quantity, price, totalElement) {
    const total = quantity * price;
    totalElement.textContent = formatPrice(total);
    
    // No animation to prevent jumping
}

// Update cart summary only (without reloading items)
async function updateCartSummaryOnly() {
    try {
        const response = await fetch('/cart/api');
        if (!response.ok) return;
        
        const cartItems = await response.json();
        updateCartSummary(cartItems);
    } catch (error) {
        console.error('Error updating cart summary:', error);
    }
}

// Update cart summary
function updateCartSummary(cartItems) {
    let subtotal = 0;
    
    cartItems.forEach(item => {
        const price = parseFloat(item.price);
        subtotal += price * item.quantity;
    });
    
    const shipping = 15000; // 15,000 VND
    const vat = 0;
    const total = subtotal + shipping + vat;
    
    document.querySelector('.subtotal').textContent = formatPrice(subtotal);
    document.querySelector('.shipping').textContent = formatPrice(shipping);
    document.querySelector('.vat').textContent = formatPrice(vat);
    document.querySelector('.total').textContent = formatPrice(total);
    
    // Remove animation to prevent jumping
    const summary = document.querySelector('.cart-summary');
    if (summary) {
        summary.style.transform = '';
    }
}

// Toast notification function
function showToast(message, type = 'success') {
    // Try to use toast from page if exists
    let toast = document.getElementById('toast');
    if (!toast) {
        // Create toast element if it doesn't exist
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.className = 'toast';
        toast.innerHTML = '<i class="fas fa-check-circle"></i><span></span>';
        document.body.appendChild(toast);
    }
    
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

// Update cart count in header (uses shared function from cart-utils.js)
function updateCartCountInHeaderLocal(count) {
    const cartCountElements = document.querySelectorAll('.cart-count, #cartCount');
    cartCountElements.forEach(element => {
        element.textContent = count;
        element.style.transform = 'scale(1.3)';
        setTimeout(() => {
            element.style.transform = 'scale(1)';
        }, 200);
    });
}

// Update cart button
document.getElementById('updateCartBtn')?.addEventListener('click', async function() {
    // Reload cart items to ensure all changes are saved
    await loadCartItems();
    alert('Đã cập nhật giỏ hàng thành công!');
});

// Apply coupon button
document.getElementById('applyCouponBtn')?.addEventListener('click', function() {
    const couponCode = document.getElementById('couponCode').value;
    if (couponCode.trim() === '') {
        alert('Vui lòng nhập mã giảm giá');
        return;
    }
    // TODO: Implement coupon validation
    alert('Mã giảm giá đã được áp dụng! (Tính năng sắp ra mắt)');
});

// Checkout button
document.getElementById('checkoutBtn')?.addEventListener('click', async function(e) {
    e.preventDefault();
    
    try {
        const response = await fetch('/cart/api');
        const cartItems = await response.json();
        
        if (!cartItems || cartItems.length === 0) {
            alert('Giỏ hàng của bạn đang trống!');
            return;
        }
        
        // Clear cart after checkout
        const clearResponse = await fetch('/cart/api/clear', {
            method: 'POST'
        });
        
        if (clearResponse.ok) {
            updateCartCountInHeaderLocal(0);
            // Also update via shared function
            if (typeof updateCartCountInHeader === 'function') {
                updateCartCountInHeader();
            }
            alert('Đặt hàng thành công! Giỏ hàng đã được xóa.');
            window.location.href = '/home';
        } else {
            alert('Có lỗi xảy ra khi xử lý thanh toán. Vui lòng thử lại.');
        }
    } catch (error) {
        console.error('Error during checkout:', error);
        alert('Có lỗi xảy ra khi xử lý thanh toán. Vui lòng thử lại.');
    }
});

// Header scroll effect
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Newsletter form
document.querySelector('.newsletter-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const email = this.querySelector('input[type="email"]').value;
    
    if (email) {
        alert('Đăng ký thành công!');
        this.reset();
    }
});

// Initialize cart on page load
document.addEventListener('DOMContentLoaded', async function() {
    await loadCartItems();
    
    // Load cart count in header (uses shared function from cart-utils.js)
    if (typeof updateCartCountInHeader === 'function') {
        updateCartCountInHeader();
    }
});
