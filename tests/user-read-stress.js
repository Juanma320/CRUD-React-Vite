console.log('📖 Prueba de estrés de lectura - GET /api/users')

// Configuración de la prueba de carga
const CONCURRENT_USERS = 10   // Más usuarios para lectura (menos costoso)
const REQUESTS_PER_USER = 20  // Más requests por usuario
const TOTAL_REQUESTS = CONCURRENT_USERS * REQUESTS_PER_USER // Total: 10 × 20 = 200 requests

/**
 * Simula un usuario individual haciendo múltiples requests GET
 * @param {number} userId - ID único del usuario (1-10)
 * @returns {Object} Resultados con conteo de éxitos y errores
 */
async function simulateUser(userId) {
  const results = { success: 0, errors: 0 }

  // Cada usuario hace 20 requests GET de forma secuencial
  for (let i = 1; i <= REQUESTS_PER_USER; i++) {
    try {
      // Hacer request GET al endpoint de usuarios
      const response = await fetch('http://localhost:4000/api/users', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
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

console.log(`👥 Simulando ${CONCURRENT_USERS} usuarios concurrentes`)
console.log(`📖 ${REQUESTS_PER_USER} requests GET por usuario = ${TOTAL_REQUESTS} total`)

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

  // Calcular velocidad y tasa de éxito
  const reqPerSec = (TOTAL_REQUESTS / duration).toFixed(1)
  const successRate = ((totalSuccess / TOTAL_REQUESTS) * 100).toFixed(1)

  // Mostrar resumen final de la prueba
  console.log('\n\n📊 RESULTADOS:')
  console.log(`   Usuarios concurrentes: ${CONCURRENT_USERS}`)
  console.log(`   Requests totales: ${TOTAL_REQUESTS}`)
  console.log(`   Éxitos: ${totalSuccess} (${successRate}%)`)
  console.log(`   Errores: ${totalErrors}`)
  console.log(`   Velocidad: ${reqPerSec} req/sec`)
  console.log(`   Duración: ${duration}s`)
})