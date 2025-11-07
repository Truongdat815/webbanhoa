// Get product ID from URL path parameter
function getProductIdFromURL() {
    const pathParts = window.location.pathname.split('/');
    // Look for 'detail' in the path (e.g., /product/detail/1)
    const idIndex = pathParts.indexOf('detail');
    if (idIndex !== -1 && pathParts[idIndex + 1]) {
        return pathParts[idIndex + 1];
    }
    return null;
}

// Sample products data (will be replaced with API call later)
const sampleProducts = {
    1: {
        id: 1,
        name: "Cây Hoa Hồng Hồng",
        price: 420000,
        image: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=400",
        stock: 50,
        description: "Hoa tươi cao cấp được chọn lọc kỹ lưỡng từ vườn ươm uy tín. Mỗi bông hoa đều được chăm sóc cẩn thận để đảm bảo độ tươi và vẻ đẹp hoàn hảo."
    },
    2: {
        id: 2,
        name: "Hoa Hạnh Phúc Cao Cấp",
        price: 420000,
        image: "https://images.unsplash.com/photo-1520763185298-1b434c919102?w=400",
        stock: 30,
        description: "Hoa tươi cao cấp được chọn lọc kỹ lưỡng từ vườn ươm uy tín. Mỗi bông hoa đều được chăm sóc cẩn thận để đảm bảo độ tươi và vẻ đẹp hoàn hảo."
    },
    3: {
        id: 3,
        name: "Hoa Hồng Trắng",
        price: 380000,
        image: "https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?w=400",
        stock: 40,
        description: "Hoa tươi cao cấp được chọn lọc kỹ lưỡng từ vườn ươm uy tín. Mỗi bông hoa đều được chăm sóc cẩn thận để đảm bảo độ tươi và vẻ đẹp hoàn hảo."
    },
    4: {
        id: 4,
        name: "Bó Hoa Hồng Đỏ",
        price: 480000,
        image: "https://images.unsplash.com/photo-1563241529-0c3e8b3d3e3f?w=400",
        stock: 25,
        description: "Hoa tươi cao cấp được chọn lọc kỹ lưỡng từ vườn ươm uy tín. Mỗi bông hoa đều được chăm sóc cẩn thận để đảm bảo độ tươi và vẻ đẹp hoàn hảo."
    },
    5: {
        id: 5,
        name: "Khát Vọng Trái Tim",
        price: 360000,
        image: "https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=400",
        stock: 60,
        description: "Hoa tươi cao cấp được chọn lọc kỹ lưỡng từ vườn ươm uy tín. Mỗi bông hoa đều được chăm sóc cẩn thận để đảm bảo độ tươi và vẻ đẹp hoàn hảo."
    },
    6: {
        id: 6,
        name: "Bó Hoa Hồng Đỏ",
        price: 480000,
        image: "https://images.unsplash.com/photo-1597848212624-e593b98b8c9a?w=400",
        stock: 35,
        description: "Hoa tươi cao cấp được chọn lọc kỹ lưỡng từ vườn ươm uy tín. Mỗi bông hoa đều được chăm sóc cẩn thận để đảm bảo độ tươi và vẻ đẹp hoàn hảo."
    },
    7: {
        id: 7,
        name: "Khát Vọng Trái Tim",
        price: 360000,
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
        stock: 20,
        description: "Hoa tươi cao cấp được chọn lọc kỹ lưỡng từ vườn ươm uy tín. Mỗi bông hoa đều được chăm sóc cẩn thận để đảm bảo độ tươi và vẻ đẹp hoàn hảo."
    },
    8: {
        id: 8,
        name: "Hoa Hồng Đỏ Tươi",
        price: 450000,
        image: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=400",
        stock: 45,
        description: "Hoa tươi cao cấp được chọn lọc kỹ lưỡng từ vườn ươm uy tín. Mỗi bông hoa đều được chăm sóc cẩn thận để đảm bảo độ tươi và vẻ đẹp hoàn hảo."
    }
};

// Get product data from URL path parameter
function getProductDataFromURL() {
    const productId = getProductIdFromURL();
    if (!productId) {
        return null;
    }
    
    // Get product data from sample data (will be replaced with API call)
    return sampleProducts[productId] || null;
}

// Helper function to format price
function formatPrice(price) {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return '₫' + numPrice.toLocaleString('vi-VN');
}

// Sample product images for thumbnails
const productImages = [
    'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=400',
    'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400',
    'https://images.unsplash.com/photo-1464047736614-af63643285bf?w=400',
    'https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=400'
];

// Load product details
function loadProductDetails() {
    const productData = getProductDataFromURL();
    
    if (!productData || !productData.id) {
        // If no product data, redirect to product list
        window.location.href = '/product';
        return;
    }

    // Update product details on page
    document.getElementById('productTitle').textContent = productData.name || 'Sản phẩm';
    document.getElementById('productPrice').textContent = formatPrice(productData.price || '0');
    document.getElementById('mainProductImage').src = productData.image || productImages[0];
    const qtyInput = document.getElementById('productQuantity');
    const stock = parseInt(productData.stock) || 50;
    // Set max attribute for validation (will be used by change event)
    qtyInput.setAttribute('max', stock);
    
    // Update short description if available
    if (productData.description && document.getElementById('productShortDesc')) {
        document.getElementById('productShortDesc').textContent = productData.description;
    }

    // Set main image source
    const mainImage = document.getElementById('mainProductImage');
    mainImage.src = productData.image || productImages[0];

    // Update thumbnails
    const thumbnails = document.querySelectorAll('.thumbnail');
    thumbnails.forEach((thumb, index) => {
        thumb.src = index === 0 ? productData.image : productImages[index];
    });

    // Update stock status
    const stockStatus = document.getElementById('stockStatus');
    if (stock > 0) {
        stockStatus.textContent = `Còn hàng (${stock} sản phẩm)`;
        stockStatus.style.color = '#4caf50';
    } else {
        stockStatus.textContent = 'Hết hàng';
        stockStatus.style.color = '#f44336';
    }
}

// Thumbnail click handler
function initThumbnailGallery() {
    const thumbnails = document.querySelectorAll('.thumbnail');
    const mainImage = document.getElementById('mainProductImage');

    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', function() {
            // Remove active class from all thumbnails
            thumbnails.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked thumbnail
            this.classList.add('active');
            
            // Update main image
            mainImage.src = this.src;
        });
    });
}

// Quantity selector
function initQuantitySelector() {
    const minusBtn = document.querySelector('.minus-btn-detail');
    const plusBtn = document.querySelector('.plus-btn-detail');
    const qtyInput = document.getElementById('productQuantity');
    
    if (!qtyInput || !minusBtn || !plusBtn) return;

    // Disable HTML5 validation popup completely
    qtyInput.setCustomValidity('');
    qtyInput.addEventListener('invalid', function(e) {
        e.preventDefault();
        e.stopPropagation();
        this.setCustomValidity('');
        return false;
    });

    minusBtn.addEventListener('click', function() {
        let currentValue = parseInt(qtyInput.value);
        const min = parseInt(qtyInput.getAttribute('min')) || 1;
        if (currentValue > min) {
            qtyInput.value = currentValue - 1;
            animateInput(qtyInput);
        }
    });

    plusBtn.addEventListener('click', function() {
        let currentValue = parseInt(qtyInput.value);
        const max = parseInt(qtyInput.getAttribute('max'));
        if (max && currentValue >= max) {
            showToast(`Số lượng vượt quá tồn kho! Tồn kho hiện có: ${max}`, 'warning');
            return;
        }
        qtyInput.value = currentValue + 1;
        animateInput(qtyInput);
    });

    qtyInput.addEventListener('change', function() {
        const min = parseInt(this.getAttribute('min')) || 1;
        const max = parseInt(this.getAttribute('max'));
        
                // 1. Chuyển giá trị nhập vào thành SỐ
                let currentValue = parseInt(this.value);
        
                // 2. Xử lý nếu người dùng nhập chữ (vd: "abc") hoặc rỗng
                if (isNaN(currentValue)) {
                    currentValue = min;
                }
        
                // 3. So sánh SỐ với SỐ
        if (currentValue < min) {
        this.value = min;
        } else if (max && currentValue > max) { // So sánh (number > number)
        this.value = max;
                    // Gọi thông báo toast
        showToast(`Số lượng vượt quá tồn kho! Tồn kho hiện có: ${max}`, 'warning');
        } else {
                    // Cập nhật lại giá trị đã được parse (vd: "05" -> 5)
                    this.value = currentValue;
                }
        });
}

function animateInput(input) {
    input.style.transform = 'scale(1.2)';
    setTimeout(() => {
        input.style.transform = 'scale(1)';
    }, 200);
}

// Add to cart
function initAddToCart() {
    const addToCartBtn = document.getElementById('addToCartBtn');
    
    addToCartBtn.addEventListener('click', async function() {
        const productData = getProductDataFromURL();
        if (!productData) {
            showToast('Không tìm thấy sản phẩm!', 'warning');
            return;
        }
        
        const quantity = parseInt(document.getElementById('productQuantity').value);
        
        // Disable button during request
        addToCartBtn.disabled = true;
        addToCartBtn.textContent = 'Đang thêm...';
        
        try {
            // Add to cart via API
            const result = await addToCart(
                productData.id,
                productData.name,
                productData.price,
                quantity,
                productData.image || ''
            );
            
            if (result.success) {
                showToast(result.message || 'Đã thêm vào giỏ hàng!', 'success');
                // Cart count will be updated automatically by cart-utils.js
            } else {
                showToast(result.message || 'Có lỗi xảy ra!', 'warning');
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            showToast('Có lỗi xảy ra khi thêm vào giỏ hàng!', 'warning');
        } finally {
            // Re-enable button
            addToCartBtn.disabled = false;
            const icon = addToCartBtn.querySelector('i');
            addToCartBtn.innerHTML = icon ? icon.outerHTML + ' Thêm vào giỏ hàng' : 'Thêm vào giỏ hàng';
        }
    });
}

// Show toast notification
function showToast(message, type = 'success') {
    let toast = document.getElementById('toast');
    
    // Create toast if it doesn't exist
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.className = 'toast';
        toast.innerHTML = '<i class="fas fa-check-circle"></i><span></span>';
        document.body.appendChild(toast);
    }
    
    const toastText = toast.querySelector('span');
    const toastIcon = toast.querySelector('i');
    
    if (toastText) toastText.textContent = message;
    
    // Change color based on type
    if (type === 'warning') {
        toast.style.backgroundColor = '#f59e0b';
        if (toastIcon) toastIcon.className = 'fas fa-exclamation-circle';
    } else if (type === 'error') {
        toast.style.backgroundColor = '#ef4444';
        if (toastIcon) toastIcon.className = 'fas fa-times-circle';
    } else {
        toast.style.backgroundColor = '#4caf50';
        if (toastIcon) toastIcon.className = 'fas fa-check-circle';
    }
    
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Tab functionality
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content-detail');

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            this.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    loadProductDetails();
    initThumbnailGallery();
    initQuantitySelector();
    initAddToCart();
    initTabs();
});

