const pool = require('../db/connection');

const getUsers = async (_, res) => {
  const result = await pool.query("SELECT * FROM users ORDER BY id ASC");
  res.json(result.rows);
};

const getUserById = async (req, res) => {
  const { id } = req.params;
  const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
  if (result.rows.length === 0) {
    return res.status(404).json({ message: "Usuario no encontrado" });
  }
  res.json(result.rows[0]);
};

const createUser = async (req, res) => {
  const { name, email } = req.body;
  const result = await pool.query(
    "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *",
    [name, email]
  );
  res.json(result.rows[0]);
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  const result = await pool.query(
    "UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *",
    [name, email, id]
  );
  res.json(result.rows[0]);
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  await pool.query("DELETE FROM users WHERE id = $1", [id]);
  res.json({ message: "Usuario eliminado" });
};

const resetSequence = async (req, res) => {
  try {
    await pool.query("ALTER SEQUENCE users_id_seq RESTART WITH 1");
    res.json({ message: "Secuencia reiniciada exitosamente" });
  } catch (error) {
    console.error("Error al reiniciar secuencia:", error);
    res.status(500).json({ message: "Error al reiniciar secuencia" });
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  resetSequence
};