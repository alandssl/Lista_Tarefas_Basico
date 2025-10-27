const express = require('express');
const router = express.Router();

// Função para criar a conexão com o banco
function criarConexao(pool) {
    // Rotas para tarefas
    
    // GET /api/tarefas - Listar todas as tarefas
    router.get('/', async (req, res) => {
        try {
            const [rows] = await pool.query('SELECT * FROM tarefas ORDER BY created_at DESC');
            res.json(rows);
        } catch (erro) {
            console.error('Erro ao buscar tarefas:', erro);
            res.status(500).json({ erro: 'Erro ao buscar tarefas' });
        }
    });

    // POST /api/tarefas - Criar nova tarefa
    router.post('/', async (req, res) => {
        try {
            const { texto } = req.body;
            if (!texto) {
                return res.status(400).json({ erro: 'Texto da tarefa é obrigatório' });
            }

            const [result] = await pool.query(
                'INSERT INTO tarefas (texto) VALUES (?)',
                [texto]
            );

            const [novaTarefa] = await pool.query(
                'SELECT * FROM tarefas WHERE id = ?',
                [result.insertId]
            );

            res.status(201).json(novaTarefa[0]);
        } catch (erro) {
            console.error('Erro ao criar tarefa:', erro);
            res.status(500).json({ erro: 'Erro ao criar tarefa' });
        }
    });

    // DELETE /api/tarefas/:id - Apagar uma tarefa
    router.delete('/:id', async (req, res) => {
        try {
            const { id } = req.params;
            
            const [result] = await pool.query(
                'DELETE FROM tarefas WHERE id = ?',
                [id]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({ erro: 'Tarefa não encontrada' });
            }

            res.status(200).json({ mensagem: 'Tarefa removida com sucesso' });
        } catch (erro) {
            console.error('Erro ao apagar tarefa:', erro);
            res.status(500).json({ erro: 'Erro ao apagar tarefa' });
        }
    });

    return router;
}

module.exports = criarConexao;