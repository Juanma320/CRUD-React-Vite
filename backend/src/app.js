const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/users.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_, res) => {
  res.send("Bienvenido al backend del CRUD de React + PostgreSQL");
});

app.use('/api/users', userRoutes);

module.exports = app;