import express from "express";
import cors from "cors";
import { Pool } from "pg";
import dotenv from "dotenv";

const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();

// Conexión a BD
const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: Number(process.env.PG_PORT),
});

// Rutas CRUD

// Ruta de bienvenida
app.get("/", (_, res) => {
  res.send("Bienvenido al backend del CRUD de React + PostgreSQL");
});

// Listar usuarios
app.get("/api/users", async (_, res) => {
  const result = await pool.query("SELECT * FROM users ORDER BY id ASC");
  res.json(result.rows);
});

// Obtener un usuario por ID
app.get("/api/users/:id", async (req, res) => {
  const { id } = req.params;
  const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
  if (result.rows.length === 0) {
    return res.status(404).json({ message: "Usuario no encontrado" });
  }
  res.json(result.rows[0]);
});

// Crear usuario
app.post("/api/users", async (req, res) => {
  const { name, email } = req.body;
  const result = await pool.query(
    "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *",
    [name, email]
  );
  res.json(result.rows[0]);
});

// Actualizar usuario
app.put("/api/users/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  const result = await pool.query(
    "UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *",
    [name, email, id]
  );
  res.json(result.rows[0]);
});

// Eliminar usuario
app.delete("/api/users/:id", async (req, res) => {
  const { id } = req.params;
  await pool.query("DELETE FROM users WHERE id = $1", [id]);
  res.json({ message: "Usuario eliminado" });
});

// Levantar servidor
app.listen(4000, () => {
  console.log("Servidor corriendo en http://localhost:4000");
});