console.log('🔄 Reiniciando secuencia de IDs de usuarios')

// Función para reiniciar la secuencia de PostgreSQL
async function resetUserSequence() {
  try {
    console.log('🔍 Conectando a la base de datos...')

    // Hacer request al backend para reiniciar secuencia
    const response = await fetch('http://localhost:4000/api/users/reset-sequence', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    })

    if (response.ok) {
      console.log('✅ Secuencia reiniciada exitosamente')
      console.log('💡 Los próximos usuarios tendrán IDs: 1, 2, 3...')
    } else {
      console.log('❌ Error al reiniciar secuencia')
      console.log('💡 Puedes hacerlo manualmente en PostgreSQL:')
      console.log('   ALTER SEQUENCE users_id_seq RESTART WITH 1;')
    }
  } catch (error) {
    console.log('❌ No se pudo conectar al backend')
    console.error('Error:', error.message)
    console.log('💡 Reinicia manualmente en PostgreSQL:')
    console.log('   ALTER SEQUENCE users_id_seq RESTART WITH 1;')
  }
}

resetUserSequence()