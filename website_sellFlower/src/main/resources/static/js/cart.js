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
        
        // Initialize cart item interactions
        initCartItemInteractions();
        
        // Update cart summary
        updateCartSummary(cartItems);
        
        // Validate and correct quantities after loading (async, runs after DOM is ready)
        setTimeout(async () => {
            await validateAndCorrectQuantities(cartItems);
        }, 100);
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
    
    // Sửa logic kiểm tra stock. Dùng !== null để giữ lại giá trị 0
    const stock = (item.stock !== null && item.stock !== undefined) ? parseInt(item.stock) : null;
    
    // Nếu stock không phải là null (có thể là 0), dùng nó làm max. Nếu là null, dùng 999999
    const maxQuantity = (stock !== null) ? stock : 999999;
    
    // Validate and adjust quantity if it exceeds stock
    let quantity = item.quantity;
    // Kiểm tra stock !== null trước
    if (stock !== null && quantity > stock) {
        quantity = stock;
    }
    
    const totalPrice = price * quantity;
    // Gán data-stock chính xác
    const stockAttribute = (stock !== null) ? `data-stock="${stock}"` : '';
    
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
            <input type="number" value="${quantity}" min="1" max="${maxQuantity}" class="qty-input" data-product-id="${item.productId}" data-unit-price="${price}" ${stockAttribute}>
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
        
        // Sửa logic đọc stock
        const hasStock = qtyInput.hasAttribute('data-stock');
        const stock = hasStock ? parseInt(qtyInput.getAttribute('data-stock')) : null;
        
        const totalPriceElement = cartItem.querySelector('.total-price');

        // Hàm helper để xác định max (bao gồm cả trường hợp stock = 0)
        const getMax = () => {
            return (stock !== null) ? stock : (parseInt(qtyInput.getAttribute('max')) || 999999);
        };

        minusBtn.addEventListener('click', async function() {
            let currentValue = parseInt(qtyInput.value);
            const min = parseInt(qtyInput.getAttribute('min')) || 1;
            if (currentValue > min) {
                qtyInput.value = currentValue - 1;
                animateInput(qtyInput);
                await updateCartItemQuantity(productId, parseInt(qtyInput.value));
                updateItemTotal(parseInt(qtyInput.value), unitPrice, totalPriceElement);
                await updateCartSummaryOnly(); // Only update summary, don't reload items
            }
        });

        plusBtn.addEventListener('click', async function() {
            let currentValue = parseInt(qtyInput.value);
            const max = getMax(); // Dùng hàm helper
            
            if (currentValue >= max) { // Sửa: kiểm tra >=
                showToast(`Số lượng vượt quá tồn kho! Tồn kho hiện có: ${max}`, 'warning');
                qtyInput.value = max; // Đảm bảo giá trị không vượt quá
                return;
            }
            
            qtyInput.value = currentValue + 1;
            animateInput(qtyInput);
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
            const max = getMax(); // Dùng hàm helper
            let finalValue = parseInt(this.value) || min;

            // Validate and correct value
            if (finalValue < min) {
                finalValue = min;
            } else if (finalValue > max) { // Sửa: kiểm tra > max
                finalValue = max;
                showToast(`Số lượng vượt quá tồn kho! Tồn kho hiện có: ${max}`, 'warning');
            }
            this.value = finalValue; // Cập nhật giá trị input ngay lập tức
            
            // Only update cart if value is valid
            if (finalValue >= min && finalValue <= max) {
                const result = await updateCartItemQuantity(productId, finalValue);
                if (result && result.success) {
                    updateItemTotal(finalValue, unitPrice, totalPriceElement);
                    await updateCartSummaryOnly(); // Only update summary, don't reload items
                } else {
                    // Revert to previous value if update failed
                    const previousValue = this.getAttribute('data-previous-value') || min;
                    this.value = previousValue;
                    finalValue = parseInt(previousValue);
                    updateItemTotal(finalValue, unitPrice, totalPriceElement);
                    if (result && result.message) {
                        showToast(result.message, 'warning');
                    }
                }
            }
        });
        
        // Also validate on input event to prevent invalid values (real-time validation)
        qtyInput.addEventListener('input', function() {
            const min = parseInt(this.getAttribute('min')) || 1;
            const max = getMax(); // Dùng hàm helper
            let value = parseInt(this.value);
            
            // Handle empty input
            if (isNaN(value) || this.value === '') {
                return; // Allow empty input temporarily
            }
            
            if (value < min) {
                this.value = min;
                value = min;
            } else if (value > max) { // Sửa: kiểm tra > max
                this.value = max;
                value = max;
                showToast(`Số lượng vượt quá tồn kho! Tồn kho hiện có: ${max}`, 'warning');
            }
        });
        
        // Validate on blur to ensure final value is correct
        qtyInput.addEventListener('blur', function() {
            const min = parseInt(this.getAttribute('min')) || 1;
            const max = getMax(); // Dùng hàm helper
            let value = parseInt(this.value) || min;
            
            if (value < min) {
                this.value = min;
                value = min;
            } else if (value > max) { // Sửa: kiểm tra > max
                this.value = max;
                value = max;
                // Không cần toast ở đây vì 'change' event sẽ xử lý
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

// Validate and correct quantities that exceed stock
async function validateAndCorrectQuantities(cartItems) {
    let needsUpdate = false;
    
    for (const item of cartItems) {
        // Sửa: Kiểm tra stock rõ ràng
        const stock = (item.stock !== null && item.stock !== undefined) ? parseInt(item.stock) : null;
        
        if (stock !== null && item.quantity > stock) {
            // Find the input element for this item
            const qtyInput = document.querySelector(`.qty-input[data-product-id="${item.productId}"]`);
            if (qtyInput) {
                const cartItem = qtyInput.closest('.cart-item');
                const unitPrice = parseFloat(qtyInput.getAttribute('data-unit-price'));
                const totalPriceElement = cartItem.querySelector('.total-price');
                
                // Update quantity to stock limit
                qtyInput.value = stock;
                updateItemTotal(stock, unitPrice, totalPriceElement);
                
                // Update cart in backend
                await updateCartItemQuantity(item.productId, stock);
                needsUpdate = true;
                
                showToast(`Số lượng "${item.productName}" đã được điều chỉnh về ${stock} (tồn kho hiện có)`, 'warning');
            }
        }
    }
    
    if (needsUpdate) {
        await updateCartSummaryOnly();
    }
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

// Animate input when quantity changes
function animateInput(input) {
    input.style.transform = 'scale(1.2)';
    setTimeout(() => {
        input.style.transform = 'scale(1)';
    }, 200);
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


// Checkout button
document.getElementById('checkoutBtn')?.addEventListener('click', async function(e) {
    e.preventDefault();
    
    try {
        // Call checkout endpoint
        const response = await fetch('/cart/api/checkout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Update cart count
            updateCartCountInHeaderLocal(result.cartCount || 0);
            // Also update via shared function
            if (typeof updateCartCountInHeader === 'function') {
                updateCartCountInHeader();
            }
            
            // Show success message
            showToast(result.message || 'Đặt hàng thành công!', 'success');
            
            // Reload cart to show empty state
            await loadCartItems();
            
            // Redirect to home after a short delay
            setTimeout(() => {
                window.location.href = '/home';
            }, 1500);
        } else {
            // Show error message
            showToast(result.message || 'Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.', 'error');
            
            // If user is not logged in, redirect to login page
            if (result.message && result.message.includes('đăng nhập')) {
                setTimeout(() => {
                    window.location.href = '/login';
                }, 2000);
            }
        }
    } catch (error) {
        console.error('Error during checkout:', error);
        showToast('Có lỗi xảy ra khi xử lý đặt hàng. Vui lòng thử lại.', 'error');
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
