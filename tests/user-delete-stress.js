import readline from 'readline'

console.log('🗑️ Prueba de estrés de eliminación - DELETE /api/users/:id')

// Configuración de la prueba de carga
const CONCURRENT_USERS = 3    // Menos usuarios (eliminaciones son irreversibles)
const REQUESTS_PER_USER = 5   // Pocos requests (elimina datos reales)
const TOTAL_REQUESTS = CONCURRENT_USERS * REQUESTS_PER_USER // Total: 3 × 5 = 15 requests

// Array para almacenar IDs de usuarios a eliminar
let usersToDelete = []
let currentIndex = 0

/**
 * Obtiene los últimos usuarios existentes desde la API
 * @returns {Array} Array de usuarios con sus datos completos
 */
async function fetchUsersToDelete() {
  try {
    console.log('🔍 Obteniendo usuarios existentes...')
    const response = await fetch('http://localhost:4000/api/users')

    if (!response.ok) {
      throw new Error(`Error al obtener usuarios: ${response.status}`)
    }

    const users = await response.json()

    if (users.length === 0) {
      console.log('❌ No hay usuarios en la base de datos')
      return []
    }

    // Tomar los últimos N usuarios (menos riesgoso)
    const usersToDelete = users.slice(-TOTAL_REQUESTS)

    console.log(`✅ Encontrados ${users.length} usuarios totales`)
    console.log(`🎯 Seleccionados los últimos ${usersToDelete.length} usuarios para eliminar`)

    return usersToDelete
  } catch (error) {
    console.error('❌ Error al obtener usuarios:', error.message)
    console.log('💡 Asegúrate de que el backend esté corriendo')
    process.exit(1)
  }
}

/**
 * Muestra los usuarios que serán eliminados y pide confirmación
 * @param {Array} users - Array de usuarios a eliminar
 * @returns {Promise<boolean>} True si el usuario confirma
 */
async function confirmDeletion(users) {
  console.log('\n🚨 USUARIOS QUE SERÁN ELIMINADOS:')
  users.forEach((user, index) => {
    console.log(`   ${index + 1}. ID: ${user.id} - ${user.name} (${user.email})`)
  })

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  return new Promise((resolve) => {
    rl.question('\n⚠️ ¿Estás seguro de eliminar estos usuarios? (s/N): ', (answer) => {
      rl.close()
      resolve(answer.toLowerCase() === 's' || answer.toLowerCase() === 'si')
    })
  })
}

/**
 * Simula un usuario individual haciendo múltiples requests DELETE
 * @param {number} userId - ID único del usuario (1-3)
 * @returns {Object} Resultados con conteo de éxitos y errores
 */
async function simulateUser(userId) {
  const results = { success: 0, errors: 0 }

  // Cada usuario hace 5 requests DELETE de forma secuencial
  for (let i = 1; i <= REQUESTS_PER_USER; i++) {
    try {
      // Obtener el siguiente usuario a eliminar
      const userToDelete = usersToDelete[currentIndex++]

      if (!userToDelete) {
        console.error(`\n⚠️ No hay más usuarios disponibles para eliminar`)
        results.errors++
        process.stdout.write('❌')
        continue
      }

      // Hacer request DELETE al endpoint de usuarios
      const response = await fetch(`http://localhost:4000/api/users/${userToDelete.id}`, {
        method: 'DELETE',
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

/**
 * Función principal que ejecuta la prueba de estrés
 */
async function runStressTest() {
  // Primero obtener usuarios a eliminar
  usersToDelete = await fetchUsersToDelete()

  if (usersToDelete.length === 0) {
    console.log('❌ No hay usuarios para eliminar. Ejecuta user-creation-stress.js primero.')
    return
  }

  // Pedir confirmación antes de eliminar
  const confirmed = await confirmDeletion(usersToDelete)

  if (!confirmed) {
    console.log('❌ Operación cancelada por el usuario.')
    return
  }

  console.log(`\n👥 Simulando ${CONCURRENT_USERS} usuarios concurrentes`)
  console.log(`🗑️ ${REQUESTS_PER_USER} requests DELETE por usuario = ${usersToDelete.length} total`)

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
    console.log(`\n🗑️ Usuarios eliminados exitosamente: ${totalSuccess}`)
  })
}

// Ejecutar la prueba
runStressTest().catch(error => {
  console.error('❌ Error en la prueba:', error.message)
  process.exit(1)
})