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

// Store default values for profile form fields
let defaultValues = {};

// Initialize default values when page loads
document.addEventListener('DOMContentLoaded', function() {
    const profileForm = document.querySelector('.profile-form');
    if (profileForm) {
        const inputs = profileForm.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"]');
        inputs.forEach(input => {
            // Store the default value
            defaultValues[input.id] = input.value;
            
            // Add blur event listener to restore default value if empty
            input.addEventListener('blur', function() {
                if (this.value.trim() === '') {
                    this.value = defaultValues[this.id] || '';
                }
            });
        });
    }
});

// Change password toggle button
document.getElementById('changePasswordBtn')?.addEventListener('click', function() {
    const passwordSection = document.getElementById('passwordChangeSection');
    if (passwordSection.style.display === 'none') {
        passwordSection.style.display = 'block';
        this.innerHTML = '<i class="fas fa-times"></i> <span>Hủy đổi mật khẩu</span>';
        this.classList.add('active');
    } else {
        passwordSection.style.display = 'none';
        this.innerHTML = '<i class="fas fa-key"></i> <span>Đổi mật khẩu</span>';
        this.classList.remove('active');
        // Clear password fields
        document.getElementById('oldPassword').value = '';
        document.getElementById('newPassword').value = '';
        document.getElementById('confirmPassword').value = '';
        // Clear error messages
        clearPasswordErrors();
    }
});

// Clear password error messages
function clearPasswordErrors() {
    document.getElementById('oldPasswordError').textContent = '';
    document.getElementById('newPasswordError').textContent = '';
    document.getElementById('confirmPasswordError').textContent = '';
}

// Validate password fields
function validatePasswordChange() {
    const passwordSection = document.getElementById('passwordChangeSection');
    if (passwordSection.style.display === 'none') {
        return true; // No password change requested
    }
    
    const oldPassword = document.getElementById('oldPassword').value.trim();
    const newPassword = document.getElementById('newPassword').value.trim();
    const confirmPassword = document.getElementById('confirmPassword').value.trim();
    
    let isValid = true;
    clearPasswordErrors();
    
    // Validate old password
    if (!oldPassword) {
        document.getElementById('oldPasswordError').textContent = 'Vui lòng nhập mật khẩu cũ';
        isValid = false;
    }
    
    // Validate new password
    if (!newPassword) {
        document.getElementById('newPasswordError').textContent = 'Vui lòng nhập mật khẩu mới';
        isValid = false;
    } else if (newPassword.length < 6) {
        document.getElementById('newPasswordError').textContent = 'Mật khẩu phải có ít nhất 6 ký tự';
        isValid = false;
    }
    
    // Validate confirm password
    if (!confirmPassword) {
        document.getElementById('confirmPasswordError').textContent = 'Vui lòng xác nhận mật khẩu mới';
        isValid = false;
    } else if (confirmPassword !== newPassword) {
        document.getElementById('confirmPasswordError').textContent = 'Mật khẩu xác nhận không khớp';
        isValid = false;
    }
    
    return isValid;
}

// Profile form submission
document.querySelector('.profile-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Validate password change if section is visible
    const passwordSection = document.getElementById('passwordChangeSection');
    const isPasswordChangeVisible = passwordSection && passwordSection.style.display !== 'none';
    
    if (isPasswordChangeVisible) {
        if (!validatePasswordChange()) {
            return false;
        }
        
        // Submit password change via form submission
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = '/account/change-password';
        
        const oldPasswordInput = document.createElement('input');
        oldPasswordInput.type = 'hidden';
        oldPasswordInput.name = 'oldPassword';
        oldPasswordInput.value = document.getElementById('oldPassword').value;
        form.appendChild(oldPasswordInput);
        
        const newPasswordInput = document.createElement('input');
        newPasswordInput.type = 'hidden';
        newPasswordInput.name = 'newPassword';
        newPasswordInput.value = document.getElementById('newPassword').value;
        form.appendChild(newPasswordInput);
        
        const confirmPasswordInput = document.createElement('input');
        confirmPasswordInput.type = 'hidden';
        confirmPasswordInput.name = 'confirmPassword';
        confirmPasswordInput.value = document.getElementById('confirmPassword').value;
        form.appendChild(confirmPasswordInput);
        
        document.body.appendChild(form);
        form.submit();
        return false;
    }
    
    // Show success animation for regular profile update
    const saveBtn = this.querySelector('.save-btn');
    const originalText = saveBtn.innerHTML;
    
    saveBtn.innerHTML = '<i class="fas fa-check"></i> Đã lưu!';
    saveBtn.style.backgroundColor = '#4a5a44';
    
    setTimeout(() => {
        saveBtn.innerHTML = originalText;
        saveBtn.style.backgroundColor = '';
    }, 2000);
    
    // Here you would typically send profile data to server
    console.log('Profile updated');
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

