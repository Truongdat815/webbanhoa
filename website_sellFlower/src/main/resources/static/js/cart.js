// Helper function to format price
function formatPrice(price) {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return '$' + numPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Helper function to format price from Vietnamese format
function formatPriceFromVND(vndPrice) {
    // Convert VND to USD (example: 420000 VND = ~18 USD)
    const usdPrice = parseFloat(vndPrice) / 23000;
    return formatPrice(usdPrice);
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
    
    // Convert price to USD for display (assuming 1 USD = 23000 VND)
    const usdPrice = parseFloat(item.price) / 23000;
    const totalPrice = usdPrice * item.quantity;
    
    cartItem.innerHTML = `
        <button class="remove-item-btn" data-product-id="${item.productId}">
            <i class="fas fa-times"></i>
        </button>
        <div class="item-image">
            <img src="${item.imageUrl || 'https://via.placeholder.com/120x120?text=Product'}" alt="${item.productName}">
        </div>
        <div class="item-details">
            <h3 class="item-name">${item.productName}</h3>
            <p class="item-price">${formatPrice(usdPrice)}</p>
        </div>
        <div class="item-quantity">
            <button class="qty-btn minus-btn" data-product-id="${item.productId}">-</button>
            <input type="number" value="${item.quantity}" min="1" class="qty-input" data-product-id="${item.productId}" data-unit-price="${usdPrice}">
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
            qtyInput.value = currentValue + 1;
            await updateCartItemQuantity(productId, parseInt(qtyInput.value));
            updateItemTotal(parseInt(qtyInput.value), unitPrice, totalPriceElement);
            await updateCartSummaryOnly(); // Only update summary, don't reload items
        });

        qtyInput.addEventListener('change', async function() {
            if (this.value < 1) {
                this.value = 1;
            }
            await updateCartItemQuantity(productId, parseInt(this.value));
            updateItemTotal(parseInt(this.value), unitPrice, totalPriceElement);
            await updateCartSummaryOnly(); // Only update summary, don't reload items
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
        }
    } catch (error) {
        console.error('Error updating cart item:', error);
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
    const total = (quantity * price).toFixed(2);
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
        const usdPrice = parseFloat(item.price) / 23000;
        subtotal += usdPrice * item.quantity;
    });
    
    const shipping = 15.00;
    const vat = 0.00;
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
    alert('Cart updated successfully!');
});

// Apply coupon button
document.getElementById('applyCouponBtn')?.addEventListener('click', function() {
    const couponCode = document.getElementById('couponCode').value;
    if (couponCode.trim() === '') {
        alert('Please enter a coupon code');
        return;
    }
    // TODO: Implement coupon validation
    alert('Coupon code applied! (Feature coming soon)');
});

// Checkout button
document.getElementById('checkoutBtn')?.addEventListener('click', async function(e) {
    e.preventDefault();
    
    try {
        const response = await fetch('/cart/api');
        const cartItems = await response.json();
        
        if (!cartItems || cartItems.length === 0) {
            alert('Your cart is empty!');
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
            alert('Order placed successfully! Cart cleared.');
            window.location.href = '/home';
        } else {
            alert('Error processing checkout. Please try again.');
        }
    } catch (error) {
        console.error('Error during checkout:', error);
        alert('Error processing checkout. Please try again.');
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
        alert('Subscribed successfully!');
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
