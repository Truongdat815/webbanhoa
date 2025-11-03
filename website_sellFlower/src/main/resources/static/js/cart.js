// Header scroll effect
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Quantity selector for cart items
document.querySelectorAll('.item-quantity').forEach(quantitySelector => {
    const minusBtn = quantitySelector.querySelector('.minus-btn');
    const plusBtn = quantitySelector.querySelector('.plus-btn');
    const qtyInput = quantitySelector.querySelector('.qty-input');
    const cartItem = quantitySelector.closest('.cart-item');
    const itemPrice = parseFloat(cartItem.querySelector('.item-price').textContent.replace('$', ''));
    const totalPriceElement = cartItem.querySelector('.total-price');

    minusBtn.addEventListener('click', function() {
        let currentValue = parseInt(qtyInput.value);
        if (currentValue > 1) {
            qtyInput.value = currentValue - 1;
            updateItemTotal(qtyInput.value, itemPrice, totalPriceElement);
            updateCartSummary();
            animateInput(qtyInput);
        }
    });

    plusBtn.addEventListener('click', function() {
        let currentValue = parseInt(qtyInput.value);
        qtyInput.value = currentValue + 1;
        updateItemTotal(qtyInput.value, itemPrice, totalPriceElement);
        updateCartSummary();
        animateInput(qtyInput);
    });

    qtyInput.addEventListener('change', function() {
        if (this.value < 1) {
            this.value = 1;
        }
        updateItemTotal(this.value, itemPrice, totalPriceElement);
        updateCartSummary();
    });
});

function updateItemTotal(quantity, price, totalElement) {
    const total = (quantity * price).toFixed(2);
    totalElement.textContent = '$' + total;
    
    // Animate update
    totalElement.style.transform = 'scale(1.2)';
    totalElement.style.color = '#5a6b54';
    setTimeout(() => {
        totalElement.style.transform = 'scale(1)';
        totalElement.style.color = '#2c2c2c';
    }, 300);
}

function animateInput(input) {
    input.style.transform = 'scale(1.2)';
    setTimeout(() => {
        input.style.transform = 'scale(1)';
    }, 200);
}

// Remove item functionality
document.querySelectorAll('.remove-item-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const cartItem = this.closest('.cart-item');
        cartItem.style.animation = 'slideOut 0.5s ease-out';
        setTimeout(() => {
            cartItem.remove();
            updateCartSummary();
            checkCartEmpty();
        }, 500);
    });
});

// Update cart summary
function updateCartSummary() {
    const cartItems = document.querySelectorAll('.cart-item');
    let subtotal = 0;

    cartItems.forEach(item => {
        const quantity = parseInt(item.querySelector('.qty-input').value);
        const price = parseFloat(item.querySelector('.item-price').textContent.replace('$', ''));
        subtotal += quantity * price;
    });

    document.querySelector('.subtotal').textContent = '$' + subtotal.toFixed(2);
    document.querySelector('.total').textContent = '$' + subtotal.toFixed(2);

    // Animate summary update
    const summary = document.querySelector('.cart-summary');
    summary.style.transform = 'scale(1.02)';
    setTimeout(() => {
        summary.style.transform = 'scale(1)';
    }, 200);
}

// Check if cart is empty
function checkCartEmpty() {
    const cartItems = document.querySelectorAll('.cart-item');
    const emptyCart = document.getElementById('emptyCart');
    const cartWithItems = document.getElementById('cartWithItems');

    if (cartItems.length === 0) {
        cartWithItems.style.display = 'none';
        emptyCart.style.display = 'block';
        emptyCart.style.animation = 'fadeIn 0.8s ease-out';
    } else {
        emptyCart.style.display = 'none';
        cartWithItems.style.display = 'grid';
    }
}

// Checkout button
document.querySelector('.checkout-btn')?.addEventListener('click', function(e) {
    e.preventDefault();
    // Here you would redirect to checkout page
    console.log('Proceeding to checkout...');
    // window.location.href = '/checkout';
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

// Initialize cart state (check if items exist on page load)
document.addEventListener('DOMContentLoaded', function() {
    checkCartEmpty();
    updateCartSummary();
});

