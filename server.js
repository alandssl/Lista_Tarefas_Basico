require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const sql = require('mssql');

const tarefasRoutes = require('./routes/route');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER || 'localhost',
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 1433,
  options: {
    encrypt: process.env.DB_ENCRYPT === 'true',
    trustServerCertificate: true
  }
};

async function start() {
  try {
    const pool = await sql.connect(dbConfig);
    console.log('Conectado ao SQL Server');

    // Registra as rotas de tarefas, injetando o pool
    app.use('/api/tarefas', tarefasRoutes(pool));

    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`Servidor rodando em http://localhost:${port}`));
  } catch (err) {
    console.error('Erro ao iniciar servidor:', err);
    process.exit(1);
  }
}

start();