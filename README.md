# ModernCRUD ✨

Una aplicación CRUD moderna y elegante construida con las últimas tecnologías web. Gestión de usuarios con una interfaz futurista, animaciones fluidas y experiencia de usuario excepcional.

## ✨ Funcionalidades

- **Gestión completa de usuarios** - Crear, editar, eliminar y visualizar
- **Búsqueda en tiempo real** - Filtrado instantáneo por nombre y email
- **Drag & Drop** - Reordenamiento visual activando modo especial
- **Tema dinámico** - Claro, oscuro o automático según sistema
- **Interfaz moderna** - Glassmorphism, animaciones y micro-interacciones
- **Notificaciones elegantes** - Toast y diálogos de confirmación
- **Responsive design** - Optimizado para móvil, tablet y desktop

## 🛠️ Stack Tecnológico

### Frontend
- **React 19** - Framework principal
- **TypeScript** - Type safety
- **Vite** - Build tool y dev server
- **Tailwind CSS 4** - Utility-first CSS
- **Framer Motion** - Animaciones y gestos
- **Lucide React** - Iconos modernos
- **React Router DOM** - Navegación SPA
- **Axios** - Cliente HTTP

### Backend
- **Node.js + Express** - API REST
- **PostgreSQL** - Base de datos
- **JavaScript** - Lógica del servidor
- **CORS** - Cross-origin requests

### Herramientas de Desarrollo
- **pnpm** - Gestor de paquetes con workspace
- **ESLint** - Linting
- **Nodemon** - Auto-reload del servidor
- **Vercel CLI** - Desarrollo y despliegue serverless

## 📋 Requisitos

- **Node.js** 18+
- **PostgreSQL** 12+
- **pnpm** 8+

## 🏢 Arquitectura del Proyecto

```
CRUD-React/
├── src/                   # Frontend (Vite + React + TS)
│   ├── components/ui/     # Componentes reutilizables
│   ├── contexts/          # Context providers (Theme, Toast)
│   ├── hooks/             # Custom hooks
│   ├── pages/             # Páginas principales
│   ├── services/          # Axios → apunta a /api/*
│   └── types/             # Definiciones de tipos
│
├── backend/               # Backend Express (solo lógica, sin listen)
│   ├── src/
│   │   ├── app.js         # Define app Express (rutas, middlewares)
│   │   ├── routes/        # Rutas (ej. users.routes.js)
│   │   ├── controllers/   # Controladores
│   │   └── db/            # Conexión a PostgreSQL
│   ├── server.js          # Solo para local → levanta en puerto 4000
│   └── package.json       # Dependencias backend
│
├── api/                   # Wrappers para Vercel (serverless)
│   ├── package.json       # Configuración CommonJS
│   └── users.js           # Importa app y expone handler
│
├── tests/                 # Suite de pruebas de estrés
│
├── .env                   # Variables de entorno
├── .env.example           # Template de variables
├── package.json           # Dependencias raíz (frontend)
├── pnpm-workspace.yaml    # Define workspaces (frontend + backend + api)
├── vite.config.ts         # Proxy en dev → /api → http://localhost:4000
└── vercel.json            # Configuración de despliegue
```

## 🗄️ Configuración de Base de Datos

```sql
-- Crear tabla
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(150) NOT NULL,
    PRIMARY KEY ("id"),
    UNIQUE ("email")
);

-- Insertar registros de ejemplo
INSERT INTO "users" ("name", "email") VALUES
('Juan', 'juan@mail.com'),
('Ana', 'ana@mail.com'),
('Luis', 'luis@mail.com');
```

## 🚀 Instalación

### 1. Clonar y configurar el proyecto
```bash
# Clonar el repositorio
git clone <repository-url>
cd CRUD-React

# Instalar todas las dependencias (frontend + backend)
pnpm install
```

### 2. Configurar base de datos
```bash
# Configurar variables de entorno (archivo en la raíz)
copy .env.example .env
# Editar .env con tus credenciales de PostgreSQL y Neon
```

### 3. Ejecutar el proyecto

El proyecto utiliza **detección automática** de base de datos según el entorno:

#### Opción A: Desarrollo con PostgreSQL local
```bash
# Terminal 1 - Frontend (con proxy a backend)
pnpm run dev:front

# Terminal 2 - Backend → usa variables PG_* del .env
pnpm run dev:back
```

#### Opción B: Desarrollo con Neon
```bash
# Con script personalizado → fuerza VERCEL=1 y usa Neon
pnpm run vercel:dev

# Con Vercel CLI directo → usa variables locales (PostgreSQL)
vercel dev
```

> **💡 Lógica de detección:**
> - `pnpm run vercel:dev` → Establece `VERCEL=1` → Neon
> - `vercel dev` → No establece `VERCEL=1` → PostgreSQL local
> - Variables `PG_*` presentes → PostgreSQL local

### 4. Despliegue en Vercel
```bash
# Instalar Vercel CLI
npm i -g vercel

# Desplegar
vercel

# Configurar variable de entorno en Vercel Dashboard:
# POSTGRES_URL=postgresql://usuario:contraseña@host:puerto/nombre_db?sslmode=require
```

## 🧪 Testing

El proyecto incluye scripts de pruebas de estrés en la carpeta `tests/`:

```bash
# Pruebas de estrés para operaciones CRUD
node tests/user-creation-stress.js
node tests/user-read-stress.js
node tests/user-update-stress.js
node tests/user-delete-stress.js
node tests/reset-sequence.js
```

Para más detalles sobre las pruebas, consulta el [README de pruebas](tests/README.md).