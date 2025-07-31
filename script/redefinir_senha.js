// Script para a tela de redefinir senha
document.addEventListener('DOMContentLoaded', function() {
    const API_BASE = 'http://localhost:5001/api';
    
    // Configurar formulário de redefinir senha
    const resetForm = document.getElementById('reset-form');
    if (resetForm) {
        resetForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitButton = resetForm.querySelector('button[type="submit"]');
            const buttonText = submitButton.querySelector('.btn-text');
            const buttonLoader = submitButton.querySelector('.btn-loader');
            
            // Mostrar loading
            buttonText.style.display = 'none';
            buttonLoader.style.display = 'block';
            submitButton.disabled = true;
            
            try {
                const formData = new FormData(resetForm);
                const data = {
                    email: formData.get('reset-email')
                };
                
                // Validações básicas
                if (!data.email) {
                    throw new Error('E-mail é obrigatório');
                }
                
                // Validar formato do e-mail
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(data.email)) {
                    throw new Error('Formato de e-mail inválido');
                }
                
                // Fazer requisição para o backend
                const response = await fetch(`${API_BASE}/auth/reset-password`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify(data)
                });
                
                const result = await response.json();
                
                if (response.ok) {
                    // Sucesso
                    showNotification('Se o e-mail estiver cadastrado, você receberá instruções para redefinir sua senha.', 'success');
                    
                    // Limpar formulário
                    resetForm.reset();
                    
                    // Redirecionar após 3 segundos
                    setTimeout(() => {
                        if (window.location.pathname !== '/redefinir_senha.html') {
                            window.location.href = 'redefinir_senha.html';
                        }
                    }, 3000);
                } else {
                    // Erro do servidor
                    throw new Error(result.error || 'Erro ao enviar solicitação');
                }
                
            } catch (error) {
                console.error('Erro na redefinição de senha:', error);
                showNotification(error.message, 'error');
            } finally {
                // Restaurar botão
                buttonText.style.display = 'block';
                buttonLoader.style.display = 'none';
                submitButton.disabled = false;
            }
        });
    }
    
    // Função para mostrar notificações
    function showNotification(message, type = 'info') {
        // Remover notificações existentes
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(n => n.remove());
        
        // Criar nova notificação
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Estilo da notificação
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 600;
            z-index: 10000;
            max-width: 350px;
            word-wrap: break-word;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            animation: slideIn 0.3s ease-out;
        `;
        
        // Cores baseadas no tipo
        if (type === 'error') {
            notification.style.backgroundColor = '#dc2626';
        } else if (type === 'success') {
            notification.style.backgroundColor = '#16a34a';
        } else {
            notification.style.backgroundColor = '#2563eb';
        }
        
        // Adicionar animação CSS
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
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
        document.head.appendChild(style);
        
        // Adicionar ao body
        document.body.appendChild(notification);
        
        // Remover após 6 segundos (mais tempo para mensagem de sucesso)
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideIn 0.3s ease-out reverse';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }
        }, 6000);
    }
});

