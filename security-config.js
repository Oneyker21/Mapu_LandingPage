/**
 * Configuración de seguridad para la landing page de Mapu
 * Este archivo contiene configuraciones y constantes de seguridad
 */

const SecurityConfig = {
    // Configuración de rate limiting
    RATE_LIMITING: {
        MAX_FORM_ATTEMPTS: 3,
        FORM_COOLDOWN_TIME: 300000, // 5 minutos en milisegundos
        MAX_REQUESTS_PER_MINUTE: 60
    },
    
    // Patrones de detección de amenazas
    THREAT_PATTERNS: {
        XSS: [
            /<script/i,
            /javascript:/i,
            /on\w+\s*=/i,
            /data:text\/html/i,
            /vbscript:/i,
            /expression\s*\(/i,
            /<iframe/i,
            /<object/i,
            /<embed/i,
            /<link/i,
            /<meta/i
        ],
        SQL_INJECTION: [
            /union\s+select/i,
            /drop\s+table/i,
            /delete\s+from/i,
            /insert\s+into/i,
            /update\s+set/i,
            /or\s+1\s*=\s*1/i,
            /and\s+1\s*=\s*1/i,
            /';\s*drop/i,
            /--/i,
            /\/\*/i
        ],
        PATH_TRAVERSAL: [
            /\.\.\//i,
            /\.\.\\/i,
            /\.\.%2f/i,
            /\.\.%5c/i,
            /%2e%2e%2f/i,
            /%2e%2e%5c/i
        ],
        COMMAND_INJECTION: [
            /;\s*rm\s/i,
            /;\s*cat\s/i,
            /;\s*ls\s/i,
            /;\s*dir\s/i,
            /;\s*del\s/i,
            /;\s*type\s/i,
            /\|\s*nc\s/i,
            /\|\s*netcat\s/i
        ]
    },
    
    // Configuración de validación de entrada
    INPUT_VALIDATION: {
        NAME: {
            MIN_LENGTH: 2,
            MAX_LENGTH: 100,
            PATTERN: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/
        },
        EMAIL: {
            MIN_LENGTH: 5,
            MAX_LENGTH: 254,
            PATTERN: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        },
        MESSAGE: {
            MIN_LENGTH: 10,
            MAX_LENGTH: 2000
        }
    },
    
    // Configuración de logging
    LOGGING: {
        ENABLED: true,
        LOG_LEVEL: 'WARN', // DEBUG, INFO, WARN, ERROR
        MAX_LOG_ENTRIES: 1000,
        LOG_RETENTION_DAYS: 30
    },
    
    // Configuración de CSP (Content Security Policy)
    CSP: {
        DEFAULT_SRC: "'self'",
        SCRIPT_SRC: "'self' 'unsafe-inline'",
        STYLE_SRC: "'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://fonts.googleapis.com",
        FONT_SRC: "'self' https://cdnjs.cloudflare.com https://fonts.gstatic.com",
        IMG_SRC: "'self' data:",
        CONNECT_SRC: "'self'",
        FRAME_ANCESTORS: "'none'",
        BASE_URI: "'self'",
        FORM_ACTION: "'self' mailto:"
    },
    
    // Configuración de headers de seguridad
    SECURITY_HEADERS: {
        X_FRAME_OPTIONS: 'DENY',
        X_CONTENT_TYPE_OPTIONS: 'nosniff',
        X_XSS_PROTECTION: '1; mode=block',
        REFERRER_POLICY: 'strict-origin-when-cross-origin',
        PERMISSIONS_POLICY: 'geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=(), speaker=()'
    },
    
    // Configuración de detección de automatización
    AUTOMATION_DETECTION: {
        ENABLED: true,
        CHECK_INTERVAL: 1000, // milisegundos
        THRESHOLD: 160 // diferencia de tamaño de ventana
    },
    
    // Configuración de monitoreo de rendimiento
    PERFORMANCE_MONITORING: {
        ENABLED: true,
        MAX_LOAD_TIME: 5000, // milisegundos
        MEMORY_THRESHOLD: 100 * 1024 * 1024 // 100MB
    }
};

// Función para obtener la configuración de CSP como string
function getCSPString() {
    const csp = SecurityConfig.CSP;
    return Object.entries(csp)
        .map(([key, value]) => `${key.replace(/_/g, '-').toLowerCase()} ${value}`)
        .join('; ');
}

// Función para validar configuración
function validateSecurityConfig() {
    const errors = [];
    
    // Validar rate limiting
    if (SecurityConfig.RATE_LIMITING.MAX_FORM_ATTEMPTS < 1) {
        errors.push('MAX_FORM_ATTEMPTS debe ser mayor a 0');
    }
    
    if (SecurityConfig.RATE_LIMITING.FORM_COOLDOWN_TIME < 60000) {
        errors.push('FORM_COOLDOWN_TIME debe ser al menos 1 minuto');
    }
    
    // Validar patrones de amenazas
    Object.entries(SecurityConfig.THREAT_PATTERNS).forEach(([type, patterns]) => {
        if (!Array.isArray(patterns) || patterns.length === 0) {
            errors.push(`THREAT_PATTERNS.${type} debe ser un array no vacío`);
        }
    });
    
    // Validar configuración de entrada
    Object.entries(SecurityConfig.INPUT_VALIDATION).forEach(([field, config]) => {
        if (config.MIN_LENGTH < 0 || config.MAX_LENGTH < config.MIN_LENGTH) {
            errors.push(`INPUT_VALIDATION.${field} tiene configuración inválida`);
        }
    });
    
    if (errors.length > 0) {
        console.error('Errores en la configuración de seguridad:', errors);
        return false;
    }
    
    return true;
}

// Exportar configuración
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SecurityConfig, getCSPString, validateSecurityConfig };
}
