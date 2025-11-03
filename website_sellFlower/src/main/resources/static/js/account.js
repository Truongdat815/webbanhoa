// Header scroll effect
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Navigation between sections
document.querySelectorAll('.nav-item[data-section]').forEach(item => {
    item.addEventListener('click', function(e) {
        e.preventDefault();
        const sectionId = this.getAttribute('data-section');
        
        // Remove active class from all nav items and sections
        document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
        document.querySelectorAll('.content-section').forEach(section => section.classList.remove('active'));
        
        // Add active class to clicked nav item and corresponding section
        this.classList.add('active');
        document.getElementById(sectionId).classList.add('active');
    });
});

// Profile form submission
document.querySelector('.profile-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Show success animation
    const saveBtn = this.querySelector('.save-btn');
    const originalText = saveBtn.innerHTML;
    
    saveBtn.innerHTML = '<i class="fas fa-check"></i> Saved!';
    saveBtn.style.backgroundColor = '#4a5a44';
    
    setTimeout(() => {
        saveBtn.innerHTML = originalText;
        saveBtn.style.backgroundColor = '';
    }, 2000);
    
    // Here you would typically send data to server
    console.log('Profile updated');
});

// Toggle switches animation
document.querySelectorAll('.toggle-switch input').forEach(toggle => {
    toggle.addEventListener('change', function() {
        const settingItem = this.closest('.setting-item');
        settingItem.style.transform = 'scale(1.02)';
        setTimeout(() => {
            settingItem.style.transform = 'scale(1)';
        }, 200);
    });
});

// Change password button
document.querySelector('.change-password-btn')?.addEventListener('click', function() {
    // Here you would typically open a modal or redirect to change password page
    alert('Redirect to change password page');
});

// Add address card
document.querySelector('.add-address')?.addEventListener('click', function() {
    // Here you would typically open a form modal
    alert('Open add address form');
});

// Edit/Delete address buttons
document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.stopPropagation();
        const addressCard = this.closest('.address-card');
        // Here you would typically open an edit form
        console.log('Edit address');
    });
});

document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.stopPropagation();
        if (confirm('Are you sure you want to delete this address?')) {
            const addressCard = this.closest('.address-card');
            addressCard.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => {
                addressCard.remove();
            }, 300);
        }
    });
});

// View details button
document.querySelectorAll('.view-details-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        // Here you would typically show order details
        console.log('View order details');
    });
});

// Newsletter form
document.querySelector('.newsletter-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const email = this.querySelector('input[type="email"]').value;
    
    if (email) {
        const btn = this.querySelector('.subscribe-btn');
        const originalText = btn.innerHTML;
        
        btn.innerHTML = '<i class="fas fa-check"></i> Subscribed!';
        btn.style.backgroundColor = '#4a5a44';
        
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.backgroundColor = '';
            this.reset();
        }, 2000);
    }
});

// Animate overview cards on load
document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.overview-card');
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.5s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 50);
        }, index * 100);
    });
});

// Add CSS for fadeOut animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        from {
            opacity: 1;
            transform: scale(1);
        }
        to {
            opacity: 0;
            transform: scale(0.8);
        }
    }
`;
document.head.appendChild(style);

