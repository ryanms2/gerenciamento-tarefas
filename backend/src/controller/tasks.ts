import { Request, Response } from "express";
import { connect } from "../model/database";
import jwt from 'jsonwebtoken';

export const tasksController = {
    getTasks: async (req: Request, res: Response) => {
        const { connection, closeConnection } = await connect() ?? {};
        const token = req.headers.authorization?.split(' ')[1] ?? '';

        const query = 'SELECT concluido_em, criado_em, descricao, id, status, titulo FROM tarefas WHERE usuario_id = $1 ORDER BY id DESC';
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET ?? '') as { id: number, nome: string, email: string };
            const result = await connection?.query(query, [decoded.id]);
            const allTasks = result?.rows;
            return res.status(200).json(allTasks);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal server error' });
        } finally {
            await closeConnection();
        }
    },

    createTask: async (req: Request, res: Response) => {
        const { connection, closeConnection } = await connect() ?? {};
        const token = req.headers.authorization?.split(' ')[1] ?? '';
        const decoded = jwt.verify(token, process.env.JWT_SECRET ?? '') as { id: number, nome: string, email: string };

        const { titulo, descricao } = req.body;
        const query = 'INSERT INTO tarefas (titulo, descricao, usuario_id) VALUES ($1, $2, $3) RETURNING *';
        try {
            await connection?.query(query, [titulo, descricao, decoded.id]);
            return res.status(201).json({ message: 'Task created' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal server error' });
        } finally {
            await closeConnection();
        }
    },

    updateTask: async (req: Request, res: Response) => {
        const { connection, closeConnection } = await connect() ?? {};
        const { id, titulo, descricao, concluido_em, status } = req.body;
        const query = 'UPDATE tarefas SET titulo = $1, descricao = $2, concluido_em = $3, status = $4 WHERE id = $5';
        try {
            await connection?.query(query, [titulo, descricao, concluido_em, status, id]);
            return res.status(200).json({ message: 'Task updated' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal server error' });
        } finally {
            await closeConnection();
        }
    },

    updateStatusTask: async (req: Request, res: Response) => {
        const { connection, closeConnection } = await connect() ?? {};
        const { id, status, concluido_em } = req.body;

        const query = 'UPDATE tarefas SET status = $1, concluido_em = $2 WHERE id = $3';
        try {
            const convertedDate = concluido_em ? new Date(concluido_em).toISOString().slice(0, 19).replace('T', ' ') : null;
            await connection?.query(query, [status, convertedDate, id]);
            return res.status(200).json({ message: 'Task status updated' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal server error' });
        } finally {
            await closeConnection();
        }
    },

    deleteTask: async (req: Request, res: Response) => {
        const { connection, closeConnection } = await connect() ?? {};
        const id = req.params.id.split(':')[1];
        const query = 'DELETE FROM tarefas WHERE id = $1';
        try {
            await connection?.query(query, [id]);
            return res.status(200).json({ message: 'Task deleted' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal server error' });
        } finally {
            await closeConnection();
        }
    },
}
