console.log('✏️ Prueba de estrés de actualización - PUT /api/users/:id')

// Configuración de la prueba de carga
const CONCURRENT_USERS = 5    // Usuarios concurrentes para actualizaciones
const REQUESTS_PER_USER = 8   // Menos requests (actualizaciones son costosas)
const TOTAL_REQUESTS = CONCURRENT_USERS * REQUESTS_PER_USER // Total: 5 × 8 = 40 requests

// Array para almacenar IDs de usuarios existentes
let availableUserIds = []
let currentIndex = 0

/**
 * Obtiene los IDs de usuarios existentes desde la API
 * @returns {Array} Array de IDs de usuarios
 */
async function fetchExistingUserIds() {
  try {
    console.log('🔍 Obteniendo usuarios existentes...')
    const response = await fetch('http://localhost:4000/api/users')

    if (!response.ok) {
      throw new Error(`Error al obtener usuarios: ${response.status}`)
    }

    const users = await response.json()
    const userIds = users.map(user => user.id)

    console.log(`✅ Encontrados ${userIds.length} usuarios existentes`)

    if (userIds.length < TOTAL_REQUESTS) {
      console.log(`⚠️ Advertencia: Solo hay ${userIds.length} usuarios, pero necesitas ${TOTAL_REQUESTS}`)
      console.log(`💡 Ejecuta user-creation-stress.js primero para crear más usuarios`)
    }

    return userIds.slice(0, TOTAL_REQUESTS) // Tomar solo los que necesitamos
  } catch (error) {
    console.error('❌ Error al obtener usuarios:', error.message)
    console.log('💡 Asegúrate de que el backend esté corriendo y tenga usuarios')
    process.exit(1)
  }
}

/**
 * Simula un usuario individual haciendo múltiples requests PUT
 * @param {number} userId - ID único del usuario (1-5)
 * @returns {Object} Resultados con conteo de éxitos y errores
 */
async function simulateUser(userId) {
  const results = { success: 0, errors: 0 }

  // Cada usuario hace 8 requests PUT de forma secuencial
  for (let i = 1; i <= REQUESTS_PER_USER; i++) {
    try {
      // Obtener el siguiente ID de usuario disponible
      const targetUserId = availableUserIds[currentIndex++]

      if (!targetUserId) {
        console.error(`\n⚠️ No hay más usuarios disponibles para actualizar`)
        results.errors++
        process.stdout.write('❌')
        continue
      }

      // Hacer request PUT al endpoint de usuarios
      const response = await fetch(`http://localhost:4000/api/users/${targetUserId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // Generar datos actualizados únicos
          name: `UpdatedUser${userId}_${i}_${Date.now()}`,
          email: `updated${userId}_${i}_${Date.now()}@test.com`
        })
      })

      // Verificar si el request fue exitoso (status 200-299)
      if (response.ok) {
        results.success++
        process.stdout.write('✅') // Mostrar éxito en tiempo real
      } else {
        results.errors++
        process.stdout.write('❌') // Mostrar error en tiempo real
      }
    } catch (error) {
      // Manejar errores de red o conexión
      results.errors++
      process.stdout.write('❌')
      console.error(`\nError en usuario ${userId}, request ${i}:`, error.message)
    }
  }

  return results
}

/**
 * Función principal que ejecuta la prueba de estrés
 */
async function runStressTest() {
  // Primero obtener IDs de usuarios existentes
  availableUserIds = await fetchExistingUserIds()

  if (availableUserIds.length === 0) {
    console.log('❌ No hay usuarios para actualizar. Saliendo...')
    return
  }

  console.log(`👥 Simulando ${CONCURRENT_USERS} usuarios concurrentes`)
  console.log(`✏️ ${REQUESTS_PER_USER} requests PUT por usuario = ${Math.min(TOTAL_REQUESTS, availableUserIds.length)} total`)

  // Marcar tiempo de inicio para calcular duración total
  const startTime = Date.now()

  // Crear array de promesas para ejecutar usuarios concurrentemente
  const userPromises = []
  for (let userId = 1; userId <= CONCURRENT_USERS; userId++) {
    // Cada llamada a simulateUser() se ejecuta en paralelo
    userPromises.push(simulateUser(userId))
  }

  // Esperar a que todos los usuarios terminen sus requests
  Promise.all(userPromises).then((results) => {
    // Calcular métricas finales
    const endTime = Date.now()
    const duration = (endTime - startTime) / 1000 // Duración en segundos

    // Sumar resultados de todos los usuarios
    const totalSuccess = results.reduce((sum, r) => sum + r.success, 0)
    const totalErrors = results.reduce((sum, r) => sum + r.errors, 0)
    const actualRequests = totalSuccess + totalErrors

    // Calcular velocidad y tasa de éxito
    const reqPerSec = (actualRequests / duration).toFixed(1)
    const successRate = actualRequests > 0 ? ((totalSuccess / actualRequests) * 100).toFixed(1) : '0.0'

    // Mostrar resumen final de la prueba
    console.log('\n\n📊 RESULTADOS:')
    console.log(`   Usuarios concurrentes: ${CONCURRENT_USERS}`)
    console.log(`   Requests totales: ${actualRequests}`)
    console.log(`   Éxitos: ${totalSuccess} (${successRate}%)`)
    console.log(`   Errores: ${totalErrors}`)
    console.log(`   Velocidad: ${reqPerSec} req/sec`)
    console.log(`   Duración: ${duration}s`)
  })
}

// Ejecutar la prueba
runStressTest().catch(error => {
  console.error('❌ Error en la prueba:', error.message)
  process.exit(1)
})