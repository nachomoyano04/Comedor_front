# Sistema de Comedor Escolar — Aplicación Frontend

Interfaz de usuario SPA (Single Page Application) desarrollada con React y Vite para la administración y operación del sistema de comedor escolar.

---

## 🛠️ Tecnologías

- **Librería UI:** React 19
- **Bundler y Servidor Dev:** Vite 7
- **Enrutamiento:** React Router v7
- **Cliente HTTP:** Axios (con interceptor de renovación concurrente de sesión y soporte de cookies `withCredentials`)
- **Diseño y Componentes:** Bootstrap 5, FontAwesome, React Select, SweetAlert2

---

## 📋 Requisitos Previos

- Node.js >= 18.0.0
- Backend de Comedor en ejecución

---

## 🚀 Instalación y Puesta en Marcha

### 1. Clonar el repositorio
```bash
git clone https://github.com/nachomoyano04/Comedor_front.git
cd Comedor_front/comedor_front
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configuración de Variables de Entorno
Copiar el archivo de plantilla `.env.example`:
```bash
cp .env.example .env
```
Configurar la URL de la API backend en `.env`:
```dotenv
VITE_API_URL=http://localhost:6970
```

> **Nota para Producción:** En despliegues como Vercel, configure la variable de entorno `VITE_API_URL` apuntando a la URL pública del backend HTTPS (por ejemplo, `https://comedor-api.onrender.com`).

### 4. Ejecutar la Aplicación

- **Modo Desarrollo:**
  ```bash
  npm run dev
  ```
  La aplicación estará disponible por defecto en `http://localhost:5173`.

- **Compilación para Producción:**
  ```bash
  npm run build
  ```
  Genera los artefactos minificados y optimizados en la carpeta `dist/`.

- **Previsualizar Build de Producción:**
  ```bash
  npm run preview
  ```

---

## 🔒 Arquitectura de Autenticación y Seguridad

- **Manejo de Sesión:** El frontend utiliza interceptores de Axios para la gestión de respuestas `401 Unauthorized`. Ante expiración del token de acceso, el interceptor encola solicitudes concurrentes y solicita un nuevo access token a `/usuario/auth/refresh` enviando la cookie de refresh token de forma segura.
- **Despliegue Multi-Dominio:** Compatible con configuración de cookies cross-site (`SameSite=none; Secure=true`) cuando el frontend y el backend están alojados en dominios independientes.
