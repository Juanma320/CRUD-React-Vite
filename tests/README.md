# 🧪 Pruebas de Estrés CRUD

Suite completa de pruebas de estrés para la API de usuarios.

## 📁 Estructura

```
tests/
├── user-creation-stress.js    # POST /api/users (Crear usuarios)
├── user-read-stress.js        # GET /api/users (Leer usuarios)
├── user-update-stress.js      # PUT /api/users/:id (Actualizar usuarios)
├── user-delete-stress.js      # DELETE /api/users/:id (Eliminar usuarios)
├── reset-sequence.js          # Reiniciar secuencia de IDs
└── README.md                  # Esta documentación
```

## 🚀 Uso

### 1. Crear usuarios (POST)
```bash
node tests/user-creation-stress.js
```
- **Usuarios concurrentes**: 5
- **Requests por usuario**: 10
- **Total**: 50 usuarios creados
- **Datos**: Únicos garantizados

### 2. Leer usuarios (GET)
```bash
node tests/user-read-stress.js
```
- **Usuarios concurrentes**: 10
- **Requests por usuario**: 20
- **Total**: 200 lecturas
- **Ideal para**: Probar cache y rendimiento de BD

### 3. Actualizar usuarios (PUT)
```bash
node tests/user-update-stress.js
```
- **Usuarios concurrentes**: 5
- **Requests por usuario**: 8
- **Total**: 40 actualizaciones
- **Inteligente**: Obtiene IDs reales de usuarios existentes
- **Seguro**: Advierte si no hay suficientes usuarios
- **Automático**: No asume IDs específicos

### 4. Eliminar usuarios (DELETE)
```bash
node tests/user-delete-stress.js
```
- **Usuarios concurrentes**: 3
- **Requests por usuario**: 5
- **Total**: 15 eliminaciones
- **⚠️ CUIDADO**: Elimina datos reales
- **Inteligente**: Obtiene usuarios reales de la BD
- **Seguro**: Elimina los últimos N usuarios (menos riesgoso)
- **Confirmación**: Muestra usuarios a eliminar y pide confirmación
- **Transparente**: Sabes exactamente qué se eliminará

### 5. Reiniciar secuencia de IDs
```bash
node tests/reset-sequence.js
```
- **Propósito**: Reinicia los IDs a 1, 2, 3...
- **Útil**: Después de eliminar muchos usuarios
- **Desarrollo**: Solo para entorno de desarrollo

## 📊 Interpretación de Resultados

### ✅ Símbolos en tiempo real:
- `✅` = Request exitoso
- `❌` = Request fallido

### 📈 Métricas finales:
- **Usuarios concurrentes**: Nivel de paralelismo
- **Requests totales**: Cantidad total de operaciones
- **Éxitos**: Operaciones completadas correctamente
- **Errores**: Fallos (red, BD, validación)
- **Velocidad**: Requests por segundo
- **Duración**: Tiempo total de la prueba

## 🎯 Orden Recomendado

1. **Primero**: `user-creation-stress.js` (crear datos)
2. **Segundo**: `user-read-stress.js` (probar lectura)
3. **Tercero**: `user-update-stress.js` (probar actualización)
4. **Cuarto**: `user-delete-stress.js` (limpiar datos)
5. **Opcional**: `reset-sequence.js` (reiniciar IDs para próximas pruebas)

## ⚙️ Configuración

Cada script tiene constantes configurables:
```javascript
const CONCURRENT_USERS = 5    // Ajustar según capacidad del servidor
const REQUESTS_PER_USER = 10  // Ajustar según duración deseada
```

## 🔧 Requisitos

- Backend corriendo en `http://localhost:4000`
- Endpoint `/api/users` implementado (GET, POST, PUT, DELETE)
- Endpoint `/api/users/reset-sequence` implementado
- Base de datos PostgreSQL configurada

## 🛡️ Características de Seguridad

### Scripts UPDATE y DELETE mejorados:
- **✅ Obtención dinámica**: Consultan la BD para obtener IDs reales
- **✅ Validación inteligente**: Verifican que existan usuarios suficientes
- **✅ Confirmación interactiva**: DELETE pide confirmación antes de eliminar
- **✅ Estrategia segura**: DELETE elimina los últimos usuarios (menos riesgoso)
- **✅ Transparencia total**: Muestran exactamente qué harán antes de hacerlo

## 💡 Consejos

### IDs altos después de pruebas:
Si después de muchas pruebas los IDs son muy altos (ej: 8000+), usa:
```bash
node tests/reset-sequence.js
```

### Flujo completo de pruebas:
```bash
# 1. Crear datos de prueba
node tests/user-creation-stress.js

# 2. Probar operaciones de lectura
node tests/user-read-stress.js

# 3. Probar actualizaciones (usa IDs reales)
node tests/user-update-stress.js

# 4. Limpiar datos (pide confirmación)
node tests/user-delete-stress.js
# → Muestra usuarios a eliminar
# → Escribe 's' para confirmar

# 5. Reiniciar IDs para próximas pruebas
node tests/reset-sequence.js
```

### Ejemplo de confirmación DELETE:
```bash
🚨 USUARIOS QUE SERÁN ELIMINADOS:
   1. ID: 45 - User5_10_1703123456789 (user5_10@test.com)
   2. ID: 46 - User1_1_1703123456790 (user1_1@test.com)
   ...
⚠️ ¿Estás seguro de eliminar estos usuarios? (s/N): s
```