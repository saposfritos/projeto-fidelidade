// Script para a tela de cadastro
document.addEventListener('DOMContentLoaded', function() {
    const API_BASE = 'http://localhost:5001/api';
    
    // Configurar toggle de senha
    const passwordToggle = document.getElementById('passwordToggleRegister');
    const passwordInput = document.getElementById('register-password');
    
    if (passwordToggle && passwordInput) {
        passwordToggle.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            // Trocar ícone
            const eyeIcon = passwordToggle.querySelector('.eye-icon path');
            if (type === 'text') {
                eyeIcon.setAttribute('d', 'M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24');
            } else {
                eyeIcon.setAttribute('d', 'M12 4.5C7 4.5 2.73 7.61 1 12C2.73 16.39 7 19.5 12 19.5S21.27 16.39 23 12C21.27 7.61 17 4.5 12 4.5ZM12 17C9.24 17 7 14.76 7 12S9.24 7 12 7S17 9.24 17 12S14.76 17 12 17ZM12 9C10.34 9 9 10.34 9 12S10.34 15 12 15S15 13.66 15 12S13.66 9 12 9Z');
            }
        });
    }
    
    // Configurar formulário de cadastro
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitButton = registerForm.querySelector('button[type="submit"]');
            const buttonText = submitButton.querySelector('.btn-text');
            const buttonLoader = submitButton.querySelector('.btn-loader');
            
            // Mostrar loading
            buttonText.style.display = 'none';
            buttonLoader.style.display = 'block';
            submitButton.disabled = true;
            
            try {
                const formData = new FormData(registerForm);
                const data = {
                    username: formData.get('register-name'),
                    email: formData.get('register-email'),
                    password: formData.get('register-password')
                };
                
                // Validações básicas
                if (!data.username || !data.email || !data.password) {
                    throw new Error('Todos os campos são obrigatórios');
                }
                
                if (data.password.length < 6) {
                    throw new Error('A senha deve ter pelo menos 6 caracteres');
                }
                
                // Fazer requisição para o backend
                const response = await fetch(`${API_BASE}/auth/register`, {
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
                    showNotification('Cadastro realizado com sucesso! Redirecionando...', 'success');
                    
                    // Limpar formulário
                    registerForm.reset();
                    
                    // Redirecionar após 2 segundos
                    setTimeout(() => {
                        if (window.location.pathname !== '/cadastro.html') {
                            window.location.href = 'cadastro.html';
                        }
                    }, 2000);
                } else {
                    // Erro do servidor
                    throw new Error(result.error || 'Erro no cadastro');
                }
                
            } catch (error) {
                console.error('Erro no cadastro:', error);
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
        
        // Remover após 5 segundos
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideIn 0.3s ease-out reverse';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }
        }, 5000);
    }
});

