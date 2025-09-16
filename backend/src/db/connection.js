const { Pool } = require('pg');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(process.cwd(), '../.env') });

// Determinar qué configuración usar
const useNeon = process.env.VERCEL || !process.env.PG_USER;

// Configuración de conexión
const pool = new Pool(
  useNeon
    ? {
      // Vercel o sin variables locales -> usar Neon
      connectionString: process.env.POSTGRES_URL,
      ssl: { rejectUnauthorized: false }
    }
    : {
      // Desarrollo local -> usar PostgreSQL local
      user: process.env.PG_USER,
      password: process.env.PG_PASSWORD,
      host: process.env.PG_HOST,
      port: process.env.PG_PORT,
      database: process.env.PG_DATABASE,
      ssl: false
    }
);

module.exports = pool;