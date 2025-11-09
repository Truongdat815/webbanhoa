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
        const currentScroll = window.scrollY || window.pageYOffset;
        showSection(sectionId);
        requestAnimationFrame(() => {
            window.scrollTo(0, currentScroll);
        });
    });
});

// Function to show a specific section
function showSection(sectionId) {
    document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
    document.querySelectorAll('.content-section').forEach(section => section.classList.remove('active'));

    const navItem = document.querySelector(`.nav-item[data-section="${sectionId}"]`);
    const section = document.getElementById(sectionId);

    if (navItem) {
        navItem.classList.add('active');
    }
    if (section) {
        section.classList.add('active');
    }
}

// Handle hash in URL on page load
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.hash) {
        const hash = window.location.hash.substring(1);
        showSection(hash);
        window.scrollTo(0, 0);
    }
});

// Store default values for profile form fields
let defaultValues = {};

// Initialize default values when page loads
document.addEventListener('DOMContentLoaded', function() {
    const profileForm = document.querySelector('.profile-form');
    if (profileForm) {
        const inputs = profileForm.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"]');
        inputs.forEach(input => {
            defaultValues[input.id] = input.value;

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
        document.getElementById('oldPassword').value = '';
        document.getElementById('newPassword').value = '';
        document.getElementById('confirmPassword').value = '';
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
        return true;
    }

    const oldPassword = document.getElementById('oldPassword').value.trim();
    const newPassword = document.getElementById('newPassword').value.trim();
    const confirmPassword = document.getElementById('confirmPassword').value.trim();

    let isValid = true;
    clearPasswordErrors();

    if (!oldPassword) {
        document.getElementById('oldPasswordError').textContent = 'Vui lòng nhập mật khẩu cũ';
        isValid = false;
    }

    if (!newPassword) {
        document.getElementById('newPasswordError').textContent = 'Vui lòng nhập mật khẩu mới';
        isValid = false;
    } else if (newPassword.length < 6) {
        document.getElementById('newPasswordError').textContent = 'Mật khẩu phải có ít nhất 6 ký tự';
        isValid = false;
    }

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

    const passwordSection = document.getElementById('passwordChangeSection');
    const isPasswordChangeVisible = passwordSection && passwordSection.style.display !== 'none';

    if (isPasswordChangeVisible) {
        if (!validatePasswordChange()) {
            return false;
        }

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

    const saveBtn = this.querySelector('.save-btn');
    const originalText = saveBtn.innerHTML;

    saveBtn.innerHTML = '<i class="fas fa-check"></i> Đã lưu!';
    saveBtn.style.backgroundColor = '#4a5a44';

    setTimeout(() => {
        saveBtn.innerHTML = originalText;
        saveBtn.style.backgroundColor = '';
    }, 2000);

    console.log('Profile updated');
});

// Add address card
document.querySelector('.add-address')?.addEventListener('click', function() {
    alert('Open add address form');
});

// Edit/Delete address buttons
document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.stopPropagation();
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

// NOTE: Account data is now loaded server-side via Thymeleaf
// This function is no longer needed but kept for reference
function loadAccountData() {
    // Account data is now rendered server-side, so we don't need to fetch it
}

// ← THÊM MỚI: Hiển thị thông tin tài khoản
function displayAccountInfo(account) {
    // Update sidebar
    const userName = document.querySelector('.user-name');
    const userEmail = document.querySelector('.user-email');
    if (userName) userName.textContent = account.fullName || account.username;
    if (userEmail) userEmail.textContent = account.email;

    // Update profile form
    const firstNameInput = document.getElementById('firstName');
    const lastNameInput = document.getElementById('lastName');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');

    if (account.fullName) {
        const nameParts = account.fullName.split(' ');
        if (firstNameInput && nameParts.length > 0) {
            firstNameInput.value = nameParts.slice(0, -1).join(' ');
        }
        if (lastNameInput && nameParts.length > 0) {
            lastNameInput.value = nameParts[nameParts.length - 1];
        }
    }
    if (emailInput) emailInput.value = account.email || '';
    if (phoneInput) phoneInput.value = account.phone || '';
}

// ← THÊM MỚI: Hiển thị thống kê
function displayStats(stats) {
    const overviewCards = document.querySelectorAll('.overview-card');
    overviewCards.forEach(card => {
        const icon = card.querySelector('.card-icon');
        const valueEl = card.querySelector('.card-value');

        if (!icon || !valueEl) return;

        if (icon.classList.contains('orders')) {
            valueEl.textContent = stats.totalOrders || 0;
        } else if (icon.classList.contains('spending')) {
            valueEl.textContent = formatPrice(stats.totalSpending || 0);
        } else if (icon.classList.contains('points')) {
            valueEl.textContent = stats.rewardPoints || 0;
        }
    });
}

// ← THÊM MỚI: Hiển thị danh sách đơn hàng
function displayOrders(orders) {
    const tbody = document.getElementById('ordersTableBody');
    if (!tbody) return;

    if (orders.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="no-orders">Bạn chưa có đơn hàng nào</td></tr>';
        return;
    }

    tbody.innerHTML = orders.map(order => `
        <tr>
            <td>#ORD-${order.id.toString().padStart(4, '0')}</td>
            <td>${new Date(order.orderDate).toLocaleDateString('vi-VN')}</td>
            <td>
                <span class="order-status-badge ${getStatusClass(order.status)}">${getStatusText(order.status)}</span>
            </td>
            <td>${formatPrice(order.totalAmount)}</td>
            <td>
                <a href="/order/${order.id}" class="view-order-link">Xem</a>
            </td>
        </tr>
    `).join('');

    updateRecentOrders(orders.slice(0, 5));
}

// ← THÊM MỚI: Update recent orders in overview
function updateRecentOrders(recentOrders) {
    const ordersList = document.querySelector('.orders-list');
    if (!ordersList || recentOrders.length === 0) return;

    ordersList.innerHTML = recentOrders.map(order => `
        <div class="order-item">
            <div class="order-info">
                <span class="order-id">#ORD-${order.id.toString().padStart(4, '0')}</span>
                <span class="order-date">${new Date(order.orderDate).toLocaleDateString('vi-VN')}</span>
            </div>
            <div class="order-status ${getStatusClass(order.status)}">${getStatusText(order.status)}</div>
            <div class="order-total">${formatPrice(order.totalAmount)}</div>
        </div>
    `).join('');
}

// ← THÊM MỚI: Helper functions
function getStatusClass(status) {
    const statusMap = {
        'pending_payment': 'pending',
        'paid': 'approved',
        'processing': 'processing',
        'shipped': 'on-hold',
        'delivered': 'completed',
        'cancelled': 'cancelled'
    };
    return statusMap[status] || 'pending';
}

function getStatusText(status) {
    const statusMap = {
        'pending_payment': 'Chờ thanh toán',
        'paid': 'Đã thanh toán',
        'processing': 'Đang xử lý',
        'shipped': 'Đã gửi hàng',
        'delivered': 'Hoàn thành',
        'cancelled': 'Đã hủy'
    };
    return statusMap[status] || 'Không xác định';
}

function formatPrice(price) {
    return '₫' + parseFloat(price).toLocaleString('vi-VN');
}

// Animate overview cards on load
// Account data is now loaded server-side via Thymeleaf
document.addEventListener('DOMContentLoaded', function() {
    // Animate cards
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