// Funcionalidad principal de la landing page de Mapu

// Variables globales
let isMenuOpen = false;
let isScrolling = false;

// Elementos DOM
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const header = document.querySelector('.header');

// Inicialización cuando el DOM está listo
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeScrollEffects();
    initializeAnimations();
    initializeFormHandling();
    initializeCounters();
});

// ===== NAVEGACIÓN =====
function initializeNavigation() {
    // Toggle del menú móvil
    if (navToggle) {
        navToggle.addEventListener('click', toggleMobileMenu);
    }

    // Cerrar menú al hacer click en un enlace
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (isMenuOpen) {
                toggleMobileMenu();
            }
        });
    });

    // Cerrar menú al hacer click fuera
    document.addEventListener('click', (e) => {
        if (isMenuOpen && !navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            toggleMobileMenu();
        }
    });
}

function toggleMobileMenu() {
    isMenuOpen = !isMenuOpen;
    navToggle.classList.toggle('active', isMenuOpen);
    navMenu.classList.toggle('active', isMenuOpen);
    
    // Prevenir scroll del body cuando el menú está abierto
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
}

// ===== EFECTOS DE SCROLL =====
function initializeScrollEffects() {
    // Header transparente al hacer scroll
    window.addEventListener('scroll', throttle(handleScroll, 100));
    
    // Scroll suave para enlaces internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80; // Compensar altura del header
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

function handleScroll() {
    const scrollTop = window.pageYOffset;
    
    // Efecto en el header
    if (scrollTop > 100) {
        header.style.background = 'var(--overlay)';
        header.style.backdropFilter = 'blur(20px)';
    } else {
        header.style.background = 'var(--overlay)';
        header.style.backdropFilter = 'blur(10px)';
    }
    
    // Activar animaciones al hacer scroll
    if (!isScrolling) {
        isScrolling = true;
        requestAnimationFrame(animateOnScroll);
    }
}

function animateOnScroll() {
    const elements = document.querySelectorAll('.feature-card, .testimonial-card, .step');
    const windowHeight = window.innerHeight;
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < windowHeight - elementVisible) {
            element.classList.add('animate-fade-in-up');
        }
    });
    
    isScrolling = false;
}

// ===== ANIMACIONES =====
function initializeAnimations() {
    // Animación de escritura para el título principal
    animateTypewriter('.hero-title', 100);
    
    // Animación de contadores
    animateCounters();
    
    // Animación de aparición gradual de elementos
    observeElements();
}

function animateTypewriter(selector, speed = 100) {
    const element = document.querySelector(selector);
    if (!element) return;
    
    const text = element.textContent;
    element.textContent = '';
    element.style.borderRight = '2px solid var(--primary)';
    
    let i = 0;
    const timer = setInterval(() => {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
        } else {
            clearInterval(timer);
            element.style.borderRight = 'none';
        }
    }, speed);
}

function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element) {
    const target = parseInt(element.textContent.replace(/\D/g, ''));
    const suffix = element.textContent.replace(/\d/g, '');
    const duration = 2000;
    const increment = target / (duration / 16);
    
    let current = 0;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current) + suffix;
    }, 16);
}

function observeElements() {
    const elementsToObserve = document.querySelectorAll('.feature-card, .testimonial-card, .step');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    elementsToObserve.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'all 0.6s ease-out';
        observer.observe(element);
    });
}

// ===== MANEJO DE FORMULARIOS =====
function initializeFormHandling() {
    const contactForm = document.querySelector('.form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
        
        // Validación en tiempo real
        const inputs = contactForm.querySelectorAll('.form-input');
        inputs.forEach(input => {
            input.addEventListener('blur', validateField);
            input.addEventListener('input', clearValidation);
        });
    }
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const submitBtn = form.querySelector('.form-submit');
    
    // Validar todos los campos
    const isValid = validateForm(form);
    if (!isValid) {
        showNotification('Por favor, corrige los errores en el formulario', 'error');
        return;
    }
    
    // Mostrar estado de carga
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    submitBtn.disabled = true;
    
    // Obtener datos del formulario
    const name = form.querySelector('input[type="text"]').value;
    const email = form.querySelector('input[type="email"]').value;
    const message = form.querySelector('textarea').value;
    
    // Crear el cuerpo del email
    const emailBody = `
        Nombre: ${name}
        Email: ${email}
        Mensaje: ${message}
        
        Enviado desde la landing page de Mapu.
    `;
    
    // Crear el enlace de mailto con los datos
    const mailtoLink = `mailto:legendscode2025@gmail.com?subject=Contacto desde Mapu Landing Page&body=${encodeURIComponent(emailBody)}`;
    
    // Abrir el cliente de email
    window.location.href = mailtoLink;
    
    // Mostrar mensaje de éxito
    setTimeout(() => {
        showNotification('¡Redirigiendo a tu cliente de email! Por favor, envía el mensaje desde ahí.', 'success');
        form.reset();
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar Mensaje';
        submitBtn.disabled = false;
    }, 1000);
}

function validateForm(form) {
    const inputs = form.querySelectorAll('.form-input[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!validateField({ target: input })) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    const fieldType = field.type;
    let isValid = true;
    let errorMessage = '';
    
    // Validaciones específicas por tipo de campo
    switch (fieldType) {
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Ingresa un email válido';
            }
            break;
        case 'text':
            if (value.length < 2) {
                isValid = false;
                errorMessage = 'El nombre debe tener al menos 2 caracteres';
            }
            break;
        default:
            if (value.length < 10) {
                isValid = false;
                errorMessage = 'El mensaje debe tener al menos 10 caracteres';
            }
    }
    
    // Mostrar error
    if (!isValid) {
        showFieldError(field, errorMessage);
    } else {
        clearFieldError(field);
    }
    
    return isValid;
}

function clearValidation(e) {
    clearFieldError(e.target);
}

function showFieldError(field, message) {
    clearFieldError(field);
    
    field.style.borderColor = 'var(--error)';
    field.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
    
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    errorElement.style.color = 'var(--error)';
    errorElement.style.fontSize = 'var(--font-size-sm)';
    errorElement.style.marginTop = 'var(--spacing-1)';
    
    field.parentNode.appendChild(errorElement);
}

function clearFieldError(field) {
    field.style.borderColor = '';
    field.style.boxShadow = '';
    
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

// ===== NOTIFICACIONES =====
function showNotification(message, type = 'info') {
    // Remover notificación existente
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Crear nueva notificación
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Estilos de la notificación
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--surface);
        border: 1px solid var(--divider);
        border-radius: var(--border-radius-lg);
        padding: var(--spacing-4);
        box-shadow: var(--shadow-xl);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 400px;
    `;
    
    // Estilos del contenido
    const content = notification.querySelector('.notification-content');
    content.style.cssText = `
        display: flex;
        align-items: center;
        gap: var(--spacing-3);
        color: var(--text-primary);
    `;
    
    // Color según tipo
    const icon = notification.querySelector('i');
    switch (type) {
        case 'success':
            icon.style.color = 'var(--success)';
            notification.style.borderLeftColor = 'var(--success)';
            notification.style.borderLeftWidth = '4px';
            break;
        case 'error':
            icon.style.color = 'var(--error)';
            notification.style.borderLeftColor = 'var(--error)';
            notification.style.borderLeftWidth = '4px';
            break;
        case 'warning':
            icon.style.color = 'var(--warning)';
            notification.style.borderLeftColor = 'var(--warning)';
            notification.style.borderLeftWidth = '4px';
            break;
        default:
            icon.style.color = 'var(--info)';
            notification.style.borderLeftColor = 'var(--info)';
            notification.style.borderLeftWidth = '4px';
    }
    
    // Botón de cerrar
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: var(--text-muted);
        cursor: pointer;
        margin-left: auto;
        padding: var(--spacing-1);
    `;
    
    // Agregar al DOM
    document.body.appendChild(notification);
    
    // Animar entrada
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto-remover después de 5 segundos
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }
    }, 5000);
}

function getNotificationIcon(type) {
    switch (type) {
        case 'success': return 'fa-check-circle';
        case 'error': return 'fa-exclamation-circle';
        case 'warning': return 'fa-exclamation-triangle';
        default: return 'fa-info-circle';
    }
}

// ===== FUNCIONES DE NAVEGACIÓN =====
function scrollToDownload() {
    const downloadSection = document.querySelector('.download');
    if (downloadSection) {
        const offsetTop = downloadSection.offsetTop - 80;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

function scrollToFeatures() {
    const featuresSection = document.querySelector('.features');
    if (featuresSection) {
        const offsetTop = featuresSection.offsetTop - 80;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// ===== UTILIDADES =====
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

function debounce(func, wait, immediate) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// ===== EFECTOS PARALLAX =====
function initializeParallax() {
    window.addEventListener('scroll', throttle(() => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.hero::before, .download::before');
        
        parallaxElements.forEach(element => {
            const speed = 0.5;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    }, 16));
}

// ===== LAZY LOADING =====
function initializeLazyLoading() {
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

// ===== MODO OSCURO/CLARO =====
function initializeThemeToggle() {
    // Verificar preferencia del sistema
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
        document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    }
}

// ===== ANIMACIONES DE ENTRADA =====
function initializeEntranceAnimations() {
    const animatedElements = document.querySelectorAll('.feature-card, .testimonial-card, .step');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('animate-fade-in-up');
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// ===== INICIALIZACIÓN COMPLETA =====
window.addEventListener('load', () => {
    // Inicializar efectos adicionales
    initializeParallax();
    initializeLazyLoading();
    initializeThemeToggle();
    initializeEntranceAnimations();
    initializeAdvancedFormFeatures();
    
    // Mostrar mensaje de bienvenida
    setTimeout(() => {
        showNotification('¡Bienvenido a Mapu! Descubre los mejores destinos de Nicaragua.', 'success');
    }, 1000);
});

// ===== FUNCIONALIDAD ADICIONAL DEL FORMULARIO =====
function initializeAdvancedFormFeatures() {
    const contactForm = document.querySelector('.form');
    if (contactForm) {
        // Agregar funcionalidad de copiar email al hacer click
        const emailElement = document.querySelector('.contact-item span');
        if (emailElement && emailElement.textContent.includes('@')) {
            emailElement.style.cursor = 'pointer';
            emailElement.addEventListener('click', () => {
                navigator.clipboard.writeText(emailElement.textContent).then(() => {
                    showNotification('Email copiado al portapapeles', 'success');
                }).catch(() => {
                    showNotification('No se pudo copiar el email', 'error');
                });
            });
        }
        
        // Agregar funcionalidad de llamar al hacer click en el teléfono
        const phoneElement = document.querySelector('.contact-item span');
        if (phoneElement && phoneElement.textContent.includes('+505')) {
            phoneElement.style.cursor = 'pointer';
            phoneElement.addEventListener('click', () => {
                window.location.href = `tel:${phoneElement.textContent.replace(/\s/g, '')}`;
            });
        }
    }
}

// ===== MANEJO DE ERRORES =====
window.addEventListener('error', (e) => {
    console.error('Error en la landing page:', e.error);
    showNotification('Ha ocurrido un error. Por favor, recarga la página.', 'error');
});

// ===== PERFORMANCE MONITORING =====
window.addEventListener('load', () => {
    // Medir tiempo de carga
    const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
    console.log(`Tiempo de carga: ${loadTime}ms`);
    
    // Optimización de imágenes
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        if (!img.complete) {
            img.addEventListener('load', () => {
                img.style.opacity = '1';
            });
        }
    });
});

// Exportar funciones para uso global
window.scrollToDownload = scrollToDownload;
window.scrollToFeatures = scrollToFeatures;
