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
- **TypeScript** - Type safety
- **CORS** - Cross-origin requests

### Herramientas de Desarrollo
- **pnpm** - Gestor de paquetes con workspace
- **ESLint** - Linting
- **Nodemon** - Auto-reload del servidor
- **ts-node** - Ejecutor de TypeScript

## 📋 Requisitos

- **Node.js** 18+
- **PostgreSQL** 12+
- **pnpm** 8+

## 🏢 Arquitectura del Proyecto

```
CRUD-React/
├── src/                # Frontend React (raíz)
│   ├── components/ui/  # Componentes reutilizables
│   ├── contexts/       # Context providers (Theme, Toast)
│   ├── hooks/          # Custom hooks
│   ├── pages/          # Páginas principales
│   ├── services/       # API y servicios externos
│   └── types/          # Definiciones de tipos
├── backend/            # API Express + PostgreSQL
│   ├── src/index.ts    # Servidor principal
│   └── package.json    # Backend dependencies
├── tests/              # Suite de pruebas de estrés
├── package.json        # Frontend dependencies
└── pnpm-workspace.yaml # Configuración de workspace
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
# Configurar variables de entorno
cd backend
copy .env.example .env
# Editar .env con tus credenciales de PostgreSQL
```

### 3. Ejecutar el proyecto
```bash
# Terminal 1 - Frontend
pnpm run dev

# Terminal 2 - Backend
cd backend
pnpm run dev
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