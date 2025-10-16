/**
 * WebBanHoa - Flower Shop Website JavaScript
 * Main JavaScript file with all functionality
 * Includes: Slider, Navigation, Cart, Auth, Product rendering
 */

// ===== GLOBAL VARIABLES =====
let currentUser = null;
let products = [];
let cart = [];

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavigation();
    initSlider();
    initCart();
    initAuth();
    initAnimations();
    loadProducts();
    
    // Load user data if available
    loadCurrentUser();
    
    // Update cart badge
    updateCartBadge();
});

// ===== NAVIGATION =====
function initNavigation() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (mobileMenuToggle && navMenu) {
        // Mobile menu toggle
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.classList.toggle('active');
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                navMenu.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
            }
        });
    }
    
    // Handle dropdown menus
    const dropdownItems = document.querySelectorAll('.nav-item.dropdown');
    dropdownItems.forEach(item => {
        const dropdown = item.querySelector('.dropdown-menu');
        
        if (window.innerWidth > 991) {
            // Desktop: hover behavior
            item.addEventListener('mouseenter', function() {
                dropdown.style.display = 'block';
            });
            
            item.addEventListener('mouseleave', function() {
                dropdown.style.display = 'none';
            });
        } else {
            // Mobile: click behavior
            const link = item.querySelector('.nav-link');
            link.addEventListener('click', function(e) {
                e.preventDefault();
                dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
            });
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 991) {
            // Desktop behavior
            navMenu.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
        }
    });
}

// ===== SLIDER INITIALIZATION =====
function initSlider() {
    // Initialize hero slider if it exists
    const heroSwiper = document.querySelector('.heroSwiper');
    if (heroSwiper) {
        new Swiper('.heroSwiper', {
            loop: true,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            effect: 'fade',
            fadeEffect: {
                crossFade: true
            }
        });
    }
}

// ===== CART FUNCTIONALITY =====
function initCart() {
    // Load cart from localStorage
    cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Add to cart functionality
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-add-to-cart') || e.target.closest('.btn-add-to-cart')) {
            e.preventDefault();
            const button = e.target.classList.contains('btn-add-to-cart') ? e.target : e.target.closest('.btn-add-to-cart');
            const productId = parseInt(button.dataset.productId);
            const quantity = parseInt(button.dataset.quantity) || 1;
            
            addToCart(productId, quantity);
        }
    });
    
    // Update cart badge
    updateCartBadge();
}

function addToCart(productId, quantity = 1) {
    // Find product
    const product = products.find(p => p.id === productId);
    if (!product) {
        showNotification('Sản phẩm không tồn tại!', 'error');
        return;
    }
    
    // Check if product already in cart
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            description: product.description,
            quantity: quantity
        });
    }
    
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update UI
    updateCartBadge();
    
    // Animate cart badge
    const cartBadge = document.getElementById('cartBadge');
    if (cartBadge) {
        bounceElement(cartBadge);
    }
    
    // Show animated notification
    showAnimatedNotification(`${product.name} đã được thêm vào giỏ hàng!`, 'success');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartBadge();
    showNotification('Sản phẩm đã được xóa khỏi giỏ hàng!', 'info');
}

function updateCartQuantity(productId, newQuantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        if (newQuantity <= 0) {
            removeFromCart(productId);
        } else {
            item.quantity = newQuantity;
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartBadge();
        }
    }
}

function updateCartBadge() {
    const cartBadge = document.getElementById('cartBadge');
    if (cartBadge) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartBadge.textContent = totalItems;
        cartBadge.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

function getCartTotal() {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

// ===== PRODUCT MANAGEMENT =====
async function loadProducts() {
    try {
        const response = await fetch('data/products.json');
        products = await response.json();
        
        // Render product grid if on product page
        if (document.getElementById('productGrid')) {
            renderProductGridWithAnimations();
        }
        
        // Load product detail if on detail page
        if (document.getElementById('productDetailContent')) {
            loadProductDetail();
        }
        
    } catch (error) {
        console.error('Error loading products:', error);
        // Fallback to hardcoded products if JSON fails
        products = getDefaultProducts();
        if (document.getElementById('productGrid')) {
            renderProductGrid();
        }
    }
}

function renderProductGrid() {
    const container = document.getElementById('productGrid');
    if (!container) return;
    
    // Get filter parameters from URL
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    const priceRange = urlParams.get('price');
    
    // Filter products
    let filteredProducts = products;
    
    if (category) {
        filteredProducts = products.filter(p => p.category === category);
    }
    
    if (priceRange) {
        const [min, max] = priceRange.split('-').map(Number);
        filteredProducts = filteredProducts.filter(p => p.price >= min && p.price <= max);
    }
    
    // Sort products
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        const sortValue = sortSelect.value;
        filteredProducts.sort((a, b) => {
            switch (sortValue) {
                case 'price-asc':
                    return a.price - b.price;
                case 'price-desc':
                    return b.price - a.price;
                case 'name-asc':
                    return a.name.localeCompare(b.name);
                case 'name-desc':
                    return b.name.localeCompare(a.name);
                default:
                    return 0;
            }
        });
    }
    
    // Render products
    if (filteredProducts.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="fas fa-search fa-3x text-muted mb-3"></i>
                <h4>Không tìm thấy sản phẩm</h4>
                <p class="text-muted">Thử thay đổi bộ lọc hoặc tìm kiếm khác</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = filteredProducts.map(product => `
        <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
            <div class="product-card">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}" loading="lazy">
                    ${product.discount ? `<div class="product-badge">-${product.discount}%</div>` : ''}
                </div>
                <div class="product-info">
                    <h5>${product.name}</h5>
                    <p>${product.description}</p>
                    <div class="product-price">
                        <span class="price-new">${formatPrice(product.salePrice || product.price)}</span>
                        ${product.salePrice ? `<span class="price-old">${formatPrice(product.price)}</span>` : ''}
                    </div>
                    <button class="btn-add-to-cart" data-product-id="${product.id}">
                        ĐẶT HÀNG
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function loadProductDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));
    
    if (!productId) return;
    
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    // Update page title
    document.title = `${product.name} - WebBanHoa`;
    
    // Update breadcrumb
    const breadcrumb = document.getElementById('productBreadcrumb');
    if (breadcrumb) {
        breadcrumb.textContent = product.name;
    }
    
    // Render product detail
    const container = document.getElementById('productDetailContent');
    if (container) {
        container.innerHTML = `
            <div class="col-lg-6">
                <div class="product-detail-images">
                    <img src="${product.image}" alt="${product.name}" class="img-fluid">
                </div>
            </div>
            <div class="col-lg-6">
                <div class="product-detail-info">
                    <h1>${product.name}</h1>
                    <div class="price">
                        ${formatPrice(product.salePrice || product.price)}
                        ${product.salePrice ? `<span class="price-old ms-2">${formatPrice(product.price)}</span>` : ''}
                    </div>
                    <div class="description">
                        ${product.description}
                    </div>
                    <div class="quantity-selector">
                        <label>Số lượng:</label>
                        <div class="quantity-controls">
                            <button type="button" onclick="changeQuantity(-1)">-</button>
                            <span class="quantity" id="productQuantity">1</span>
                            <button type="button" onclick="changeQuantity(1)">+</button>
                        </div>
                    </div>
                    <button class="btn-add-to-cart btn btn-primary btn-lg" data-product-id="${product.id}">
                        <i class="fas fa-shopping-cart"></i> Thêm vào giỏ hàng
                    </button>
                </div>
            </div>
        `;
        
        // Load related products
        loadRelatedProducts(product.category, product.id);
    }
}

function loadRelatedProducts(category, excludeId) {
    const relatedProducts = products
        .filter(p => p.category === category && p.id !== excludeId)
        .slice(0, 4);
    
    const container = document.getElementById('relatedProducts');
    if (container && relatedProducts.length > 0) {
        container.innerHTML = relatedProducts.map(product => `
            <div class="col-lg-3 col-md-6 mb-4">
                <div class="product-card">
                    <div class="product-image">
                        <img src="${product.image}" alt="${product.name}" loading="lazy">
                        ${product.discount ? `<div class="product-badge">-${product.discount}%</div>` : ''}
                    </div>
                    <div class="product-info">
                        <h5>${product.name}</h5>
                        <p>${product.description}</p>
                        <div class="product-price">
                            <span class="price-new">${formatPrice(product.salePrice || product.price)}</span>
                            ${product.salePrice ? `<span class="price-old">${formatPrice(product.price)}</span>` : ''}
                        </div>
                        <a href="product-detail.html?id=${product.id}" class="btn btn-outline-primary btn-sm">
                            Xem chi tiết
                        </a>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

// Quantity controls for product detail
function changeQuantity(delta) {
    const quantityElement = document.getElementById('productQuantity');
    if (quantityElement) {
        let quantity = parseInt(quantityElement.textContent) + delta;
        quantity = Math.max(1, quantity);
        quantityElement.textContent = quantity;
        
        // Update add to cart button data
        const addButton = document.querySelector('.btn-add-to-cart');
        if (addButton) {
            addButton.dataset.quantity = quantity;
        }
    }
}

// ===== AUTHENTICATION =====
function initAuth() {
    // Check if user is logged in on page load
    loadCurrentUser();
    
    // Handle user menu in header
    updateUserMenu();
}

function loadCurrentUser() {
    currentUser = JSON.parse(localStorage.getItem('currentUser'));
    return currentUser;
}

function updateUserMenu() {
    const userMenu = document.getElementById('userMenu');
    if (!userMenu) return;
    
    if (currentUser) {
        userMenu.innerHTML = `
            <div class="dropdown">
                <a href="#" class="dropdown-toggle" data-bs-toggle="dropdown">
                    <i class="fas fa-user-circle"></i> ${currentUser.fullName || currentUser.firstName}
                </a>
                <ul class="dropdown-menu">
                    <li><a class="dropdown-item" href="account/dashboard.html">Tài khoản</a></li>
                    <li><a class="dropdown-item" href="account/orders.html">Đơn hàng</a></li>
                    <li><a class="dropdown-item" href="account/profile.html">Thông tin</a></li>
                    <li><hr class="dropdown-divider"></li>
                    <li><a class="dropdown-item" href="#" onclick="logout()">Đăng xuất</a></li>
                </ul>
            </div>
        `;
    } else {
        userMenu.innerHTML = `
            <a href="auth/login.html">Đăng nhập</a> / 
            <a href="auth/register.html">Đăng ký</a>
        `;
    }
}

function login(email, password) {
    // Mock authentication - in real app, this would be an API call
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        updateUserMenu();
        return true;
    }
    
    return false;
}

function logout() {
    if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
        currentUser = null;
        localStorage.removeItem('currentUser');
        updateUserMenu();
        showNotification('Đã đăng xuất thành công!', 'info');
        
        // Redirect to home page
        window.location.href = 'index.html';
    }
}

function register(userData) {
    // Mock registration - in real app, this would be an API call
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Check if email already exists
    if (users.find(u => u.email === userData.email)) {
        return { success: false, message: 'Email này đã được sử dụng!' };
    }
    
    // Create new user
    const newUser = {
        id: Date.now(),
        ...userData,
        fullName: `${userData.firstName} ${userData.lastName}`,
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    return { success: true, user: newUser };
}

// ===== UTILITY FUNCTIONS =====
function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(price);
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type === 'error' ? 'danger' : type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = `
        top: 20px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
    `;
    
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 3000);
}

function getDefaultProducts() {
    return [
        {
            id: 1,
            name: 'Hoa hồng đỏ',
            description: 'Bó hoa hồng đỏ tươi thắm, tượng trưng cho tình yêu nồng nàn',
            price: 150000,
            salePrice: 120000,
            discount: 20,
            category: 'love',
            image: 'assets/placeholder-1.jpg'
        },
        {
            id: 2,
            name: 'Hoa ly trắng',
            description: 'Hoa ly trắng tinh khôi, mang ý nghĩa sự trong sáng và thuần khiết',
            price: 200000,
            category: 'birthday',
            image: 'assets/placeholder-2.jpg'
        },
        {
            id: 3,
            name: 'Hoa cúc vàng',
            description: 'Hoa cúc vàng rực rỡ, biểu tượng của sự may mắn và thịnh vượng',
            price: 120000,
            salePrice: 100000,
            discount: 17,
            category: 'birthday',
            image: 'assets/placeholder-3.jpg'
        },
        {
            id: 4,
            name: 'Hoa lan tím',
            description: 'Hoa lan tím quý phái, thể hiện sự sang trọng và quyền quý',
            price: 350000,
            category: 'opening',
            image: 'assets/placeholder-4.jpg'
        },
        {
            id: 5,
            name: 'Hoa tulip hồng',
            description: 'Hoa tulip hồng dịu dàng, tượng trưng cho tình yêu lãng mạn',
            price: 180000,
            salePrice: 150000,
            discount: 17,
            category: 'love',
            image: 'assets/placeholder-5.jpg'
        },
        {
            id: 6,
            name: 'Hoa hướng dương',
            description: 'Hoa hướng dương vàng rực, mang năng lượng tích cực và niềm vui',
            price: 100000,
            category: 'birthday',
            image: 'assets/placeholder-6.jpg'
        },
        {
            id: 7,
            name: 'Kệ hoa khai trương lớn',
            description: 'Kệ hoa khai trương sang trọng với nhiều loại hoa tươi',
            price: 800000,
            salePrice: 650000,
            discount: 19,
            category: 'opening',
            image: 'assets/placeholder-7.jpg'
        },
        {
            id: 8,
            name: 'Hoa cưới cao cấp',
            description: 'Bó hoa cưới sang trọng với hoa hồng và hoa baby',
            price: 450000,
            category: 'wedding',
            image: 'assets/placeholder-8.jpg'
        }
    ];
}

// ===== SEARCH FUNCTIONALITY =====
function initSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const query = this.value.trim();
                if (query) {
                    searchProducts(query);
                }
            }
        });
        
        const searchBtn = document.querySelector('.search-btn');
        if (searchBtn) {
            searchBtn.addEventListener('click', function() {
                const query = searchInput.value.trim();
                if (query) {
                    searchProducts(query);
                }
            });
        }
    }
}

function searchProducts(query) {
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase())
    );
    
    // Redirect to product grid with search results
    const url = new URL('product-grid.html', window.location.origin);
    url.searchParams.set('search', query);
    window.location.href = url.toString();
}

// ===== FILTER FUNCTIONALITY =====
function initFilters() {
    const filterLinks = document.querySelectorAll('.filter-list a[data-price]');
    filterLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const priceRange = this.dataset.price;
            const url = new URL(window.location);
            url.searchParams.set('price', priceRange);
            window.location.href = url.toString();
        });
    });
    
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            const url = new URL(window.location);
            url.searchParams.set('sort', this.value);
            window.location.href = url.toString();
        });
    }
}

// ===== INITIALIZE ADDITIONAL FEATURES =====
document.addEventListener('DOMContentLoaded', function() {
    // Initialize search if on pages with search
    if (document.getElementById('searchInput')) {
        initSearch();
    }
    
    // Initialize filters if on product grid page
    if (document.querySelector('.filter-list')) {
        initFilters();
    }
    
    // Initialize product detail quantity controls
    if (document.getElementById('productQuantity')) {
        // Quantity controls are already handled by changeQuantity function
    }
});

// ===== ANIMATION FUNCTIONS =====
function initAnimations() {
    // Initialize AOS (Animate On Scroll)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            offset: 100
        });
    }
    
    // Initialize page transitions
    initPageTransitions();
    
    // Initialize stagger animations
    initStaggerAnimations();
    
    // Initialize hover effects
    initHoverEffects();
}

function initPageTransitions() {
    const pageElements = document.querySelectorAll('.page-transition');
    pageElements.forEach((element, index) => {
        setTimeout(() => {
            element.classList.add('loaded');
        }, index * 100);
    });
}

function initStaggerAnimations() {
    const staggerItems = document.querySelectorAll('.stagger-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('animate');
                }, index * 150);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    staggerItems.forEach(item => {
        observer.observe(item);
    });
}

function initHoverEffects() {
    // Add hover effects to product cards
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.classList.add('hover-lift');
        
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Add floating animation to icons
    const floatingIcons = document.querySelectorAll('.float');
    floatingIcons.forEach(icon => {
        icon.style.animationDelay = Math.random() * 2 + 's';
    });
}

function animateElement(element, animation, delay = 0) {
    setTimeout(() => {
        element.classList.add(animation);
        
        // Remove animation class after animation completes
        element.addEventListener('animationend', function() {
            this.classList.remove(animation);
        }, { once: true });
    }, delay);
}

function staggerElements(elements, animation, staggerDelay = 100) {
    elements.forEach((element, index) => {
        animateElement(element, animation, index * staggerDelay);
    });
}

function bounceElement(element) {
    element.classList.add('bounce');
    setTimeout(() => {
        element.classList.remove('bounce');
    }, 2000);
}

function wiggleElement(element) {
    element.classList.add('wiggle');
    setTimeout(() => {
        element.classList.remove('wiggle');
    }, 1000);
}

// Enhanced product rendering with animations
function renderProductGridWithAnimations() {
    const container = document.getElementById('productGrid');
    if (!container) return;
    
    // Get filter parameters from URL
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    const priceRange = urlParams.get('price');
    
    // Filter products
    let filteredProducts = products;
    
    if (category) {
        filteredProducts = products.filter(p => p.category === category);
    }
    
    if (priceRange) {
        const [min, max] = priceRange.split('-').map(Number);
        filteredProducts = filteredProducts.filter(p => p.price >= min && p.price <= max);
    }
    
    // Render products with animation classes
    if (filteredProducts.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="fas fa-search fa-3x text-muted mb-3 fade-in-up"></i>
                <h4 class="fade-in-up" style="animation-delay: 0.2s">Không tìm thấy sản phẩm</h4>
                <p class="text-muted fade-in-up" style="animation-delay: 0.4s">Thử thay đổi bộ lọc hoặc tìm kiếm khác</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = filteredProducts.map((product, index) => `
        <div class="col-lg-3 col-md-4 col-sm-6 mb-4 stagger-item" data-aos="fade-up" data-aos-delay="${index * 100}">
            <div class="product-card hover-lift">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}" loading="lazy" class="hover-scale">
                    ${product.discount ? `<div class="product-badge pulse">-${product.discount}%</div>` : ''}
                </div>
                <div class="product-info">
                    <h5 class="fade-in-up" style="animation-delay: 0.1s">${product.name}</h5>
                    <p class="fade-in-up" style="animation-delay: 0.2s">${product.description}</p>
                    <div class="product-price fade-in-up" style="animation-delay: 0.3s">
                        <span class="price-new">${formatPrice(product.salePrice || product.price)}</span>
                        ${product.salePrice ? `<span class="price-old">${formatPrice(product.price)}</span>` : ''}
                    </div>
                    <button class="btn-add-to-cart hover-glow fade-in-up" data-product-id="${product.id}" style="animation-delay: 0.4s">
                        <span class="btn-text">ĐẶT HÀNG</span>
                        <i class="fas fa-shopping-cart ms-2"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    // Initialize stagger animations for new elements
    initStaggerAnimations();
}

// Enhanced notification with animations
function showAnimatedNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type === 'error' ? 'danger' : type} alert-dismissible fade show position-fixed slide-in-up`;
    notification.style.cssText = `
        top: 20px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        transform: translateX(100%);
        transition: transform 0.3s ease-out;
    `;
    
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'} me-2"></i>
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 4000);
}

// ===== EXPORT FUNCTIONS FOR GLOBAL USE =====
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateCartQuantity = updateCartQuantity;
window.changeQuantity = changeQuantity;
window.logout = logout;
window.formatPrice = formatPrice;
window.showNotification = showAnimatedNotification;
window.animateElement = animateElement;
window.bounceElement = bounceElement;
window.wiggleElement = wiggleElement;
