// Produtos - JavaScript

// Estado global da aplicação
let userPoints = 1250;
let currentProduct = null;

// Dados dos produtos (simulando uma base de dados)
const productsData = [
    {
        id: 1,
        name: 'Fone Bluetooth Premium',
        category: 'electronics',
        price: 850,
        description: 'Fone de ouvido sem fio com cancelamento de ruído e bateria de longa duração.',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop&crop=center',
        badge: 'Popular',
        stock: 5
    },
    {
        id: 2,
        name: 'Livro: Python para Iniciantes',
        category: 'books',
        price: 300,
        description: 'Guia completo para aprender programação Python do básico ao avançado.',
        image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=300&fit=crop&crop=center',
        stock: 10
    },
    {
        id: 3,
        name: 'Mochila Escolar Premium',
        category: 'accessories',
        price: 450,
        description: 'Mochila resistente com compartimentos para notebook e materiais escolares.',
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop&crop=center',
        stock: 8
    },
    {
        id: 4,
        name: 'Vale Lanchonete R$ 20',
        category: 'vouchers',
        price: 200,
        description: 'Voucher para usar na lanchonete da escola. Válido por 30 dias.',
        image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=300&h=300&fit=crop&crop=center',
        badge: 'Novo',
        stock: 20
    },
    {
        id: 5,
        name: 'Tablet 10" Android',
        category: 'electronics',
        price: 1200,
        description: 'Tablet com tela de 10 polegadas, ideal para estudos e entretenimento.',
        image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300&h=300&fit=crop&crop=center',
        stock: 3
    },
    {
        id: 6,
        name: 'Kit Canetas Coloridas',
        category: 'accessories',
        price: 150,
        description: 'Conjunto com 24 canetas coloridas para desenho e anotações.',
        image: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=300&h=300&fit=crop&crop=center',
        stock: 15
    },
    {
        id: 7,
        name: 'Vale Cinema - 2 Ingressos',
        category: 'vouchers',
        price: 500,
        description: 'Dois ingressos para qualquer sessão no cinema. Válido por 60 dias.',
        image: 'https://images.unsplash.com/photo-1489185078527-20140f217ade?w=300&h=300&fit=crop&crop=center',
        stock: 12
    },
    {
        id: 8,
        name: 'Revista Científica Anual',
        category: 'books',
        price: 250,
        description: 'Assinatura anual da revista de divulgação científica mais popular do país.',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=center',
        stock: 6
    }
];

// Inicialização quando a página carrega
document.addEventListener('DOMContentLoaded', function() {
    initializeFilters();
    updateProductsDisplay();
    updateUserPointsDisplay();
    setupEventListeners();
});

// Configurar event listeners
function setupEventListeners() {
    // Filtros
    document.getElementById('categoryFilter').addEventListener('change', filterProducts);
    document.getElementById('sortFilter').addEventListener('change', filterProducts);
    
    // Range slider
    const priceRange = document.getElementById('priceRange');
    priceRange.addEventListener('input', function() {
        document.getElementById('rangeValue').textContent = this.value;
        filterProducts();
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
    const maxPrice = Math.max(...productsData.map(p => p.price));
    priceRange.max = maxPrice;
    priceRange.value = maxPrice;
    document.getElementById('rangeValue').textContent = maxPrice;
}

// Atualizar display dos pontos do usuário
function updateUserPointsDisplay() {
    const pointsValue = document.querySelector('.points-value');
    if (pointsValue) {
        pointsValue.textContent = userPoints.toLocaleString('pt-BR');
    }
}

// Filtrar produtos
function filterProducts() {
    const category = document.getElementById('categoryFilter').value;
    const sortBy = document.getElementById('sortFilter').value;
    const maxPrice = parseInt(document.getElementById('priceRange').value);
    
    let filteredProducts = [...productsData];
    
    // Filtrar por categoria
    if (category !== 'all') {
        filteredProducts = filteredProducts.filter(product => product.category === category);
    }
    
    // Filtrar por preço
    filteredProducts = filteredProducts.filter(product => product.price <= maxPrice);
    
    // Ordenar
    switch (sortBy) {
        case 'price-asc':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'name':
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'popular':
            // Ordenar por badge "Popular" primeiro, depois por preço
            filteredProducts.sort((a, b) => {
                if (a.badge === 'Popular' && b.badge !== 'Popular') return -1;
                if (b.badge === 'Popular' && a.badge !== 'Popular') return 1;
                return a.price - b.price;
            });
            break;
    }
    
    updateProductsDisplay(filteredProducts);
}

// Atualizar display dos produtos
function updateProductsDisplay(products = productsData) {
    const productsGrid = document.getElementById('productsGrid');
    
    if (products.length === 0) {
        productsGrid.innerHTML = `
            <div class="no-products">
                <div class="no-products-icon">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-3-3V6a3 3 0 00-3-3H6a3 3 0 00-3 3v3m6 0a3 3 0 013 3v3a3 3 0 01-3 3H6a3 3 0 01-3-3v-3a3 3 0 013-3z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <h3>Nenhum produto encontrado</h3>
                <p>Tente ajustar os filtros para encontrar produtos disponíveis.</p>
            </div>
        `;
        return;
    }
    
    productsGrid.innerHTML = products.map(product => `
        <div class="product-card ${userPoints < product.price ? 'insufficient-points' : ''}" 
             data-category="${product.category}" 
             data-price="${product.price}" 
             data-name="${product.name}">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
                ${product.badge ? `<div class="product-badge ${product.badge === 'Novo' ? 'new' : ''}">${product.badge}</div>` : ''}
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
                        onclick="addToCart('${product.name}', ${product.price})"
                        ${userPoints < product.price ? 'disabled' : ''}
                        ${product.stock === 0 ? 'disabled' : ''}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16.5 5.1 16.5H17M17 13V17C17 18.1 16.1 19 15 19H9C7.9 19 7 18.1 7 17V13H17Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    ${product.stock === 0 ? 'Esgotado' : userPoints < product.price ? 'Pontos Insuficientes' : 'Resgatar'}
                </button>
            </div>
        </div>
    `).join('');
    
    // Adicionar animação aos cards
    const cards = productsGrid.querySelectorAll('.product-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
}

// Adicionar produto ao carrinho (abrir modal)
function addToCart(productName, price) {
    if (userPoints < price) {
        showNotification('Você não tem pontos suficientes para este produto!', 'error');
        return;
    }
    
    currentProduct = { name: productName, price: price };
    
    // Atualizar modal
    document.getElementById('modalProductName').textContent = productName;
    document.getElementById('modalProductPrice').textContent = price.toLocaleString('pt-BR');
    
    const remainingPoints = userPoints - price;
    document.getElementById('remainingPoints').innerHTML = 
        `Pontos restantes após o resgate: <strong>${remainingPoints.toLocaleString('pt-BR')} ⭐</strong>`;
    
    // Mostrar modal
    const modal = document.getElementById('cartModal');
    modal.classList.add('show');
    modal.style.display = 'flex';
    
    // Focar no botão de confirmar
    setTimeout(() => {
        document.querySelector('.btn-confirm').focus();
    }, 100);
}

// Fechar modal
function closeModal() {
    const modal = document.getElementById('cartModal');
    modal.classList.remove('show');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
    currentProduct = null;
}

// Confirmar compra
function confirmPurchase() {
    if (!currentProduct) return;
    
    // Simular processamento
    const confirmBtn = document.querySelector('.btn-confirm');
    const originalText = confirmBtn.textContent;
    confirmBtn.textContent = 'Processando...';
    confirmBtn.disabled = true;
    
    setTimeout(() => {
        // Deduzir pontos
        userPoints -= currentProduct.price;
        updateUserPointsDisplay();
        
        // Atualizar estoque (simulado)
        const productData = productsData.find(p => p.name === currentProduct.name);
        if (productData) {
            productData.stock--;
        }
        
        // Fechar modal de confirmação
        closeModal();
        
        // Mostrar modal de sucesso
        showSuccessModal();
        
        // Atualizar display dos produtos
        filterProducts();
        
        // Salvar no localStorage (simulando persistência)
        saveUserData();
        
        // Reset button
        confirmBtn.textContent = originalText;
        confirmBtn.disabled = false;
        
    }, 1500);
}

// Mostrar modal de sucesso
function showSuccessModal() {
    const modal = document.getElementById('successModal');
    modal.classList.add('show');
    modal.style.display = 'flex';
    
    // Auto-fechar após 3 segundos
    setTimeout(() => {
        closeSuccessModal();
    }, 3000);
}

// Fechar modal de sucesso
function closeSuccessModal() {
    const modal = document.getElementById('successModal');
    modal.classList.remove('show');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}

// Mostrar notificação
function showNotification(message, type = 'info') {
    // Criar elemento de notificação
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    // Adicionar estilos se não existirem
    if (!document.getElementById('notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10001;
                max-width: 400px;
                padding: 16px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                animation: slideInRight 0.3s ease-out;
            }
            .notification-error {
                background: #fee2e2;
                border-left: 4px solid #ef4444;
                color: #991b1b;
            }
            .notification-success {
                background: #dcfce7;
                border-left: 4px solid #22c55e;
                color: #166534;
            }
            .notification-info {
                background: #dbeafe;
                border-left: 4px solid #3b82f6;
                color: #1e40af;
            }
            .notification-content {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 12px;
            }
            .notification-close {
                background: none;
                border: none;
                font-size: 18px;
                cursor: pointer;
                opacity: 0.7;
                transition: opacity 0.2s;
            }
            .notification-close:hover {
                opacity: 1;
            }
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(styles);
    }
    
    // Adicionar ao DOM
    document.body.appendChild(notification);
    
    // Auto-remover após 5 segundos
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Salvar dados do usuário (simulado)
function saveUserData() {
    const userData = {
        points: userPoints,
        lastUpdate: new Date().toISOString()
    };
    localStorage.setItem('eniac_user_data', JSON.stringify(userData));
}

// Carregar dados do usuário (simulado)
function loadUserData() {
    const userData = localStorage.getItem('eniac_user_data');
    if (userData) {
        const data = JSON.parse(userData);
        userPoints = data.points || 1250;
    }
}

// Adicionar estilos para produtos sem estoque ou pontos insuficientes
const additionalStyles = `
    .no-products {
        grid-column: 1 / -1;
        text-align: center;
        padding: 60px 20px;
        color: var(--gray-600);
    }
    
    .no-products-icon {
        width: 64px;
        height: 64px;
        margin: 0 auto 20px;
        color: var(--gray-400);
    }
    
    .no-products h3 {
        font-size: var(--font-size-xl);
        font-weight: 600;
        color: var(--gray-700);
        margin-bottom: 8px;
    }
    
    .no-products p {
        font-size: var(--font-size-base);
        color: var(--gray-500);
    }
`;

// Adicionar estilos adicionais
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Carregar dados do usuário ao inicializar
loadUserData();

// Função para simular ganho de pontos (para testes)
function addPoints(amount) {
    userPoints += amount;
    updateUserPointsDisplay();
    saveUserData();
    showNotification(`Você ganhou ${amount} pontos!`, 'success');
    filterProducts(); // Atualizar produtos disponíveis
}

// Função para resetar pontos (para testes)
function resetPoints() {
    userPoints = 1250;
    updateUserPointsDisplay();
    saveUserData();
    filterProducts();
    showNotification('Pontos resetados para 1.250!', 'info');
}

// Expor funções globalmente para debug (remover em produção)
window.addPoints = addPoints;
window.resetPoints = resetPoints;

