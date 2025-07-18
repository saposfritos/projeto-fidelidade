document.addEventListener('DOMContentLoaded', function() {
    // Elementos do formulário
    const cadastroForm = document.getElementById('cadastroForm');
    const passwordToggle = document.getElementById('passwordToggle');
    const passwordInput = document.getElementById('password');
    const phoneInput = document.getElementById('phone');

    // Toggle de visibilidade da senha
    if (passwordToggle && passwordInput) {
        passwordToggle.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            // Trocar ícone do olho
            const eyeIcon = passwordToggle.querySelector('.eye-icon path');
            if (type === 'text') {
                eyeIcon.setAttribute('d', 'M12 7C9.24 7 7 9.24 7 12S9.24 17 12 17S17 14.76 17 12S14.76 7 12 7ZM12 15C10.34 15 9 13.66 9 12S10.34 9 12 9S15 10.34 15 12S13.66 15 12 15ZM12 4.5C7 4.5 2.73 7.61 1 12C2.73 16.39 7 19.5 12 19.5S21.27 16.39 23 12C21.27 7.61 17 4.5 12 4.5Z');
            } else {
                eyeIcon.setAttribute('d', 'M12 4.5C7 4.5 2.73 7.61 1 12C2.73 16.39 7 19.5 12 19.5S21.27 16.39 23 12C21.27 7.61 17 4.5 12 4.5ZM12 17C9.24 17 7 14.76 7 12S9.24 7 12 7S17 9.24 17 12S14.76 17 12 17ZM12 9C10.34 9 9 10.34 9 12S10.34 15 12 15S15 13.66 15 12S13.66 9 12 9Z');
            }
        });
    }

    // Máscara para telefone
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length <= 11) {
                if (value.length <= 2) {
                    value = value.replace(/(\d{0,2})/, '($1');
                } else if (value.length <= 7) {
                    value = value.replace(/(\d{2})(\d{0,5})/, '($1) $2');
                } else {
                    value = value.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
                }
            }
            
            e.target.value = value;
        });
    }

    // Submissão do formulário
    if (cadastroForm) {
        cadastroForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Elementos do formulário
            const submitBtn = cadastroForm.querySelector('.login-btn');
            const btnText = submitBtn.querySelector('.btn-text');
            const btnLoader = submitBtn.querySelector('.btn-loader');
            
            // Dados do formulário
            const formData = new FormData(cadastroForm);
            const userData = {
                name: formData.get('name'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                password: formData.get('password')
            };

            // Validações básicas
            if (!userData.name || userData.name.trim().length < 2) {
                alert('Por favor, insira um nome válido.');
                return;
            }

            if (!userData.email || !isValidEmail(userData.email)) {
                alert('Por favor, insira um e-mail válido.');
                return;
            }

            if (!userData.phone || userData.phone.replace(/\D/g, '').length < 10) {
                alert('Por favor, insira um telefone válido.');
                return;
            }

            if (!userData.password || userData.password.length < 6) {
                alert('A senha deve ter pelo menos 6 caracteres.');
                return;
            }

            // Mostrar loading
            btnText.style.display = 'none';
            btnLoader.style.display = 'flex';
            submitBtn.disabled = true;

            // Simular envio (aqui você faria a requisição real)
            setTimeout(() => {
                // Esconder loading
                btnText.style.display = 'block';
                btnLoader.style.display = 'none';
                submitBtn.disabled = false;

                // Simular sucesso
                alert('Cadastro realizado com sucesso! Redirecionando para o login...');
                
                // Redirecionar para login
                window.location.href = 'login.html';
            }, 2000);
        });
    }

    // Função para validar e-mail
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Animações de foco nos inputs
    const inputs = document.querySelectorAll('.form-input');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });

        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });

        // Verificar se já tem valor ao carregar
        if (input.value) {
            input.parentElement.classList.add('focused');
        }
    });
});

