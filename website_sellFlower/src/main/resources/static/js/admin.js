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

// Delete Product
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

        let deleteType = 'product';
        let confirmMessage = `Bạn có chắc chắn muốn xóa sản phẩm "${itemName}"?`;

        if (onAccountsPage) {
            deleteType = 'account';
            confirmMessage = `Bạn có chắc chắn muốn xóa tài khoản "${itemName}"?`;
        } else if (onOrdersPage) {
            deleteType = 'order';
            confirmMessage = `Bạn có chắc chắn muốn xóa ${itemName}?`;
        }

        const confirmed = window.confirm(confirmMessage);
        if (!confirmed) {
            return;
        }

        try {
            if (deleteType === 'account') {
                await deleteAccount(itemId);
            } else if (deleteType === 'order') {
                await deleteOrder(itemId);
            } else {
                await deleteProduct(itemId);
            }
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
    const statusSelects = document.querySelectorAll('.status-select[data-id]');
    statusSelects.forEach(select => {
        select.addEventListener('change', function() {
            const orderId = this.getAttribute('data-id');
            const newStatus = this.value;
            updateOrderStatus(orderId, newStatus);
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
            // Remove row from table - find button first, then get parent row
            const deleteButton = document.querySelector(`.btn-delete[data-id="${productId}"]`);
            if (deleteButton) {
                const row = deleteButton.closest('tr');
                if (row) {
                    row.style.animation = 'fadeOut 0.3s ease-out';
                    setTimeout(() => {
                        row.remove();
                        // Check if table is empty
                        const productsTable = document.querySelector('#productsTableBody');
                        if (productsTable) {
                            const remainingRows = productsTable.querySelectorAll('tr');
                            checkEmptyState(remainingRows.length);
                        }
                    }, 300);
                } else {
                    console.error('Row not found for product:', productId);
                    // Reload page to refresh
                    setTimeout(() => window.location.reload(), 1000);
                }
            } else {
                console.error('Delete button not found for product:', productId);
                // Reload page to refresh
                setTimeout(() => window.location.reload(), 1000);
            }
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
async function deleteOrder(orderId) {
    try {
        console.log('Deleting order:', orderId);
        const response = await fetch(`/admin/api/orders/${orderId}`, {
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
        console.log('Delete order response:', data);

        if (data.success) {
            showToast(data.message || 'Xóa đơn hàng thành công', 'success');
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
                    setTimeout(() => window.location.reload(), 1000);
                }
            } else {
                console.error('Delete button not found for order:', orderId);
                // Reload page to refresh
                setTimeout(() => window.location.reload(), 1000);
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
        category: document.getElementById('category').value
    };

    // Validation
    if (!formData.name || !formData.price || !formData.stockQuantity || !formData.imageUrl || !formData.category) {
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
        } else {
            showToast(data.message || 'Có lỗi xảy ra khi cập nhật trạng thái', 'error');
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
    const productsTable = document.querySelector('#productsTableBody');
    if (productsTable) {
        const rows = productsTable.querySelectorAll('tr');
        let visibleCount = 0;

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

        checkEmptyState(visibleCount);
    }

    // Orders table
    const ordersTable = document.querySelector('#ordersTableBody');
    if (ordersTable) {
        const rows = ordersTable.querySelectorAll('tr');
        let visibleCount = 0;

        rows.forEach(row => {
            const customer = row.querySelector('td:nth-child(2)')?.textContent.toLowerCase() || '';
            const status = row.querySelector('.status-select')?.value || '';
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

