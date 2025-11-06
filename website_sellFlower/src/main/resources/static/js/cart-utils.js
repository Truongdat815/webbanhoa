// Shared cart utility functions
// This file should be included on all pages to maintain cart count consistency

// Update cart count in header
async function updateCartCountInHeader() {
    try {
        const response = await fetch('/cart/api/count');
        if (!response.ok) return;
        
        const result = await response.json();
        const cartCountElements = document.querySelectorAll('.cart-count, #cartCount');
        cartCountElements.forEach(element => {
            element.textContent = result.count || 0;
            // Animate update
            element.style.transform = 'scale(1.3)';
            setTimeout(() => {
                element.style.transform = 'scale(1)';
            }, 200);
        });
    } catch (error) {
        console.error('Error updating cart count:', error);
    }
}

// Add item to cart
async function addToCart(productId, productName, price, quantity, imageUrl) {
    try {
        const response = await fetch('/cart/api/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `productId=${productId}&productName=${encodeURIComponent(productName)}&price=${price}&quantity=${quantity}&imageUrl=${encodeURIComponent(imageUrl)}`
        });
        
        if (!response.ok) throw new Error('Failed to add to cart');
        
        const result = await response.json();
        if (result.success) {
            // Update cart count in header
            updateCartCountInHeader();
            return { success: true, message: result.message, cartCount: result.cartCount };
        } else {
            return { success: false, message: result.message };
        }
    } catch (error) {
        console.error('Error adding to cart:', error);
        return { success: false, message: 'Có lỗi xảy ra khi thêm vào giỏ hàng' };
    }
}

// Load cart count on page load
document.addEventListener('DOMContentLoaded', function() {
    updateCartCountInHeader();
});

