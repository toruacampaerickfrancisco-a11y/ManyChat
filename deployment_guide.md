# Guía de Despliegue en Google Cloud (IP: 34.68.109.91)

Esta guía detalla los pasos para poner en producción tu aplicación en tu instancia de Google Cloud, enlazándola con tu dominio `clipop.com.mx`.

---

## 1. Cambiar el Puerto del Backend en Producción
Para que **Nginx** pueda manejar el tráfico en el puerto `80` (HTTP) y `443` (HTTPS) para el certificado de seguridad, tu servidor de Node.js debe ejecutarse internamente en otro puerto (por ejemplo, el puerto `3000`).

Modifica tu archivo `ecosystem.config.js` en tu servidor para que use el puerto `3000`:

```javascript
module.exports = {
  apps: [{
    name: 'clipop-backend',
    script: './server.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '400M',
    env: {
      NODE_ENV: 'production',
      PORT: 3000 // Cambiado de 80 a 3000
    }
  }]
};
```

---

## 2. Compilar el Frontend
Antes de subir o iniciar el proyecto en producción, debes compilar el frontend para generar la carpeta `dist`. En la carpeta `frontend/` ejecuta:

```bash
npm run build
```
Esto creará la carpeta `frontend/dist/` que contiene todos los archivos optimizados de la interfaz.

---

## 3. Iniciar el Servidor con PM2
En la carpeta `backend/` de tu servidor en Google Cloud, inicia el servidor:

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

Puedes verificar que el servidor esté corriendo en el puerto 3000 local:
```bash
curl http://localhost:3000/api/health
```

---

## 4. Configurar Nginx como Proxy Inverso
Nginx se encargará de recibir todas las peticiones desde el dominio `clipop.com.mx` (puerto 80) y redirigirlas a tu aplicación.

1. **Instalar Nginx** en tu servidor Debian/Ubuntu de Google Cloud:
   ```bash
   sudo apt update
   sudo apt install nginx -y
   ```

2. **Crear archivo de configuración:**
   Crea y edita el archivo de configuración para tu sitio:
   ```bash
   sudo nano /etc/nginx/sites-available/clipop
   ```

3. **Pegar la siguiente configuración:**
   ```nginx
   server {
       listen 80;
       server_name clipop.com.mx www.clipop.com.mx;

       # Redirige todo el tráfico al backend que sirve tanto la API como el frontend
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```

4. **Habilitar el sitio y reiniciar Nginx:**
   ```bash
   sudo ln -s /etc/nginx/sites-available/clipop /etc/nginx/sites-enabled/
   sudo rm /etc/nginx/sites-enabled/default  # Elimina la configuración por defecto de Nginx
   sudo nginx -t                             # Verifica que la sintaxis esté bien
   sudo systemctl restart nginx
   ```

---

## 5. Configurar HTTPS (SSL Gratis) con Let's Encrypt
Para proteger las conexiones y que el sitio use `https://clipop.com.mx`:

1. **Instalar Certbot:**
   ```bash
   sudo apt install certbot python3-certbot-nginx -y
   ```

2. **Generar e instalar el certificado automáticamente:**
   ```bash
   sudo certbot --nginx -d clipop.com.mx -d www.clipop.com.mx
   ```
   * Sigue las instrucciones en pantalla (introduce tu correo y acepta los términos). Certbot reconfigurará Nginx para que use HTTPS automáticamente.

¡Listo! Con esto tu dominio `clipop.com.mx` estará completamente enlazado, asegurado con HTTPS y apuntando a tu aplicación corriendo en segundo plano con PM2.
