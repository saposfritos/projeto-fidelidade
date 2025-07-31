// Aguarda o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', function() {
    // Inicialização de todos os módulos
    initMobileMenu();
    initScrollAnimations();
    initSmoothScrolling();
    initHeaderScroll();
    initButtonAnimations();
    initParallaxEffect();
    initTypingAnimation();
    initCounterAnimation();
    initFormValidation();
    initTooltips();
    
    console.log('🚀 ENIAC - Site carregado com sucesso!');
});

// ===== MENU MOBILE =====
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav');
    let isMenuOpen = false;

    if (!mobileMenuBtn || !nav) return;

    // Criar overlay para o menu mobile
    const overlay = document.createElement('div');
    overlay.className = 'mobile-menu-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        z-index: 999;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
    `;
    document.body.appendChild(overlay);

    // Estilizar o menu mobile
    nav.style.cssText = `
        position: fixed;
        top: 0;
        right: -100%;
        width: 280px;
        height: 100vh;
        background: linear-gradient(135deg, var(--primary-green) 0%, var(--secondary-green) 100%);
        z-index: 1000;
        transition: right 0.3s ease;
        padding: 80px 20px 20px;
        box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
    `;

    const navList = nav.querySelector('.nav-list');
    if (navList) {
        navList.style.cssText = `
            flex-direction: column;
            gap: 0;
            align-items: stretch;
        `;

        // Estilizar links do menu mobile
        const navLinks = navList.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.style.cssText = `
                padding: 15px 20px;
                border-radius: 8px;
                margin-bottom: 10px;
                text-align: center;
                font-size: 18px;
                border: 1px solid rgba(255, 255, 255, 0.2);
            `;
        });
    }

    // Toggle do menu
    function toggleMenu() {
        isMenuOpen = !isMenuOpen;
        
        if (isMenuOpen) {
            nav.style.right = '0';
            overlay.style.opacity = '1';
            overlay.style.visibility = 'visible';
            document.body.style.overflow = 'hidden';
            mobileMenuBtn.classList.add('active');
        } else {
            nav.style.right = '-100%';
            overlay.style.opacity = '0';
            overlay.style.visibility = 'hidden';
            document.body.style.overflow = '';
            mobileMenuBtn.classList.remove('active');
        }
    }

    // Event listeners
    mobileMenuBtn.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', toggleMenu);

    // Fechar menu ao clicar em um link
    const navLinks = nav.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (isMenuOpen) toggleMenu();
        });
    });

    // Animação do botão hamburger
    const spans = mobileMenuBtn.querySelectorAll('span');
    mobileMenuBtn.addEventListener('click', () => {
        spans.forEach((span, index) => {
            if (mobileMenuBtn.classList.contains('active')) {
                if (index === 0) span.style.transform = 'rotate(45deg) translate(5px, 5px)';
                if (index === 1) span.style.opacity = '0';
                if (index === 2) span.style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                span.style.transform = '';
                span.style.opacity = '';
            }
        });
    });

    // Resetar menu em telas maiores
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 768 && isMenuOpen) {
            toggleMenu();
        }
    });
}

// ===== ANIMAÇÕES DE SCROLL =====
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Animação especial para cards
                if (entry.target.classList.contains('feature-card')) {
                    const delay = Array.from(entry.target.parentNode.children).indexOf(entry.target) * 100;
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, delay);
                }
            }
        });
    }, observerOptions);

    // Observar elementos para animação
    const animatedElements = document.querySelectorAll('.feature-card, .hero-content');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// ===== SCROLL SUAVE =====
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== HEADER DINÂMICO =====
function initHeaderScroll() {
    const header = document.querySelector('.header');
    let lastScrollY = window.scrollY;
    let ticking = false;

    function updateHeader() {
        const scrollY = window.scrollY;
        
        if (scrollY > 100) {
            header.style.background = 'linear-gradient(135deg, rgba(30, 64, 175, 0.95) 0%, rgba(29, 78, 216, 0.95) 100%)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.background = 'linear-gradient(135deg, var(--primary-blue) 0%, var(--secondary-blue) 100%)';
            header.style.backdropFilter = 'none';
        }

        lastScrollY = scrollY;
        ticking = false;
    }

    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateHeader);
            ticking = true;
        }
    }

    window.addEventListener('scroll', requestTick);
}

// ===== ANIMAÇÕES DE BOTÕES =====
function initButtonAnimations() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        // Efeito ripple
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });

        // Efeito de hover com partículas
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px) scale(1.02)';
        });

        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Adicionar CSS para animação ripple
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        .btn {
            position: relative;
            overflow: hidden;
        }
    `;
    document.head.appendChild(style);
}

// ===== EFEITO PARALLAX =====
function initParallaxEffect() {
    const decorationCircles = document.querySelectorAll('.decoration-circle');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        decorationCircles.forEach((circle, index) => {
            const speed = (index + 1) * 0.3;
            circle.style.transform = `translateY(${rate * speed}px) rotate(${scrolled * 0.1}deg)`;
        });
    });
}

// ===== ANIMAÇÃO DE DIGITAÇÃO =====
function initTypingAnimation() {
    const heroTitle = document.querySelector('.hero-title');
    if (!heroTitle) return;

    const text = heroTitle.textContent;
    heroTitle.textContent = '';
    heroTitle.style.borderRight = '2px solid var(--primary-blue)';
    
    let i = 0;
    const typeWriter = () => {
        if (i < text.length) {
            heroTitle.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 50);
        } else {
            setTimeout(() => {
                heroTitle.style.borderRight = 'none';
            }, 1000);
        }
    };

    // Iniciar animação quando o elemento estiver visível
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(typeWriter, 500);
                observer.unobserve(entry.target);
            }
        });
    });

    observer.observe(heroTitle);
}

// ===== CONTADOR ANIMADO =====
function initCounterAnimation() {
    // Adicionar contadores dinâmicos
    const heroDescription = document.querySelector('.hero-description');
    if (heroDescription) {
        const countersHTML = `
           
        `;
        
        heroActions.insertAdjacentHTML('afterend', newsletterHTML);

        // Validação do formulário
        const form = document.querySelector('.newsletter-form');
        const input = document.querySelector('.newsletter-input');

        input.addEventListener('focus', () => {
            input.style.borderColor = 'var(--primary-blue)';
            input.style.boxShadow = '0 0 0 3px rgba(30, 64, 175, 0.1)';
        });

        input.addEventListener('blur', () => {
            input.style.borderColor = 'var(--gray-300)';
            input.style.boxShadow = 'none';
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = input.value;
            
            if (email) {
                // Simular envio
                input.value = '';
                showNotification('✅ Inscrição realizada com sucesso!', 'success');
            }
        });
    }
}

// ===== TOOLTIPS =====
function initTooltips() {
    const featureCards = document.querySelectorAll('.feature-card');
    
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-8px) scale(1.02)';
            card.style.zIndex = '10';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
            card.style.zIndex = '1';
        });
    });
}

// ===== SISTEMA DE NOTIFICAÇÕES =====
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'var(--primary-blue)' : 'var(--gray-800)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: var(--shadow-lg);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
        font-weight: 500;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Animar entrada
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remover após 3 segundos
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// ===== EASTER EGG =====
let clickCount = 0;
document.querySelector('.logo').addEventListener('click', () => {
    clickCount++;
    if (clickCount === 5) {
        showNotification('🎉 Você descobriu um easter egg! Parabéns!', 'success');
        clickCount = 0;
        
        // Efeito especial
        const logo = document.querySelector('.logo');
        logo.style.animation = 'bounce 1s ease-in-out';
        setTimeout(() => {
            logo.style.animation = '';
        }, 1000);
    }
});

// Adicionar animação bounce
const bounceStyle = document.createElement('style');
bounceStyle.textContent = `
    @keyframes bounce {
        0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
        }
        40% {
            transform: translateY(-10px);
        }
        60% {
            transform: translateY(-5px);
        }
    }
`;
document.head.appendChild(bounceStyle);

// ===== PERFORMANCE E OTIMIZAÇÕES =====
// Debounce para eventos de scroll
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Lazy loading para imagens (se houver)
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// Inicializar lazy loading
initLazyLoading();


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
    
    // Inicialização de todos os módulos existentes
    initMobileMenu();
    initScrollAnimations();
    initSmoothScrolling();
    initHeaderScroll();
    initButtonAnimations();
    initParallaxEffect();
    initTypingAnimation();
    initCounterAnimation();
    initFormValidation();
    initTooltips();
    
    console.log('🚀 ENIAC - Site carregado com sucesso!');
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

