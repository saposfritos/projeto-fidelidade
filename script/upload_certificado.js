document.addEventListener('DOMContentLoaded', function() {
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
                    uploadMessage.textContent = 'Arquivo "' + file.name + '" enviado com sucesso! A validação será processada em breve.';
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



// ===== LOGIN STATUS MANAGEMENT =====
function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('eniac_logged_in') === 'true';
    const userName = localStorage.getItem('eniac_user_name') || 'Usuário';
    
    if (isLoggedIn) {
        showUserGreeting(userName);
    } else {
        hideUserGreeting();
    }
}

function showUserGreeting(userName) {
    const userGreeting = document.getElementById('userGreeting');
    const greetingText = document.getElementById('greetingText');
    
    if (userGreeting && greetingText) {
        greetingText.textContent = `Olá, ${userName}!`;
        userGreeting.style.display = 'block';
    }
}

function hideUserGreeting() {
    const userGreeting = document.getElementById('userGreeting');
    if (userGreeting) {
        userGreeting.style.display = 'none';
    }
}

// Adicionar verificação de login na inicialização
document.addEventListener('DOMContentLoaded', function() {
    // Verificar status de login primeiro
    checkLoginStatus();
    
    // Código existente da página...
    const certificateFile = document.getElementById('certificateFile');
    const fileNameSpan = document.getElementById('fileName');
    const uploadForm = document.getElementById('uploadForm');
    const uploadMessage = document.getElementById('uploadMessage');

    // Resto do código existente permanece igual...
});

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

