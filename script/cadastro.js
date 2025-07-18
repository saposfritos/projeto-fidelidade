// Cadastro Form Functionality
document.addEventListener('DOMContentLoaded', function() {
    const cadastroForm = document.getElementById('cadastroForm');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const submitBtn = document.querySelector('.login-btn');

    // Phone mask
    phoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length <= 11) {
            value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
            if (value.length < 14) {
                value = value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
            }
        }
        
        e.target.value = value;
    });

    // Form validation
    function validateField(input, validationFn, errorMessage) {
        const isValid = validationFn(input.value);
        const errorElement = input.parentNode.parentNode.querySelector('.error-message');
        
        if (errorElement) {
            errorElement.remove();
        }
        
        if (!isValid && input.value.trim() !== '') {
            input.classList.add('error');
            input.classList.remove('success');
            
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                ${errorMessage}
            `;
            input.parentNode.parentNode.appendChild(errorDiv);
        } else if (isValid && input.value.trim() !== '') {
            input.classList.remove('error');
            input.classList.add('success');
        } else {
            input.classList.remove('error', 'success');
        }
        
        return isValid;
    }

    // Validation functions
    function validateName(name) {
        return name.trim().length >= 2 && /^[a-zA-ZÀ-ÿ\s]+$/.test(name);
    }

    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function validatePhone(phone) {
        const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
        return phoneRegex.test(phone);
    }

    // Real-time validation
    nameInput.addEventListener('blur', function() {
        validateField(this, validateName, 'Nome deve ter pelo menos 2 caracteres e conter apenas letras');
    });

    emailInput.addEventListener('blur', function() {
        validateField(this, validateEmail, 'Por favor, insira um e-mail válido');
    });

    phoneInput.addEventListener('blur', function() {
        validateField(this, validatePhone, 'Por favor, insira um telefone válido no formato (XX) XXXXX-XXXX');
    });

    // Form submission
    cadastroForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate all fields
        const isNameValid = validateField(nameInput, validateName, 'Nome deve ter pelo menos 2 caracteres e conter apenas letras');
        const isEmailValid = validateField(emailInput, validateEmail, 'Por favor, insira um e-mail válido');
        const isPhoneValid = validateField(phoneInput, validatePhone, 'Por favor, insira um telefone válido no formato (XX) XXXXX-XXXX');
        
        if (isNameValid && isEmailValid && isPhoneValid) {
            // Show loading state
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
            
            // Simulate form submission
            setTimeout(function() {
                // Hide loading state
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
                
                // Show success message
                alert('Cadastro realizado com sucesso! Bem-vindo ao programa de fidelidade ENIAC.');
                
                // Reset form
                cadastroForm.reset();
                
                // Remove validation classes
                [nameInput, emailInput, phoneInput].forEach(input => {
                    input.classList.remove('error', 'success');
                });
                
                // Remove error messages
                document.querySelectorAll('.error-message').forEach(error => {
                    error.remove();
                });
                
            }, 2000);
        } else {
            // Scroll to first error
            const firstError = document.querySelector('.form-input.error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstError.focus();
            }
        }
    });

    // Input focus effects
    const inputs = document.querySelectorAll('.form-input');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentNode.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentNode.classList.remove('focused');
        });
    });
});

