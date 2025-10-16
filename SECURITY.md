# Guía de Seguridad - Landing Page Mapu

## Resumen de Implementaciones de Seguridad

Este documento describe las medidas de seguridad implementadas en la landing page de Mapu para proteger contra amenazas comunes y mejorar la seguridad general del sitio.

## 🔒 Medidas de Seguridad Implementadas

### 1. **Protección contra XSS (Cross-Site Scripting)**
- ✅ Sanitización de entrada de datos del lado del cliente
- ✅ Detección de patrones maliciosos en formularios
- ✅ Content Security Policy (CSP) implementado
- ✅ Validación estricta de tipos de datos

### 2. **Protección del Formulario de Contacto**
- ✅ Rate limiting (máximo 3 intentos por 5 minutos)
- ✅ Validación robusta de entrada
- ✅ Sanitización de datos antes del envío
- ✅ Detección de patrones sospechosos
- ✅ Logging de intentos de abuso

### 3. **Headers de Seguridad HTTP**
- ✅ `X-Frame-Options: DENY` - Previene clickjacking
- ✅ `X-Content-Type-Options: nosniff` - Previene MIME sniffing
- ✅ `X-XSS-Protection: 1; mode=block` - Protección XSS del navegador
- ✅ `Referrer-Policy: strict-origin-when-cross-origin` - Control de referrer
- ✅ `Permissions-Policy` - Restricción de APIs del navegador

### 4. **Content Security Policy (CSP)**
```html
default-src 'self';
script-src 'self' 'unsafe-inline';
style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://fonts.googleapis.com;
font-src 'self' https://cdnjs.cloudflare.com https://fonts.gstatic.com;
img-src 'self' data:;
connect-src 'self';
frame-ancestors 'none';
base-uri 'self';
form-action 'self' mailto:;
```

### 5. **Configuración de Servidor (.htaccess)**
- ✅ Protección de archivos sensibles
- ✅ Bloqueo de user agents maliciosos
- ✅ Protección contra inyección SQL
- ✅ Deshabilitación de listado de directorios
- ✅ Configuración de cache y compresión

### 6. **Sistema de Logging y Monitoreo**
- ✅ Logging de eventos de seguridad
- ✅ Detección de herramientas de desarrollo
- ✅ Detección de automatización (Selenium, PhantomJS)
- ✅ Monitoreo de intentos de debugging
- ✅ Logging de errores JavaScript

### 7. **Validación de Entrada Robusta**
- ✅ Validación de longitud de campos
- ✅ Validación de formato de email
- ✅ Validación de caracteres permitidos
- ✅ Detección de patrones maliciosos
- ✅ Sanitización automática de entrada

## 🛡️ Patrones de Amenazas Detectados

El sistema detecta y bloquea los siguientes patrones:

### XSS (Cross-Site Scripting)
- `<script>`, `javascript:`, `onload=`, `onerror=`
- `data:text/html`, `vbscript:`, `expression(`
- `<iframe>`, `<object>`, `<embed>`, `<link>`, `<meta>`

### Inyección SQL
- `union select`, `drop table`, `delete from`
- `insert into`, `update set`, `or 1=1`
- `'; drop`, `--`, `/*`

### Path Traversal
- `../`, `..\\`, `..%2f`, `..%5c`
- `%2e%2e%2f`, `%2e%2e%5c`

### Inyección de Comandos
- `; rm`, `; cat`, `; ls`, `; dir`
- `; del`, `; type`, `| nc`, `| netcat`

## 📊 Configuración de Rate Limiting

```javascript
RATE_LIMITING: {
    MAX_FORM_ATTEMPTS: 3,        // Máximo 3 intentos
    FORM_COOLDOWN_TIME: 300000,  // 5 minutos de cooldown
    MAX_REQUESTS_PER_MINUTE: 60  // 60 requests por minuto
}
```

## 🔍 Sistema de Logging

El sistema registra los siguientes eventos de seguridad:

- `SUSPICIOUS_ACTIVITY` - Actividad sospechosa detectada
- `FORM_ABUSE` - Abuso del formulario de contacto
- `XSS_ATTEMPT` - Intento de ataque XSS
- `DEVTOOLS_DETECTED` - Herramientas de desarrollo detectadas
- `AUTOMATION_DETECTED` - Automatización detectada
- `DEBUGGING_ATTEMPT` - Intento de debugging
- `JAVASCRIPT_ERROR` - Errores JavaScript
- `PAGE_LOADED` - Carga exitosa de la página

## 🚀 Recomendaciones Adicionales

### Para Producción:

1. **HTTPS Obligatorio**
   ```apache
   RewriteCond %{HTTPS} off
   RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
   ```

2. **HSTS (HTTP Strict Transport Security)**
   ```apache
   Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
   ```

3. **Logging en Servidor**
   - Implementar endpoint `/api/security-log` para recibir logs del cliente
   - Configurar rotación de logs
   - Implementar alertas automáticas

4. **Monitoreo Continuo**
   - Configurar alertas para eventos de seguridad críticos
   - Implementar dashboard de monitoreo
   - Revisar logs regularmente

5. **Backup y Recuperación**
   - Implementar backup automático de archivos
   - Plan de recuperación ante incidentes
   - Documentación de procedimientos de emergencia

## 🔧 Configuración del Servidor

### Apache (.htaccess)
El archivo `.htaccess` incluye:
- Headers de seguridad
- Protección de archivos
- Bloqueo de amenazas comunes
- Configuración de cache
- Compresión GZIP

### Nginx (alternativa)
Si usas Nginx, puedes implementar configuraciones similares:

```nginx
# Headers de seguridad
add_header X-Frame-Options "DENY" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;

# CSP
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://fonts.googleapis.com; font-src 'self' https://cdnjs.cloudflare.com https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self' mailto:;" always;
```

## 📝 Mantenimiento

### Revisión Regular:
- [ ] Verificar logs de seguridad semanalmente
- [ ] Actualizar patrones de amenazas mensualmente
- [ ] Revisar configuración de CSP trimestralmente
- [ ] Actualizar dependencias regularmente
- [ ] Realizar pruebas de penetración anualmente

### Monitoreo:
- [ ] Configurar alertas para eventos críticos
- [ ] Monitorear métricas de rendimiento
- [ ] Revisar intentos de acceso sospechosos
- [ ] Verificar integridad de archivos

## 🆘 Contacto de Seguridad

Para reportar vulnerabilidades de seguridad:
- Email: legendscode2025@gmail.com
- Asunto: [SECURITY] Vulnerabilidad en Mapu Landing Page

## 📄 Licencia

Este documento de seguridad es parte del proyecto Mapu y está sujeto a los mismos términos de licencia.

---

**Última actualización:** Diciembre 2024  
**Versión:** 1.0  
**Estado:** Implementado y Activo
