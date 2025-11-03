// Header scroll effect
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

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
        const productCard = this.closest('.product-card');
        const productName = productCard.querySelector('.product-name').textContent;
        const quantity = productCard.querySelector('.qty-input').value;
        
        // Animate button
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = '';
        }, 150);

        // Show toast notification
        showToast('Added to cart!');

        // Update cart count
        updateCartCount(parseInt(quantity));

        // Here you would typically send data to server
        // For now, we'll just show visual feedback
        console.log(`Added ${quantity} x ${productName} to cart`);
    });
});

// Toast notification
function showToast(message) {
    const toast = document.getElementById('toast');
    const toastSpan = toast.querySelector('span');
    toastSpan.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
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
        showToast('Subscribed successfully!');
        this.reset();
    }
});

// Quick view button (can be expanded with modal)
document.querySelectorAll('.quick-view-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.stopPropagation();
        // Here you would open a product modal
        console.log('Quick view clicked');
    });
});

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

