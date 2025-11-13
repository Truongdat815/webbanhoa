// ==================== ADMIN JS ====================

// Toast Notification
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    if (!toast) return;

    toast.textContent = message;
    toast.className = `toast ${type} show`;

    // Add icon
    const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : '⚠';
    toast.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'times-circle' : 'exclamation-circle'}"></i> <span>${message}</span>`;

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ==================== PRODUCT MANAGEMENT ====================

document.addEventListener('DOMContentLoaded', function() {
    // Delete Product/Account/Order Confirmation
    document.addEventListener('click', async function(e) {
        const deleteButton = e.target.closest('.btn-delete[data-id]');
        if (!deleteButton) {
            return;
        }

        e.preventDefault();
        e.stopPropagation();

        const itemId = deleteButton.getAttribute('data-id');
        const itemName = deleteButton.getAttribute('data-name') || '';

        const onAccountsPage = window.location.pathname.includes('/accounts');
        const onOrdersPage = window.location.pathname.includes('/orders');

        // Skip delete for accounts page
        if (onAccountsPage) {
            return;
        }

        let deleteType = 'product';
        let confirmMessage = `Bạn có chắc chắn muốn xóa sản phẩm "${itemName}"?`;

        if (onOrdersPage) {
            deleteType = 'order';
            confirmMessage = `Bạn có chắc chắn muốn xóa ${itemName}?`;
        }

        const confirmed = window.confirm(confirmMessage);
        if (!confirmed) {
            return;
        }

        try {
            // if (deleteType === 'order') {
            //     await deleteOrder(itemId);
            // } else {
            //     await deleteProduct(itemId);
            // }
            await deleteProduct(itemId);
        } catch (error) {
            console.error('Error deleting item:', error);
            showToast('Có lỗi xảy ra khi xóa: ' + error.message, 'error');
        }
    });

    // Product Form
    const productForm = document.getElementById('productForm');
    if (productForm) {
        productForm.addEventListener('submit', handleProductSubmit);

        // Image preview
        const imageUrlInput = document.getElementById('imageUrl');
        const imagePreview = document.getElementById('imagePreview');
        const previewImage = document.getElementById('previewImage');

        if (imageUrlInput && imagePreview && previewImage) {
            imageUrlInput.addEventListener('input', function() {
                if (this.value) {
                    previewImage.src = this.value;
                    imagePreview.style.display = 'block';
                } else {
                    imagePreview.style.display = 'none';
                }
            });
        }
    }

    // Account Form
    const accountForm = document.getElementById('accountForm');
    if (accountForm) {
        accountForm.addEventListener('submit', handleAccountSubmit);
    }

    // Order Status Update
    // const statusSelects = document.querySelectorAll('.status-select[data-id]');
    // statusSelects.forEach(select => {
    //     select.addEventListener('change', function() {
    //         const orderId = this.getAttribute('data-id');
    //         const newStatus = this.value;
    //         updateOrderStatus(orderId, newStatus);
    //     });
    // });
    const updateStatusButtons = document.querySelectorAll('.btn-update-status[data-id]');
    updateStatusButtons.forEach(button => {
        button.addEventListener('click', function() {
            const orderId = this.getAttribute('data-id');
            const status = this.getAttribute('data-status');
            updateOrderStatus(orderId, status);
        });
    });
    const rejectOrderButtons = document.querySelectorAll('#ordersTableBody .btn-delete[data-id]');
    rejectOrderButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            rejectOrder(e.target.getAttribute('data-id'));
        });
    });

    // Search and Filter
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }

    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', handleSearch);
    }

    const statusFilter = document.getElementById('statusFilter');
    if (statusFilter) {
        statusFilter.addEventListener('change', handleSearch);
    }

    const roleFilter = document.getElementById('roleFilter');
    if (roleFilter) {
        roleFilter.addEventListener('change', handleSearch);
    }

    // Account Status Toggle (only on accounts page)
    if (window.location.pathname.includes('/accounts')) {
        // Build a set of ADMIN account IDs for quick lookup
        const adminAccountIds = new Set();
        const adminStatusBadges = document.querySelectorAll('.admin-status[data-role="ADMIN"]');
        adminStatusBadges.forEach(badge => {
            const accountId = badge.getAttribute('data-account-id');
            if (accountId) {
                adminAccountIds.add(accountId);
            }
        });
        const adminBadges = document.querySelectorAll('.badge-admin[data-role="ADMIN"]');
        adminBadges.forEach(badge => {
            const accountId = badge.getAttribute('data-account-id');
            if (accountId) {
                adminAccountIds.add(accountId);
            }
        });

        // Ensure ADMIN accounts are always active before initializing
        ensureAdminAccountsAlwaysActive();
        initializeAccountStatus();
        setupStatusToggleListeners();

        // Monitor for any changes to localStorage that might affect ADMIN status
        // This is a safety measure to catch any programmatic changes
        if (adminAccountIds.size > 0) {
            const originalSetItem = localStorage.setItem;
            localStorage.setItem = function(key, value) {
                // If someone tries to set a status for an ADMIN account, override it
                if (key && key.startsWith('account_status_')) {
                    const accountId = key.replace('account_status_', '');
                    if (adminAccountIds.has(accountId)) {
                        // This is an ADMIN account, force status to 'active'
                        value = 'active';
                        console.warn(`Attempted to change ADMIN account (ID: ${accountId}) status. Status forced to "active".`);
                    }
                }
                originalSetItem.apply(this, [key, value]);
            };
        }
    }
});

// Delete Product Function
async function deleteProduct(productId) {
    try {
        console.log('Deleting product:', productId);
        const response = await fetch(`/admin/api/products/${productId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }

        const data = await response.json();
        console.log('Delete product response:', data);

        if (data.success) {
            showToast(data.message || 'Xóa sản phẩm thành công', 'success');
            setTimeout(() => {
                window.location.reload();
            }, 500);
            // Remove row from table - find button first, then get parent row
            const deleteButton = document.querySelector(`.btn-delete[data-id="${productId}"]`);
            // if (deleteButton) {
            //     // Support both table row and grid card
            //     const row = deleteButton.closest('tr');
            //     const card = deleteButton.closest('.product-card-admin');
            //     const target = row || card;
            //     if (target) {
            //         target.style.animation = 'fadeOut 0.3s ease-out';
            //         setTimeout(() => {
            //             target.remove();
            //             // Check if list is empty
            //             const container = document.querySelector('#productsTableBody');
            //             if (container) {
            //                 const remainingRows = container.querySelectorAll('tr, .product-card-admin');
            //                 checkEmptyState(remainingRows.length);
            //             }
            //         }, 300);
            //     } else {
            //         console.error('Product element not found for:', productId);
            //         setTimeout(() => window.location.reload(), 1000);
            //     }
            // } else {
            //     console.error('Delete button not found for product:', productId);
            //     // Reload page to refresh
            //     setTimeout(() => window.location.reload(), 1000);
            // }
        } else {
            showToast(data.message || 'Có lỗi xảy ra khi xóa sản phẩm', 'error');
        }
    } catch (error) {
        console.error('Error deleting product:', error);
        showToast('Có lỗi xảy ra khi xóa sản phẩm: ' + error.message, 'error');
    }
}

// Delete Account Function
async function deleteAccount(accountId) {
    try {
        const response = await fetch(`/admin/api/accounts/${accountId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
            showToast(data.message || 'Xóa tài khoản thành công', 'success');
            // Remove row from table - find button first, then get parent row
            const deleteButton = document.querySelector(`.btn-delete[data-id="${accountId}"]`);
            if (deleteButton) {
                const row = deleteButton.closest('tr');
                if (row) {
                    row.style.animation = 'fadeOut 0.3s ease-out';
                    setTimeout(() => {
                        row.remove();
                        // Check if table is empty
                        const accountsTable = document.querySelector('#accountsTableBody');
                        if (accountsTable) {
                            const remainingRows = accountsTable.querySelectorAll('tr');
                            checkEmptyState(remainingRows.length);
                        }
                    }, 300);
                }
            }
        } else {
            showToast(data.message || 'Có lỗi xảy ra khi xóa tài khoản', 'error');
        }
    } catch (error) {
        console.error('Error deleting account:', error);
        showToast('Có lỗi xảy ra khi xóa tài khoản: ' + error.message, 'error');
    }
}

// Delete Order Function
async function rejectOrder(orderId) {
    try {
        const response = await fetch(`/admin/api/orders/${orderId}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            }
            ,            body: JSON.stringify({ status: 'REJECTED' })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }

        const data = await response.json();
        console.log('Delete order response:', data);

        if (data.success) {
            showToast(data.message || 'Từ chối đơn hàng thành công', 'success');
            // Remove row from table
            const deleteButton = document.querySelector(`.btn-delete[data-id="${orderId}"]`);
            if (deleteButton) {
                const row = deleteButton.closest('tr');
                if (row) {
                    row.style.animation = 'fadeOut 0.3s ease-out';
                    setTimeout(() => {
                        row.remove();
                        // Check if table is empty
                        const ordersTable = document.querySelector('#ordersTableBody');
                        if (ordersTable) {
                            const remainingRows = ordersTable.querySelectorAll('tr');
                            checkEmptyState(remainingRows.length);
                        }
                    }, 300);
                } else {
                    console.error('Row not found for order:', orderId);
                    // Reload page to refresh
                    setTimeout(() => window.location.reload(), 500);
                }
            } else {
                console.error('Delete button not found for order:', orderId);
                // Reload page to refresh
                setTimeout(() => window.location.reload(), 500);
            }
        } else {
            showToast(data.message || 'Có lỗi xảy ra khi xóa đơn hàng', 'error');
        }
    } catch (error) {
        console.error('Error deleting order:', error);
        showToast('Có lỗi xảy ra khi xóa đơn hàng: ' + error.message, 'error');
    }
}

// Handle Product Form Submit
async function handleProductSubmit(e) {
    e.preventDefault();

    const productId = document.getElementById('productId')?.value;
    const formData = {
        name: document.getElementById('name').value,
        description: document.getElementById('description').value,
        price: parseFloat(document.getElementById('price').value),
        stockQuantity: parseInt(document.getElementById('stockQuantity').value),
        imageUrl: document.getElementById('imageUrl').value,
        // category: document.getElementById('category').value
    };

    // Validation
    if (!formData.name || !formData.price || !formData.stockQuantity || !formData.imageUrl ) {
        showToast('Vui lòng điền đầy đủ thông tin bắt buộc', 'error');
        return;
    }

    try {
        const url = productId ? `/admin/api/products/${productId}` : '/admin/api/products';
        const method = productId ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (data.success) {
            showToast(data.message || (productId ? 'Cập nhật sản phẩm thành công' : 'Tạo sản phẩm thành công'), 'success');
            setTimeout(() => {
                window.location.href = '/admin/products';
            }, 1500);
        } else {
            showToast(data.message || 'Có lỗi xảy ra', 'error');
        }
    } catch (error) {
        console.error('Error saving product:', error);
        showToast('Có lỗi xảy ra khi lưu sản phẩm', 'error');
    }
}

// Handle Account Form Submit
async function handleAccountSubmit(e) {
    e.preventDefault();

    const accountId = document.getElementById('accountId')?.value;
    const formData = {
        username: document.getElementById('username').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        fullName: document.getElementById('fullName').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value,
        role: document.getElementById('role').value
    };

    // Validation
    if (!formData.username || !formData.email) {
        showToast('Vui lòng điền đầy đủ thông tin bắt buộc (Username và Email)', 'error');
        return;
    }

    // Password is required only for new accounts
    if (!accountId && !formData.password) {
        showToast('Vui lòng nhập mật khẩu cho tài khoản mới', 'error');
        return;
    }

    // Remove password from formData if it's empty (for update)
    if (accountId && !formData.password) {
        delete formData.password;
    }

    try {
        const url = accountId ? `/admin/api/accounts/${accountId}` : '/admin/api/accounts';
        const method = accountId ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (data.success) {
            showToast(data.message || (accountId ? 'Cập nhật tài khoản thành công' : 'Tạo tài khoản thành công'), 'success');
            setTimeout(() => {
                window.location.href = '/admin/accounts';
            }, 1500);
        } else {
            showToast(data.message || 'Có lỗi xảy ra', 'error');
        }
    } catch (error) {
        console.error('Error saving account:', error);
        showToast('Có lỗi xảy ra khi lưu tài khoản', 'error');
    }
}

// Update Order Status
async function updateOrderStatus(orderId, status) {
    try {
        const response = await fetch(`/admin/api/orders/${orderId}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: status })
        });

        const data = await response.json();

        if (data.success) {
            showToast(data.message || 'Cập nhật trạng thái đơn hàng thành công', 'success');
            setTimeout(() => {
                window.location.reload();
            }, 500);
        } else {
            showToast(data.message || 'Có lỗi xảy ra khi cập nhật trạng thái', 'error');
            setTimeout(() => {
                window.location.reload();
            }, 500);
            // Revert select value
            const select = document.querySelector(`.status-select[data-id="${orderId}"]`);
            if (select) {
                // You might want to store the old value before changing
            }
        }
    } catch (error) {
        console.error('Error updating order status:', error);
        showToast('Có lỗi xảy ra khi cập nhật trạng thái đơn hàng', 'error');
    }
}

// Handle Search and Filter
function handleSearch() {
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
    const categoryFilter = document.getElementById('categoryFilter')?.value || '';
    const statusFilter = document.getElementById('statusFilter')?.value || '';
    const roleFilter = document.getElementById('roleFilter')?.value || '';

    // Products table
    const productsContainer = document.querySelector('#productsTableBody');
    if (productsContainer) {
        const rows = productsContainer.querySelectorAll('tr');
        const cards = productsContainer.querySelectorAll('.product-card-admin');
        let visibleCount = 0;

        if (rows.length > 0) {
            rows.forEach(row => {
                const name = row.querySelector('td:nth-child(3)')?.textContent.toLowerCase() || '';
                const category = row.querySelector('td:nth-child(6)')?.textContent || '';
                const matchesSearch = name.includes(searchTerm);
                const matchesCategory = !categoryFilter || category === categoryFilter;

                if (matchesSearch && matchesCategory) {
                    row.style.display = '';
                    visibleCount++;
                } else {
                    row.style.display = 'none';
                }
            });
        }

        if (cards.length > 0) {
            cards.forEach(card => {
                const name = card.getAttribute('data-name') || '';
                const category = card.getAttribute('data-category') || '';
                const matchesSearch = name.includes(searchTerm);
                const matchesCategory = !categoryFilter || category === categoryFilter;

                if (matchesSearch && matchesCategory) {
                    card.style.display = '';
                    visibleCount++;
                } else {
                    card.style.display = 'none';
                }
            });
        }

        checkEmptyState(visibleCount);
    }

    // Orders table
    const ordersTable = document.querySelector('#ordersTableBody');
    if (ordersTable) {
        const rows = ordersTable.querySelectorAll('tr');
        let visibleCount = 0;

        rows.forEach(row => {
            const customer = row.querySelector('td:nth-child(2)')?.textContent.toLowerCase() || '';
            const status = row.querySelector('.status-select').getAttribute('value') || '';
            const matchesSearch = customer.includes(searchTerm);
            const matchesStatus = !statusFilter || status === statusFilter;

            if (matchesSearch && matchesStatus) {
                row.style.display = '';
                visibleCount++;
            } else {
                row.style.display = 'none';
            }
        });

        checkEmptyState(visibleCount);
    }

    // Accounts table
    const accountsTable = document.querySelector('#accountsTableBody');
    if (accountsTable) {
        const rows = Array.from(accountsTable.querySelectorAll('tr')).filter(row => {
            // Skip empty state row (has colspan)
            return !row.querySelector('td[colspan]');
        });
        let visibleCount = 0;

        rows.forEach(row => {
            const username = row.querySelector('td:nth-child(2)')?.textContent.toLowerCase().trim() || '';
            const email = row.querySelector('td:nth-child(3)')?.textContent.toLowerCase().trim() || '';
            const fullName = row.querySelector('td:nth-child(4)')?.textContent.toLowerCase().trim() || '';
            const phone = row.querySelector('td:nth-child(5)')?.textContent.toLowerCase().trim() || '';
            const roleElement = row.querySelector('.badge');
            const role = roleElement ? roleElement.textContent.trim() : '';

            const matchesSearch = searchTerm === '' ||
                username.includes(searchTerm) ||
                email.includes(searchTerm) ||
                fullName.includes(searchTerm) ||
                phone.includes(searchTerm);
            const matchesRole = !roleFilter || role.toUpperCase() === roleFilter.toUpperCase();

            if (matchesSearch && matchesRole) {
                row.style.display = '';
                visibleCount++;
            } else {
                row.style.display = 'none';
            }
        });

        // Show/hide empty state row
        const emptyStateRow = accountsTable.querySelector('tr:has(td[colspan])');
        if (emptyStateRow) {
            if (visibleCount === 0 && rows.length > 0) {
                // All filtered rows are hidden, but there are rows
                emptyStateRow.style.display = 'none';
            } else if (rows.length === 0) {
                // No rows at all
                emptyStateRow.style.display = '';
            } else {
                emptyStateRow.style.display = 'none';
            }
        }

        checkEmptyState(visibleCount);
    }
}

// Check Empty State
function checkEmptyState(visibleCount = null) {
    const emptyState = document.getElementById('emptyState');
    if (!emptyState) return;

    if (visibleCount === null) {
        // Check table rows
        const table = document.querySelector('.admin-table tbody');
        if (table) {
            const rows = Array.from(table.querySelectorAll('tr')).filter(row => row.style.display !== 'none');
            visibleCount = rows.length;
        }
    }

    if (visibleCount === 0) {
        emptyState.style.display = 'block';
    } else {
        emptyState.style.display = 'none';
    }
}

// ==================== ACCOUNT STATUS MANAGEMENT ====================

// Initialize account status from localStorage
function initializeAccountStatus() {
    try {
        // First, ensure all ADMIN accounts in localStorage have status 'active'
        ensureAdminAccountsAlwaysActive();

        const statusToggles = document.querySelectorAll('.status-toggle');
        if (!statusToggles || statusToggles.length === 0) {
            console.log('No status toggles found on this page');
            return;
        }

        statusToggles.forEach(toggle => {
            try {
                const accountId = toggle.getAttribute('data-account-id');
                const role = toggle.getAttribute('data-role') || 'USER';

                if (!accountId) {
                    console.warn('Status toggle missing data-account-id attribute');
                    return;
                }

                // Chỉ khởi tạo status cho USER, ADMIN luôn active
                if (role === 'ADMIN') {
                    // Force ADMIN status to always be 'active' in localStorage
                    localStorage.setItem(`account_status_${accountId}`, 'active');
                    toggle.setAttribute('data-status', 'active');
                    updateStatusDisplay(toggle, 'ACTIVE');
                    return;
                }

                // Get status from localStorage, default to 'active' (or use data-status from HTML)
                const defaultStatus = toggle.getAttribute('data-status') || 'ACTIVE';
                // const savedStatus = localStorage.getItem(`account_status_${accountId}`) || defaultStatus;

                // Update data attribute
                toggle.setAttribute('data-status', defaultStatus);

                // Update display
                updateStatusDisplay(toggle, defaultStatus);
            } catch (error) {
                console.error('Error initializing status for toggle:', error);
            }
        });
    } catch (error) {
        console.error('Error in initializeAccountStatus:', error);
    }
}

// Ensure all ADMIN accounts always have 'active' status in localStorage
function ensureAdminAccountsAlwaysActive() {
    try {
        // Method 1: Find all ADMIN status badges on the page
        const adminStatusBadges = document.querySelectorAll('.admin-status[data-role="ADMIN"]');
        adminStatusBadges.forEach(badge => {
            const accountId = badge.getAttribute('data-account-id');
            if (accountId) {
                // Force ADMIN status to always be 'active' in localStorage
                localStorage.setItem(`account_status_${accountId}`, 'active');
            }
        });

        // Method 2: Find all ADMIN role badges on the page
        const adminBadges = document.querySelectorAll('.badge-admin[data-role="ADMIN"]');
        adminBadges.forEach(badge => {
            const accountId = badge.getAttribute('data-account-id');
            if (accountId) {
                // Force ADMIN status to always be 'active' in localStorage
                localStorage.setItem(`account_status_${accountId}`, 'active');
            }
        });

        // Method 3: Check all localStorage keys for account_status_* and verify ADMIN accounts
        // This is a safety measure to clean up any incorrect status values
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('account_status_')) {
                const accountId = key.replace('account_status_', '');
                // Check if this account ID belongs to an ADMIN by looking for admin-status or badge-admin elements
                const adminStatusElement = document.querySelector(`.admin-status[data-account-id="${accountId}"]`);
                const adminBadgeElement = document.querySelector(`.badge-admin[data-account-id="${accountId}"]`);

                if (adminStatusElement || adminBadgeElement) {
                    // This is an ADMIN account, force status to 'active'
                    localStorage.setItem(key, 'active');
                }
            }
        }
    } catch (error) {
        console.error('Error ensuring ADMIN accounts are active:', error);
    }
}

// Setup status toggle event listeners
function setupStatusToggleListeners() {
    try {
        const statusToggles = document.querySelectorAll('.status-toggle');
        if (!statusToggles || statusToggles.length === 0) {
            console.log('No status toggles found to attach listeners');
            return;
        }

        statusToggles.forEach(toggle => {
            try {
                // Add click event listener directly to each toggle button
                toggle.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();

                    const accountId = this.getAttribute('data-account-id');
                    const username = this.getAttribute('data-username') || 'Tài khoản';
                    const role = this.getAttribute('data-role') || 'USER';

                    if (!accountId) {
                        console.error('Account ID not found for status toggle');
                        return;
                    }

                    // Chỉ cho phép toggle status cho USER, không cho ADMIN
                    if (role === 'ADMIN') {
                        showToast('Không thể thay đổi trạng thái của tài khoản ADMIN', 'warning');
                        return;
                    }

                    // Get current status from data attribute (which should be synced with localStorage)
                    const currentStatus = this.getAttribute('data-status') || 'ACTIVE';
                    const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';

                    // Update status
                    toggleAccountStatus(accountId, username, newStatus, this);
                });
            } catch (error) {
                console.error('Error setting up listener for toggle:', error);
            }
        });
    } catch (error) {
        console.error('Error in setupStatusToggleListeners:', error);
    }
}

// Toggle account status
function toggleAccountStatus(accountId, username, newStatus, statusToggle) {

    fetch(`/admin/account/update-status?id=${accountId}&status=${newStatus}`, {
        method: 'POST'
    })
        .then(response => {
            if (!response.ok) throw new Error('Cập nhật thất bại');
            return response.text();
        })
        .then(message => {
            console.log(message);
            showToast(`Đã ${statusText} tài khoản "${username}". ${actionText}`, 'success');
        })
        .catch(error => {
            console.error(error);
            showToast('Có lỗi xảy ra khi cập nhật trạng thái trong cơ sở dữ liệu.', 'error');
        });
    const role = statusToggle.getAttribute('data-role') || 'USER';

    // Đảm bảo chỉ toggle cho USER, không cho phép thay đổi status của ADMIN
    if (role === 'ADMIN') {
        showToast('Không thể thay đổi trạng thái của tài khoản ADMIN. Tài khoản ADMIN luôn ở trạng thái Active.', 'warning');
        // Force ADMIN status to always be 'active'
        localStorage.setItem(`account_status_${accountId}`, 'active');
        statusToggle.setAttribute('data-status', 'active');
        updateStatusDisplay(statusToggle, 'active');
        return;
    }

    updateAccountStatusOnServer(accountId, newStatus).then(response => {
        if (response && response.success) {
            // Update localStorage
            showToast(`Đã ${newStatus === 'active' ? 'kích hoạt' : 'vô hiệu hóa'} tài khoản "${username}".`, 'success');
        }else {
            showToast(response.message || 'Có lỗi xảy ra khi cập nhật trạng thái tài khoản trên server', 'error');
            return;
        }
    }).catch(error => {
        showToast('Có lỗi xảy ra khi cập nhật trạng thái tài khoản trên server: ' + error.message, 'error');
        return;
    });
    // // Save to localStorage (hardcode)
    // localStorage.setItem(`account_status_${accountId}`, newStatus);

    // Update display
    updateStatusDisplay(statusToggle, newStatus);

    // Update data attribute
    statusToggle.setAttribute('data-status', newStatus);

    // Show notification
    const statusText = newStatus === 'active' ? 'kích hoạt' : 'vô hiệu hóa';
    const actionText = newStatus === 'inactive' ? 'Tài khoản này sẽ không thể đăng nhập được' : 'Tài khoản này có thể đăng nhập bình thường';
    showToast(`Đã ${statusText} tài khoản "${username}". ${actionText}`, 'success');
}

async function updateAccountStatusOnServer(accountId, newStatus) {
    try {
        const response = await fetch(`/admin/api/account/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: newStatus.toUpperCase(), id: accountId })
        });
        return response.json();
    } catch (error) {
        alert('Có lỗi xảy ra khi cập nhật trạng thái tài khoản trên server: ' + error.message);
    }
}

// Update status display
function updateStatusDisplay(statusToggle, status) {
    try {
        if (!statusToggle) {
            console.error('statusToggle element is null');
            return;
        }

        const statusBadge = statusToggle.querySelector('.status-badge');
        if (!statusBadge) {
            console.error('Status badge not found inside toggle');
            return;
        }

        // Remove old classes
        statusBadge.classList.remove('status-active', 'status-inactive');

        // Add new class
        if (status === 'ACTIVE') {
            statusBadge.classList.add('status-active');
            statusBadge.innerHTML = '<i class="fas fa-check-circle"></i> Active';
        } else {
            statusBadge.classList.add('status-inactive');
            statusBadge.innerHTML = '<i class="fas fa-times-circle"></i> Inactive';
        }
    } catch (error) {
        console.error('Error updating status display:', error);
    }
}

// Get account status (for use in other parts of the app, e.g., login check)
// function getAccountStatus(accountId, role) {
//     // ADMIN accounts are always active
//     if (role === 'ADMIN') {
//         return 'ACTIVE';
//     }
//     return localStorage.getItem(`account_status_${accountId}`) || 'ACTIVE';
// }
//
// // Check if account is active
// function isAccountActive(accountId, role) {
//     // ADMIN accounts are always active
//     if (role === 'ADMIN') {
//         return true;
//     }
//     return getAccountStatus(accountId, role) === 'ACTIVE';
// }

// ==================== TOTALS CHART====================

// let totalsChart = null;
//
// async function loadTotalsChart() {
//     const canvas = document.getElementById('totalsChart');
//     if (!canvas) {
//         console.warn('Canvas #totalsChart không tồn tại');
//         return;
//     }
//
//     try {
//         const response = await fetch('/admin/dashboard-data');
//         if (!response.ok) throw new Error(`HTTP ${response.status}`);
//
//         const data = await response.json();
//         console.log('Dữ liệu dashboard:', data);
//
//         const labels = ['Sản phẩm', 'Đơn hàng', 'Tài khoản'];
//         const values = [
//             data.totalProducts || 0,
//             data.totalOrders || 0,
//             data.totalAccounts || 0
//             // data.totalRevenue || 0
//         ];
//         const colors = ['#4e73df', '#e74a3b', '#f6c23e'];
//
//         //Xóa hoàn toàn chart cũ
//         if (totalsChart) {
//             totalsChart.destroy();
//             totalsChart = null;
//         }
//
//         //Xóa canvas context (Chart.js đôi khi giữ lại)
//         const ctx = canvas.getContext('2d');
//         ctx.clearRect(0, 0, canvas.width, canvas.height);
//
//         //Tạo chart mới
//         totalsChart = new Chart(ctx, {
//             type: 'bar',
//             data: {
//                 labels: labels,
//                 datasets: [{
//                     label: 'Tổng số',
//                     data: values,
//                     backgroundColor: colors,
//                     borderRadius: 10,
//                     maxBarThickness: 50
//                 }]
//             },
//             options: {
//                 responsive: true,
//                 maintainAspectRatio: false,
//                 plugins: { legend: { display: false } },
//                 scales: {
//                     y: { beginAtZero: true, ticks: { stepSize: 2 } },
//                     x: { grid: { display: false } }
//                 },
//                 animation: {
//                     onComplete: function () {
//                         const ctx = this.ctx;
//                         ctx.save();
//                         ctx.font = 'bold 13px Arial';
//                         ctx.fillStyle = '#333';
//                         ctx.textAlign = 'center';
//                         this.data.datasets.forEach((dataset, i) => {
//                             const meta = this.getDatasetMeta(i);
//                             meta.data.forEach((bar, index) => {
//                                 let val = dataset.data[index];
//                                 if (index === 3) val = val.toLocaleString('vi-VN') + '₫';
//                                 ctx.fillText(val, bar.x, bar.y - 1);
//                             });
//                         });
//                         ctx.restore();
//                     }
//                 }
//             }
//         });
//
//         console.log('Biểu đồ đã được vẽ thành công!');
//
//     } catch (error) {
//         console.error('Lỗi tải biểu đồ:', error);
//         // showToast đã được định nghĩa ở trên → an toàn
//         if (typeof showToast === 'function') {
//             showToast('Không thể tải biểu đồ: ' + error.message, 'error');
//         }
//     }
// }

// CHẠY KHI TRANG LOAD
document.addEventListener('DOMContentLoaded', function () {
    const canvas = document.getElementById('totalsChart');
    if (canvas) {
        // loadTotalsChart();
    }
});

// Add fadeOut animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(-20px);
        }
    }
`;
document.head.appendChild(style);

