// Produtos - JavaScript

// Estado global da aplicação
let userPoints = 0;
let currentProduct = null;
let isLoggedIn = false;
let currentUser = null;

// Inicialização quando a página carrega
document.addEventListener('DOMContentLoaded', function() {
    checkAuthStatus(); // Verificar se usuário está logado
    initializeFilters();
    fetchProducts(); // Buscar produtos do backend
    setupEventListeners();
});

// Verificar status de autenticação
async function checkAuthStatus() {
    try {
        const response = await fetch('/api/auth/me', {
            credentials: 'include'
        });
        
        if (response.ok) {
            currentUser = await response.json();
            isLoggedIn = true;
            userPoints = currentUser.points;
            updateUserPointsDisplay();
            updateAuthUI();
        } else {
            isLoggedIn = false;
            userPoints = 0;
            updateUserPointsDisplay();
            updateAuthUI();
        }
    } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        isLoggedIn = false;
        userPoints = 0;
        updateUserPointsDisplay();
        updateAuthUI();
    }
}

// Atualizar interface baseada no status de autenticação
function updateAuthUI() {
    const authSection = document.querySelector('.user-info');
    if (authSection) {
        if (isLoggedIn) {
            authSection.innerHTML = `
                <div class="user-welcome" style="display: flex; align-items: center; gap: 10px; margin-top: 10px;">
                    <span style="color: #0b1e7e; font-weight: 600;">Olá, ${currentUser.username}!</span>
                    <button onclick="logout()" class="logout-btn" style="background: #dc2626; color: white; padding: 5px 10px; border: none; border-radius: 5px; cursor: pointer; font-size: 12px;">Sair</button>
                </div>
            `;
        } else {
            authSection.innerHTML = `
                <div class="auth-prompt" style="display: flex; align-items: center; gap: 10px; margin-top: 10px;">
                    <span style="color: #dc2626; font-weight: 600;">Faça login para trocar pontos</span>
                    <a href="login.html" class="login-btn" style="background: #2563eb; color: white; padding: 5px 10px; border-radius: 5px; text-decoration: none; font-size: 12px;">Entrar</a>
                </div>
            `;
        }
    }
}

// Função de logout
async function logout() {
    try {
        await fetch('/api/auth/logout', {
            method: 'POST',
            credentials: 'include'
        });
        isLoggedIn = false;
        currentUser = null;
        userPoints = 0;
        updateUserPointsDisplay();
        updateAuthUI();
        showNotification('Logout realizado com sucesso!', 'success');
        // Recarregar produtos para atualizar botões
        fetchProducts();
    } catch (error) {
        console.error('Erro no logout:', error);
    }
}

// Configurar event listeners
function setupEventListeners() {
    // Filtros
    document.getElementById('categoryFilter').addEventListener('change', fetchProducts);
    document.getElementById('sortFilter').addEventListener('change', fetchProducts);
    
    // Range slider
    const priceRange = document.getElementById('priceRange');
    priceRange.addEventListener('input', function() {
        document.getElementById('rangeValue').textContent = this.value;
        fetchProducts();
    });
    
    // Modal events
    document.getElementById('cartModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeModal();
        }
    });
    
    document.getElementById('successModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeSuccessModal();
        }
    });
    
    // Keyboard events
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
            closeSuccessModal();
        }
    });
}

// Inicializar filtros
function initializeFilters() {
    const priceRange = document.getElementById('priceRange');
    // Max price will be set after fetching products
    priceRange.value = 0; // Set initial value to 0 or min
    document.getElementById('rangeValue').textContent = 0;
}

// Atualizar display dos pontos do usuário
function updateUserPointsDisplay() {
    const pointsValue = document.querySelector('.points-value');
    if (pointsValue) {
        pointsValue.textContent = userPoints.toLocaleString('pt-BR');
    }
}

// Buscar produtos do backend
async function fetchProducts() {
    const category = document.getElementById('categoryFilter').value;
    const sortBy = document.getElementById('sortFilter').value;
    const maxPrice = parseInt(document.getElementById('priceRange').value);

    let url = `/api/products?category=${category}&sort=${sortBy}`;
    if (maxPrice > 0) {
        url += `&max_price=${maxPrice}`;
    }

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const products = await response.json();
        currentProducts = products; // Armazenar produtos
        updateProductsDisplay(products);
        
        // Update max price for range slider after fetching products
        const priceRange = document.getElementById('priceRange');
        const currentMaxPrice = Math.max(...products.map(p => p.price), 0);
        if (priceRange.max < currentMaxPrice) {
            priceRange.max = currentMaxPrice;
            priceRange.value = currentMaxPrice;
            document.getElementById('rangeValue').textContent = currentMaxPrice;
        }
    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        // Se não conseguir buscar do backend, usar produtos estáticos para demonstração
        const staticProducts = getStaticProducts();
        currentProducts = staticProducts;
        updateProductsDisplay(staticProducts);
        
        // Update max price for range slider
        const priceRange = document.getElementById('priceRange');
        const currentMaxPrice = Math.max(...staticProducts.map(p => p.price), 0);
        if (priceRange.max < currentMaxPrice) {
            priceRange.max = currentMaxPrice;
            priceRange.value = currentMaxPrice;
            document.getElementById('rangeValue').textContent = currentMaxPrice;
        }
    }
}

// Produtos estáticos para demonstração quando o backend não estiver disponível
function getStaticProducts() {
    return [
        {
            id: 1,
            name: "Fone Bluetooth Premium",
            description: "Fone de ouvido sem fio com cancelamento de ruído e bateria de longa duração.",
            price: 850,
            category: "electronics",
            image_url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop&crop=center",
            stock: 5,
            badge: "Popular"
        },
        {
            id: 2,
            name: "Livro: Python para Iniciantes",
            description: "Guia completo para aprender programação Python do básico ao avançado.",
            price: 300,
            category: "books",
            image_url: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=300&fit=crop&crop=center",
            stock: 10,
            badge: null
        },
        {
            id: 3,
            name: "Mochila Escolar Premium",
            description: "Mochila resistente com compartimentos para notebook e materiais escolares.",
            price: 450,
            category: "accessories",
            image_url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop&crop=center",
            stock: 8,
            badge: null
        },
        {
            id: 4,
            name: "Vale Lanchonete R$ 20",
            description: "Voucher para usar na lanchonete da escola. Válido por 30 dias.",
            price: 200,
            category: "vouchers",
            image_url: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=300&h=300&fit=crop&crop=center",
            stock: 20,
            badge: "Novo"
        },
        {
            id: 5,
            name: "Tablet 10\" Android",
            description: "Tablet com tela de 10 polegadas, ideal para estudos e entretenimento.",
            price: 1200,
            category: "electronics",
            image_url: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300&h=300&fit=crop&crop=center",
            stock: 3,
            badge: null
        },
        {
            id: 6,
            name: "Kit Canetas Coloridas",
            description: "Conjunto com 24 canetas coloridas para desenho e anotações.",
            price: 150,
            category: "accessories",
            image_url: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=300&h=300&fit=crop&crop=center",
            stock: 15,
            badge: null
        },
        {
            id: 7,
            name: "Vale Cinema - 2 Ingressos",
            description: "Dois ingressos para qualquer sessão no cinema. Válido por 60 dias.",
            price: 500,
            category: "vouchers",
            image_url: "https://images.unsplash.com/photo-1489185078527-20140f217ade?w=300&h=300&fit=crop&crop=center",
            stock: 12,
            badge: null
        },
        {
            id: 8,
            name: "Revista Científica Anual",
            description: "Assinatura anual da revista de divulgação científica mais popular do país.",
            price: 250,
            category: "books",
            image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=center",
            stock: 25,
            badge: null
        }
    ];
}

// Atualizar display dos produtos
function updateProductsDisplay(products) {
    const productsGrid = document.getElementById('productsGrid');
    
    if (products.length === 0) {
        productsGrid.innerHTML = `
            <div class="no-products" style="grid-column: 1 / -1; text-align: center; padding: 40px;">
                <p style="font-size: 18px; color: #6b7280;">Nenhum produto encontrado com os filtros selecionados.</p>
            </div>
        `;
        return;
    }
    
    productsGrid.innerHTML = products.map(product => `
        <div class="product-card" data-product-id="${product.id}">
            <div class="product-image">
                <img src="${product.image_url}" alt="${product.name}" loading="lazy">
                ${product.badge ? `<div class="product-badge ${product.badge.toLowerCase()}">${product.badge}</div>` : ''}
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price">
                    <span class="price-stars">⭐</span>
                    <span class="price-value">${product.price.toLocaleString('pt-BR')}</span>
                    <span class="price-label">pontos</span>
                </div>
                <button class="btn-add-cart" 
                        onclick="${isLoggedIn ? `openModal(${product.id})` : 'showLoginRequired()'}" 
                        ${!isLoggedIn ? 'disabled style="background-color: #9ca3af; cursor: not-allowed;" title="Faça login para trocar pontos"' : ''}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16.5 5.1 16.5H17M17 13V17C17 18.1 16.1 19 15 19H9C7.9 19 7 18.1 7 17V13H17Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    ${!isLoggedIn ? 'Login necessário' : 'Resgatar'}
                </button>
                <div class="product-stock" style="margin-top: 8px; font-size: 12px; color: #6b7280;">
                    Estoque: ${product.stock} unidades
                </div>
            </div>
        </div>
    `).join('');
}

// Função para mostrar que login é necessário
function showLoginRequired() {
    showNotification('Faça login para trocar pontos por produtos!', 'error');
}

// Abrir modal de confirmação
function openModal(productId) {
    if (!isLoggedIn) {
        showNotification('Faça login para trocar pontos por produtos!', 'error');
        return;
    }
    
    const product = currentProducts.find(p => p.id === productId);
    if (!product) return;
    
    currentProduct = product;
    
    // Verificar se o usuário tem pontos suficientes
    if (userPoints < product.price) {
        showNotification(`Você precisa de ${(product.price - userPoints).toLocaleString('pt-BR')} pontos a mais para resgatar este produto.`, 'error');
        return;
    }
    
    // Verificar estoque
    if (product.stock <= 0) {
        showNotification('Este produto está fora de estoque.', 'error');
        return;
    }
    
    // Preencher modal
    document.getElementById('modalProductName').textContent = product.name;
    document.getElementById('modalProductPrice').textContent = product.price.toLocaleString('pt-BR');
    document.getElementById('modalCurrentPoints').textContent = userPoints.toLocaleString('pt-BR');
    document.getElementById('modalRemainingPoints').textContent = (userPoints - product.price).toLocaleString('pt-BR');
    
    // Mostrar modal
    document.getElementById('cartModal').style.display = 'flex';
}

// Fechar modal
function closeModal() {
    document.getElementById('cartModal').style.display = 'none';
    currentProduct = null;
}

// Confirmar resgate
async function confirmRedeem() {
    if (!currentProduct || !isLoggedIn) return;
    
    try {
        const response = await fetch(`/api/products/${currentProduct.id}/redeem`, {
            method: 'POST',
            credentials: 'include'
        });
        
        const result = await response.json();
        
        if (response.ok) {
            // Atualizar pontos do usuário
            userPoints = result.remaining_points;
            updateUserPointsDisplay();
            
            // Fechar modal de confirmação
            closeModal();
            
            // Mostrar modal de sucesso
            document.getElementById('successProductName').textContent = currentProduct.name;
            document.getElementById('successPointsSpent').textContent = result.points_spent.toLocaleString('pt-BR');
            document.getElementById('successRemainingPoints').textContent = result.remaining_points.toLocaleString('pt-BR');
            document.getElementById('successModal').style.display = 'flex';
            
            // Recarregar produtos para atualizar estoque
            fetchProducts();
            
        } else {
            showNotification(result.error || 'Erro ao resgatar produto', 'error');
        }
    } catch (error) {
        console.error('Erro ao resgatar produto:', error);
        showNotification('Erro ao resgatar produto. Tente novamente.', 'error');
    }
}

// Fechar modal de sucesso
function closeSuccessModal() {
    document.getElementById('successModal').style.display = 'none';
}

// Mostrar notificação
function showNotification(message, type = 'info') {
    // Criar elemento de notificação
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Estilo da notificação
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        color: white;
        font-weight: 600;
        z-index: 10000;
        max-width: 300px;
        word-wrap: break-word;
    `;
    
    // Cores baseadas no tipo
    if (type === 'error') {
        notification.style.backgroundColor = '#dc2626';
    } else if (type === 'success') {
        notification.style.backgroundColor = '#16a34a';
    } else {
        notification.style.backgroundColor = '#2563eb';
    }
    
    // Adicionar ao body
    document.body.appendChild(notification);
    
    // Remover após 5 segundos
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 5000);
}

// Variável global para armazenar produtos atuais
let currentProducts = [];

