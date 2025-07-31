// Produtos - JavaScript

// Estado global da aplicação
let userPoints = 1250; // Pontos padrão para demonstração
let currentProduct = null;

// Inicialização quando a página carrega
document.addEventListener('DOMContentLoaded', function() {
    checkLoginStatus();
    initializeFilters();
    updateUserPointsDisplay();
    setupEventListeners();
    updateProductButtons();
});

// ===== LOGIN STATUS MANAGEMENT =====
function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('eniac_logged_in') === 'true';
    const userName = localStorage.getItem('eniac_user_name') || 'Usuário';
    
    if (isLoggedIn) {
        showUserGreeting(userName);
        enablePurchases();
    } else {
        hideUserGreeting();
        disablePurchases();
    }
}

function showUserGreeting(userName) {
    const userGreeting = document.getElementById('userGreeting');
    const greetingText = document.getElementById('greetingText');
    
    if (userGreeting && greetingText) {
        greetingText.textContent = `Olá, ${userName}!`;
        userGreeting.style.display = 'block';
    }
    
    // Atualizar seção de informações do usuário
    const userInfo = document.querySelector('.user-info');
    if (userInfo) {
        userInfo.innerHTML = `
            <div class="user-welcome">
                <span class="welcome-text">Bem-vindo, ${userName}!</span>
                <button onclick="logout()" class="logout-btn">Sair</button>
            </div>
        `;
    }
}

function hideUserGreeting() {
    const userGreeting = document.getElementById('userGreeting');
    if (userGreeting) {
        userGreeting.style.display = 'none';
    }
    
    // Mostrar prompt de login
    const userInfo = document.querySelector('.user-info');
    if (userInfo) {
        userInfo.innerHTML = `
            <div class="login-prompt">
                <span class="prompt-text">Faça login para trocar pontos por prêmios</span>
                <a href="login.html" class="login-btn-link">Fazer Login</a>
            </div>
        `;
    }
}

function enablePurchases() {
    const buttons = document.querySelectorAll('.btn-add-cart');
    buttons.forEach(button => {
        button.disabled = false;
        button.classList.remove('disabled');
        button.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16.5 5.1 16.5H17M17 13V17C17 18.1 16.1 19 15 19H9C7.9 19 7 18.1 7 17V13H17Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Resgatar
        `;
    });
}

function disablePurchases() {
    const buttons = document.querySelectorAll('.btn-add-cart');
    buttons.forEach(button => {
        button.disabled = true;
        button.classList.add('disabled');
        button.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Login Necessário
        `;
        
        // Remover onclick se existir
        button.removeAttribute('onclick');
        
        // Adicionar evento para redirecionar para login
        button.addEventListener('click', function(e) {
            e.preventDefault();
            showNotification('Faça login para resgatar produtos!', 'warning');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
        });
    });
}

function logout() {
    localStorage.removeItem('eniac_logged_in');
    localStorage.removeItem('eniac_user_name');
    localStorage.removeItem('eniac_user_email');
    localStorage.removeItem('eniac_remember');
    localStorage.removeItem('eniac_user');
    
    showNotification('Logout realizado com sucesso!', 'success');
    checkLoginStatus();
}

// ===== FILTERS AND PRODUCTS =====
function initializeFilters() {
    // Configurar filtros
    const categoryFilter = document.getElementById('categoryFilter');
    const sortFilter = document.getElementById('sortFilter');
    const priceRange = document.getElementById('priceRange');
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterProducts);
    }
    
    if (sortFilter) {
        sortFilter.addEventListener('change', filterProducts);
    }
    
    if (priceRange) {
        priceRange.addEventListener('input', function() {
            document.getElementById('rangeValue').textContent = this.value;
            filterProducts();
        });
    }
}

function filterProducts() {
    const category = document.getElementById('categoryFilter').value;
    const sort = document.getElementById('sortFilter').value;
    const maxPrice = parseInt(document.getElementById('priceRange').value);
    
    const products = document.querySelectorAll('.product-card');
    
    products.forEach(product => {
        const productCategory = product.getAttribute('data-category');
        const productPrice = parseInt(product.getAttribute('data-price'));
        
        // Filtro de categoria
        const categoryMatch = category === 'all' || productCategory === category;
        
        // Filtro de preço
        const priceMatch = productPrice <= maxPrice;
        
        if (categoryMatch && priceMatch) {
            product.style.display = 'block';
        } else {
            product.style.display = 'none';
        }
    });
    
    // Aplicar ordenação
    sortProducts(sort);
}

function sortProducts(sortType) {
    const grid = document.getElementById('productsGrid');
    const products = Array.from(grid.children);
    
    products.sort((a, b) => {
        switch (sortType) {
            case 'price-asc':
                return parseInt(a.getAttribute('data-price')) - parseInt(b.getAttribute('data-price'));
            case 'price-desc':
                return parseInt(b.getAttribute('data-price')) - parseInt(a.getAttribute('data-price'));
            case 'name':
                return a.getAttribute('data-name').localeCompare(b.getAttribute('data-name'));
            case 'popular':
                // Simular popularidade baseada em badges
                const aPopular = a.querySelector('.product-badge') ? 1 : 0;
                const bPopular = b.querySelector('.product-badge') ? 1 : 0;
                return bPopular - aPopular;
            default:
                return 0;
        }
    });
    
    // Reordenar elementos no DOM
    products.forEach(product => grid.appendChild(product));
}

// ===== CART AND PURCHASE =====
function addToCart(productName, price) {
    const isLoggedIn = localStorage.getItem('eniac_logged_in') === 'true';
    
    if (!isLoggedIn) {
        showNotification('Faça login para resgatar produtos!', 'warning');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
        return;
    }
    
    currentProduct = { name: productName, price: price };
    
    // Atualizar modal
    document.getElementById('modalProductName').textContent = productName;
    document.getElementById('modalProductPrice').textContent = price.toLocaleString();
    
    const remaining = userPoints - price;
    const remainingElement = document.getElementById('remainingPoints');
    
    if (remaining >= 0) {
        remainingElement.innerHTML = `Pontos restantes: <strong style="color: #10b981;">${remaining.toLocaleString()} ⭐</strong>`;
        document.querySelector('.btn-confirm').disabled = false;
    } else {
        remainingElement.innerHTML = `<strong style="color: #ef4444;">Pontos insuficientes! Faltam ${Math.abs(remaining).toLocaleString()} ⭐</strong>`;
        document.querySelector('.btn-confirm').disabled = true;
    }
    
    // Mostrar modal
    document.getElementById('cartModal').style.display = 'block';
}

function confirmPurchase() {
    if (!currentProduct) return;
    
    if (userPoints >= currentProduct.price) {
        userPoints -= currentProduct.price;
        updateUserPointsDisplay();
        
        closeModal();
        showSuccessModal();
        
        showNotification(`${currentProduct.name} resgatado com sucesso!`, 'success');
    } else {
        showNotification('Pontos insuficientes!', 'error');
    }
}

function closeModal() {
    document.getElementById('cartModal').style.display = 'none';
}

function showSuccessModal() {
    document.getElementById('successModal').style.display = 'block';
}

function closeSuccessModal() {
    document.getElementById('successModal').style.display = 'none';
}

// ===== UI UPDATES =====
function updateUserPointsDisplay() {
    const pointsValue = document.querySelector('.points-value');
    if (pointsValue) {
        pointsValue.textContent = userPoints.toLocaleString();
    }
}

function updateProductButtons() {
    // Esta função será chamada após o DOM estar carregado
    setTimeout(() => {
        checkLoginStatus();
    }, 100);
}

function setupEventListeners() {
    // Modal close events
    window.addEventListener('click', function(event) {
        const cartModal = document.getElementById('cartModal');
        const successModal = document.getElementById('successModal');
        
        if (event.target === cartModal) {
            closeModal();
        }
        
        if (event.target === successModal) {
            closeSuccessModal();
        }
    });
    
    // Escape key to close modals
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeModal();
            closeSuccessModal();
        }
    });
}

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after delay
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 4000);
}

function getNotificationColor(type) {
    switch (type) {
        case 'success':
            return '#10b981';
        case 'error':
            return '#ef4444';
        case 'warning':
            return '#f59e0b';
        default:
            return '#1e40af';
    }
}

// ===== GLOBAL FUNCTIONS =====
// Manter compatibilidade com onclick nos botões HTML
window.addToCart = addToCart;
window.confirmPurchase = confirmPurchase;
window.closeModal = closeModal;
window.closeSuccessModal = closeSuccessModal;
window.logout = logout;

