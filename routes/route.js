const express = require('express');
const router = express.Router();
const sql = require('mssql');

// Recebe o pool criado em server.js e retorna o router configurado
function criarConexao(pool) {
    // GET /api/tarefas - listar todas as tarefas
    router.get('/', async (req, res) => {
        try {
            const result = await pool.request().query('SELECT id, texto, created_at FROM tarefas ORDER BY created_at DESC');
            res.json(result.recordset);
        } catch (erro) {
            console.error('Erro ao buscar tarefas:', erro);
            res.status(500).json({ erro: 'Erro ao buscar tarefas' });
        }
    });

    // POST /api/tarefas - criar nova tarefa
    router.post('/', async (req, res) => {
        try {
            const { texto } = req.body;
            if (!texto || !texto.trim()) {
                return res.status(400).json({ erro: 'Texto da tarefa é obrigatório' });
            }

            const request = pool.request();
            request.input('texto', sql.NVarChar(255), texto.trim());

            // Retorna a linha inserida
            const result = await request.query('INSERT INTO tarefas (texto) OUTPUT INSERTED.id, INSERTED.texto, INSERTED.created_at VALUES (@texto)');
            res.status(201).json(result.recordset[0]);
        } catch (erro) {
            console.error('Erro ao criar tarefa:', erro);
            res.status(500).json({ erro: 'Erro ao criar tarefa' });
        }
    });

    // DELETE /api/tarefas/:id - apagar tarefa
    router.delete('/:id', async (req, res) => {
        try {
            const id = parseInt(req.params.id, 10);
            if (Number.isNaN(id)) return res.status(400).json({ erro: 'ID inválido' });

            const request = pool.request();
            request.input('id', sql.Int, id);
            const result = await request.query('DELETE FROM tarefas WHERE id = @id');

            if (result.rowsAffected[0] === 0) return res.status(404).json({ erro: 'Tarefa não encontrada' });
            res.json({ mensagem: 'Tarefa removida com sucesso' });
        } catch (erro) {
            console.error('Erro ao apagar tarefa:', erro);
            res.status(500).json({ erro: 'Erro ao apagar tarefa' });
        }
    });

    return router;
}

module.exports = criarConexao;