// Login Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initLoginForm();
    initPasswordToggle();
    initFormValidation();
    initLoginAnimations();
    
    console.log('🔐 Login page loaded successfully!');
});

// ===== LOGIN FORM HANDLING =====
function initLoginForm() {
    const loginForm = document.getElementById('loginForm');
    const loginBtn = document.querySelector('.login-btn');
    const btnText = document.querySelector('.btn-text');
    const btnLoader = document.querySelector('.btn-loader');

    if (!loginForm) return;

    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const remember = document.getElementById('remember').checked;

        // Validate form
        if (!validateLoginForm(email, password)) {
            return;
        }

        // Show loading state
        setLoadingState(true);

        try {
            // Simulate API call
            await simulateLogin(email, password, remember);
            
            // Success
            showNotification('✅ Login realizado com sucesso!', 'success');
            
            // Redirect after delay
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
            
        } catch (error) {
            showNotification('❌ Credenciais inválidas. Tente novamente.', 'error');
            setLoadingState(false);
        }
    });

    function setLoadingState(loading) {
        if (loading) {
            loginBtn.classList.add('loading');
            loginBtn.disabled = true;
            btnText.style.opacity = '0';
            btnLoader.style.display = 'block';
        } else {
            loginBtn.classList.remove('loading');
            loginBtn.disabled = false;
            btnText.style.opacity = '1';
            btnLoader.style.display = 'none';
        }
    }

    async function simulateLogin(email, password, remember) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Simulate validation (in real app, this would be server-side)
        if (email === 'admin@eniac.edu.br' && password === 'admin123') {
            // Store login state if remember is checked
            if (remember) {
                localStorage.setItem('eniac_remember', 'true');
                localStorage.setItem('eniac_user', email);
            }
            return { success: true };
        } else {
            throw new Error('Invalid credentials');
        }
    }
}

// ===== PASSWORD TOGGLE =====
function initPasswordToggle() {
    const passwordToggle = document.getElementById('passwordToggle');
    const passwordInput = document.getElementById('password');
    const eyeIcon = passwordToggle?.querySelector('.eye-icon');

    if (!passwordToggle || !passwordInput) return;

    passwordToggle.addEventListener('click', function() {
        const isPassword = passwordInput.type === 'password';
        
        passwordInput.type = isPassword ? 'text' : 'password';
        
        // Update icon
        if (eyeIcon) {
            eyeIcon.innerHTML = isPassword ? 
                // Eye slash icon (hidden)
                `<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20C7 20 2.73 16.39 1 12A23.45 23.45 0 0 1 5.06 5.06L17.94 17.94ZM9.9 4.24A9.12 9.12 0 0 1 12 4C17 4 21.27 7.61 23 12A23.45 23.45 0 0 1 19.94 18.94L9.9 4.24Z" fill="currentColor"/><path d="M14.12 14.12A3 3 0 1 1 9.88 9.88L14.12 14.12Z" fill="currentColor"/><path d="M1 1L23 23" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>` :
                // Eye icon (visible)
                `<path d="M12 4.5C7 4.5 2.73 7.61 1 12C2.73 16.39 7 19.5 12 19.5S21.27 16.39 23 12C21.27 7.61 17 4.5 12 4.5ZM12 17C9.24 17 7 14.76 7 12S9.24 7 12 7S17 9.24 17 12S14.76 17 12 17ZM12 9C10.34 9 9 10.34 9 12S10.34 15 12 15S15 13.66 15 12S13.66 9 12 9Z" fill="currentColor"/>`;
        }

        // Add visual feedback
        passwordToggle.style.transform = 'scale(0.95)';
        setTimeout(() => {
            passwordToggle.style.transform = 'scale(1)';
        }, 100);
    });
}

// ===== FORM VALIDATION =====
function initFormValidation() {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    if (!emailInput || !passwordInput) return;

    // Real-time validation
    emailInput.addEventListener('blur', () => validateEmail(emailInput));
    passwordInput.addEventListener('blur', () => validatePassword(passwordInput));
    
    // Remove error state on input
    emailInput.addEventListener('input', () => clearValidationState(emailInput));
    passwordInput.addEventListener('input', () => clearValidationState(passwordInput));
}

function validateLoginForm(email, password) {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    
    let isValid = true;

    if (!validateEmail(emailInput)) {
        isValid = false;
    }

    if (!validatePassword(passwordInput)) {
        isValid = false;
    }

    return isValid;
}

function validateEmail(input) {
    const email = input.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email) {
        setValidationState(input, 'error', 'E-mail é obrigatório');
        return false;
    }
    
    if (!emailRegex.test(email)) {
        setValidationState(input, 'error', 'E-mail inválido');
        return false;
    }
    
    setValidationState(input, 'success');
    return true;
}

function validatePassword(input) {
    const password = input.value;
    
    if (!password) {
        setValidationState(input, 'error', 'Senha é obrigatória');
        return false;
    }
    
    if (password.length < 6) {
        setValidationState(input, 'error', 'Senha deve ter pelo menos 6 caracteres');
        return false;
    }
    
    setValidationState(input, 'success');
    return true;
}

function setValidationState(input, state, message = '') {
    const formGroup = input.closest('.form-group');
    
    // Remove existing states
    input.classList.remove('error', 'success');
    
    // Remove existing error message
    const existingError = formGroup.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    if (state === 'error') {
        input.classList.add('error');
        
        if (message) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.48 2 2 6.48 2 12S6.48 22 12 22S22 17.52 22 12S17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="currentColor"/>
                </svg>
                ${message}
            `;
            formGroup.appendChild(errorDiv);
        }
    } else if (state === 'success') {
        input.classList.add('success');
    }
}

function clearValidationState(input) {
    const formGroup = input.closest('.form-group');
    
    input.classList.remove('error', 'success');
    
    const existingError = formGroup.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
}

// ===== LOGIN ANIMATIONS =====
function initLoginAnimations() {
    // Animate form elements on load
    const formGroups = document.querySelectorAll('.form-group');
    
    formGroups.forEach((group, index) => {
        group.style.opacity = '0';
        group.style.transform = 'translateY(20px)';
        group.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        
        setTimeout(() => {
            group.style.opacity = '1';
            group.style.transform = 'translateY(0)';
        }, 200 + (index * 100));
    });

    // Animate benefit items
    const benefitItems = document.querySelectorAll('.benefit-item');
    
    benefitItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-20px)';
        item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
        }, 600 + (index * 150));
    });

    // Input focus animations
    const inputs = document.querySelectorAll('.form-input');
    
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'scale(1.02)';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'scale(1)';
        });
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

// ===== AUTO-FILL REMEMBERED USER =====
function checkRememberedUser() {
    const remembered = localStorage.getItem('eniac_remember');
    const savedUser = localStorage.getItem('eniac_user');
    
    if (remembered === 'true' && savedUser) {
        const emailInput = document.getElementById('email');
        const rememberCheckbox = document.getElementById('remember');
        
        if (emailInput) {
            emailInput.value = savedUser;
        }
        
        if (rememberCheckbox) {
            rememberCheckbox.checked = true;
        }
    }
}

// Check for remembered user on load
document.addEventListener('DOMContentLoaded', checkRememberedUser);

// ===== KEYBOARD SHORTCUTS =====
document.addEventListener('keydown', function(e) {
    // Enter key submits form when focused on inputs
    if (e.key === 'Enter') {
        const activeElement = document.activeElement;
        if (activeElement && activeElement.classList.contains('form-input')) {
            const form = activeElement.closest('form');
            if (form) {
                form.dispatchEvent(new Event('submit'));
            }
        }
    }
});

// ===== DEMO CREDENTIALS HINT =====
function showDemoHint() {
    const emailInput = document.getElementById('email');
    
    if (emailInput) {
        emailInput.addEventListener('focus', function() {
            if (!this.value) {
                showNotification('💡 Demo: admin@eniac.edu.br / admin123', 'info');
            }
        }, { once: true });
    }
}

// Show demo hint after a delay
setTimeout(showDemoHint, 3000);