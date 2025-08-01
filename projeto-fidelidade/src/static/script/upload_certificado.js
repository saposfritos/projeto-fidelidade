document.addEventListener('DOMContentLoaded', function() {
    // Botão sair da sidebar
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.onclick = async function() {
            try {
                await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
            } catch (e) {}
            window.location.href = 'login.html';
        };
    }
    // Só verifica autenticação se não estiver em página pública
    const publicPages = ['/login.html', '/cadastro.html', '/redefinir_senha.html'];
    if (!publicPages.includes(window.location.pathname)) {
        checkAuthStatus(); // Verificar autenticação via backend
    }

    // Verificar autenticação via backend
    async function checkAuthStatus() {
        try {
            const response = await fetch('/api/auth/me', { credentials: 'include' });
            if (!response.ok) {
                if (
                    window.location.pathname !== '/login.html' &&
                    window.location.pathname !== '/cadastro.html' &&
                    window.location.pathname !== '/redefinir_senha.html'
                ) {
                    window.location.href = 'login.html';
                }
            } else {
                const userData = await response.json();
                // Exibe nome e pontos do usuário na sidebar
                const userNameSpan = document.querySelector('.user-name');
                if (userNameSpan) userNameSpan.textContent = userData.username || 'Usuário';
                const userPointsSpan = document.querySelector('.user-points');
                if (userPointsSpan) userPointsSpan.textContent = `Pontos: ${userData.points ?? 0}`;
            }
        } catch (error) {
            if (
                window.location.pathname !== '/login.html' &&
                window.location.pathname !== '/cadastro.html' &&
                window.location.pathname !== '/redefinir_senha.html'
            ) {
                window.location.href = 'login.html';
            }
        }
    }

    // ...existing code...
    const certificateFile = document.getElementById('certificateFile');
    const fileNameSpan = document.getElementById('fileName');
    const uploadForm = document.getElementById('uploadForm');
    const uploadMessage = document.getElementById('uploadMessage');

    // Função para validar se o arquivo é PDF
    function validatePDF(file) {
        const validTypes = ['application/pdf'];
        const maxSize = 10 * 1024 * 1024; // 10MB
        
        if (!validTypes.includes(file.type)) {
            return { valid: false, message: 'Por favor, selecione apenas arquivos PDF.' };
        }
        
        if (file.size > maxSize) {
            return { valid: false, message: 'O arquivo deve ter no máximo 10MB.' };
        }
        
        return { valid: true };
    }

    // Função para formatar o tamanho do arquivo
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Evento de mudança no input de arquivo
    certificateFile.addEventListener('change', function() {
        uploadMessage.textContent = '';
        uploadMessage.className = 'upload-message';
        
        if (this.files.length > 0) {
            const file = this.files[0];
            const validation = validatePDF(file);
            
            if (validation.valid) {
                fileNameSpan.textContent = file.name + ' (' + formatFileSize(file.size) + ')';
                fileNameSpan.classList.add('has-file');
            } else {
                fileNameSpan.textContent = 'Nenhum arquivo selecionado';
                fileNameSpan.classList.remove('has-file');
                uploadMessage.textContent = validation.message;
                uploadMessage.className = 'upload-message error';
                this.value = ''; // Limpa o input
            }
        } else {
            fileNameSpan.textContent = 'Nenhum arquivo selecionado';
            fileNameSpan.classList.remove('has-file');
        }
    });

    // Evento de submit do formulário
    uploadForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        if (certificateFile.files.length > 0) {
            const file = certificateFile.files[0];
            const validation = validatePDF(file);
            
            if (validation.valid) {
                // Simula o processo de upload
                uploadMessage.textContent = 'Enviando arquivo...';
                uploadMessage.className = 'upload-message';
                
                // Simula um delay de upload
                setTimeout(() => {
                    uploadMessage.textContent = 'Arquivo "' + file.name + '" enviado com sucesso! Você receberá 30 pontos.';
                    uploadMessage.className = 'upload-message success';
                    
                    // Reset do formulário após sucesso
                    setTimeout(() => {
                        uploadForm.reset();
                        fileNameSpan.textContent = 'Nenhum arquivo selecionado';
                        fileNameSpan.classList.remove('has-file');
                        uploadMessage.textContent = '';
                        uploadMessage.className = 'upload-message';
                    }, 3000);
                }, 1500);
            } else {
                uploadMessage.textContent = validation.message;
                uploadMessage.className = 'upload-message error';
            }
        } else {
            uploadMessage.textContent = 'Por favor, selecione um arquivo PDF para enviar.';
            uploadMessage.className = 'upload-message error';
        }
    });

    // Drag and drop functionality
    const uploadSection = document.querySelector('.upload-section');
    
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadSection.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        uploadSection.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        uploadSection.addEventListener(eventName, unhighlight, false);
    });

    function highlight() {
        uploadSection.style.background = 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)';
        uploadSection.style.transform = 'scale(1.02)';
    }

    function unhighlight() {
        uploadSection.style.background = 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)';
        uploadSection.style.transform = 'scale(1)';
    }

    uploadSection.addEventListener('drop', handleDrop, false);

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;

        if (files.length > 0) {
            certificateFile.files = files;
            // Trigger change event
            const event = new Event('change', { bubbles: true });
            certificateFile.dispatchEvent(event);
        }
    }
});


