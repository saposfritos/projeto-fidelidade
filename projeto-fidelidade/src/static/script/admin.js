// Admin Panel JavaScript
class AdminPanel {
    constructor() {
        this.currentEditingId = null;
        this.currentDeletingId = null;
        this.init();
    }

    init() {
        this.checkAdminAccess();
        this.bindEvents();
        this.loadStats();
        this.loadProducts();
    }

    async checkAdminAccess() {
        try {
            const response = await fetch('/api/admin/check');
            const data = await response.json();
            
            if (!data.is_admin) {
                alert('Acesso negado. Você precisa ser um administrador para acessar esta página.');
                window.location.href = 'login.html';
                return;
            }
        } catch (error) {
            console.error('Erro ao verificar acesso admin:', error);
            window.location.href = 'login.html';
        }
    }

    bindEvents() {
        // Modal events
        document.getElementById('addProductBtn').addEventListener('click', () => this.openProductModal());
        document.getElementById('modalClose').addEventListener('click', () => this.closeProductModal());
        document.getElementById('cancelBtn').addEventListener('click', () => this.closeProductModal());
        document.getElementById('productForm').addEventListener('submit', (e) => this.handleProductSubmit(e));

        // Delete modal events
        document.getElementById('deleteModalClose').addEventListener('click', () => this.closeDeleteModal());
        document.getElementById('cancelDeleteBtn').addEventListener('click', () => this.closeDeleteModal());
        document.getElementById('confirmDeleteBtn').addEventListener('click', () => this.confirmDelete());

        // Logout
        document.getElementById('logoutBtn').addEventListener('click', () => this.logout());

        // Close modal when clicking outside
        document.getElementById('productModal').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) this.closeProductModal();
        });
        document.getElementById('deleteModal').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) this.closeDeleteModal();
        });
    }

    async loadStats() {
        try {
            const response = await fetch('/api/admin/stats');
            const stats = await response.json();

            document.getElementById('totalProducts').textContent = stats.total_products;
            document.getElementById('totalUsers').textContent = stats.total_users;
            document.getElementById('totalTransactions').textContent = stats.total_transactions;
            document.getElementById('lowStockProducts').textContent = stats.low_stock_products;
        } catch (error) {
            console.error('Erro ao carregar estatísticas:', error);
        }
    }

    async loadProducts() {
        try {
            const response = await fetch('/api/admin/products');
            const products = await response.json();

            this.renderProductsTable(products);
        } catch (error) {
            console.error('Erro ao carregar produtos:', error);
            this.showError('Erro ao carregar produtos');
        }
    }

    renderProductsTable(products) {
        const tbody = document.getElementById('productsTableBody');
        tbody.innerHTML = '';

        if (products.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; padding: 2rem; color: #6b7280;">
                        Nenhum produto encontrado
                    </td>
                </tr>
            `;
            return;
        }

        products.forEach(product => {
            const row = document.createElement('tr');
            
            // Determine stock status
            let stockStatus = 'in-stock';
            let stockText = 'Em Estoque';
            if (product.stock === 0) {
                stockStatus = 'out-of-stock';
                stockText = 'Sem Estoque';
            } else if (product.stock <= 5) {
                stockStatus = 'low-stock';
                stockText = 'Estoque Baixo';
            }

            row.innerHTML = `
                <td>${product.id}</td>
                <td>
                    <div style="font-weight: 500;">${this.escapeHtml(product.name)}</div>
                    ${product.badge ? `<span style="font-size: 0.75rem; color: #6b7280;">${this.escapeHtml(product.badge)}</span>` : ''}
                </td>
                <td>${this.escapeHtml(product.category)}</td>
                <td>${product.price}</td>
                <td>${product.stock}</td>
                <td>
                    <span class="status-badge ${stockStatus}">${stockText}</span>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-icon edit" onclick="adminPanel.editProduct(${product.id})" title="Editar">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M18.5 2.50023C18.8978 2.1024 19.4374 1.87891 20 1.87891C20.5626 1.87891 21.1022 2.1024 21.5 2.50023C21.8978 2.89805 22.1213 3.43762 22.1213 4.00023C22.1213 4.56284 21.8978 5.1024 21.5 5.50023L12 15.0002L8 16.0002L9 12.0002L18.5 2.50023Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </button>
                        <button class="btn-icon delete" onclick="adminPanel.deleteProduct(${product.id}, '${this.escapeHtml(product.name)}')" title="Excluir">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3 6H5H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M10 11V17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M14 11V17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </button>
                    </div>
                </td>
            `;
            
            tbody.appendChild(row);
        });
    }

    openProductModal(product = null) {
        const modal = document.getElementById('productModal');
        const form = document.getElementById('productForm');
        const title = document.getElementById('modalTitle');

        if (product) {
            // Edit mode
            title.textContent = 'Editar Produto';
            this.currentEditingId = product.id;
            
            // Fill form with product data
            document.getElementById('productName').value = product.name;
            document.getElementById('productDescription').value = product.description || '';
            document.getElementById('productPrice').value = product.price;
            document.getElementById('productStock').value = product.stock;
            document.getElementById('productCategory').value = product.category;
            document.getElementById('productBadge').value = product.badge || '';
            document.getElementById('productImageUrl').value = product.image_url || '';
        } else {
            // Add mode
            title.textContent = 'Adicionar Produto';
            this.currentEditingId = null;
            form.reset();
        }

        modal.classList.add('active');
    }

    closeProductModal() {
        const modal = document.getElementById('productModal');
        modal.classList.remove('active');
        this.currentEditingId = null;
    }

    async handleProductSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // Convert numeric fields
        data.price = parseInt(data.price);
        data.stock = parseInt(data.stock);

        // Remove empty badge
        if (!data.badge) {
            delete data.badge;
        }

        try {
            const url = this.currentEditingId 
                ? `/api/admin/products/${this.currentEditingId}`
                : '/api/admin/products';
            
            const method = this.currentEditingId ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.ok) {
                this.showSuccess(result.message);
                this.closeProductModal();
                this.loadProducts();
                this.loadStats();
            } else {
                this.showError(result.error || 'Erro ao salvar produto');
            }
        } catch (error) {
            console.error('Erro ao salvar produto:', error);
            this.showError('Erro ao salvar produto');
        }
    }

    async editProduct(productId) {
        try {
            const response = await fetch(`/api/products/${productId}`);
            const product = await response.json();

            if (response.ok) {
                this.openProductModal(product);
            } else {
                this.showError('Erro ao carregar dados do produto');
            }
        } catch (error) {
            console.error('Erro ao carregar produto:', error);
            this.showError('Erro ao carregar produto');
        }
    }

    deleteProduct(productId, productName) {
        this.currentDeletingId = productId;
        document.getElementById('deleteProductName').textContent = productName;
        document.getElementById('deleteModal').classList.add('active');
    }

    closeDeleteModal() {
        document.getElementById('deleteModal').classList.remove('active');
        this.currentDeletingId = null;
    }

    async confirmDelete() {
        if (!this.currentDeletingId) return;

        try {
            const response = await fetch(`/api/admin/products/${this.currentDeletingId}`, {
                method: 'DELETE'
            });

            const result = await response.json();

            if (response.ok) {
                this.showSuccess(result.message);
                this.closeDeleteModal();
                this.loadProducts();
                this.loadStats();
            } else {
                this.showError(result.error || 'Erro ao excluir produto');
            }
        } catch (error) {
            console.error('Erro ao excluir produto:', error);
            this.showError('Erro ao excluir produto');
        }
    }

    async logout() {
        try {
            const response = await fetch('/api/logout', { method: 'POST' });
            if (response.ok) {
                window.location.href = 'login.html';
            }
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
            window.location.href = 'login.html';
        }
    }

    showSuccess(message) {
        // Simple alert for now - could be replaced with a toast notification
        alert(message);
    }

    showError(message) {
        // Simple alert for now - could be replaced with a toast notification
        alert('Erro: ' + message);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize admin panel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.adminPanel = new AdminPanel();
});

