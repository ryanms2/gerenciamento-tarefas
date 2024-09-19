import { Request, Response } from "express";
import { connect } from "../model/database";

import jwt from 'jsonwebtoken';

export const tasksController = {
    getTasks: async (req: Request, res: Response) => {
        // se o retorno de connect() for null, então o objeto vazio é retornado
        const { connection, closeConnection } = await connect() ?? {};

        const token = req.headers.authorization?.split(' ')[1] ?? '';
        
        
        const query = 'SELECT concluido_em, criado_em, descricao, id, status, titulo FROM tarefas WHERE usuario_id = ? ORDER BY id DESC';
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET ?? '') as { id: number, nome: string, email: string };
            const result = await connection?.query(query, [decoded.id]);
            const allTasks = result?.[0]
            return res.status(200).json(allTasks); 
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
        
    },

    createTask: async (req: Request, res: Response) => {
        // se o retorno de connect() for null, então o objeto vazio é retornado
        const { connection, closeConnection } = await connect() ?? {};
        const token = req.headers.authorization?.split(' ')[1] ?? '';
        const decoded = jwt.verify(token, process.env.JWT_SECRET ?? '') as { id: number, nome: string, email: string };
        
        const { titulo, descricao } = req.body;

        const query = 'INSERT INTO tarefas (titulo, descricao, usuario_id) VALUES (?, ?, ?)';
        try {
            await connection?.query(query, [titulo, descricao, decoded.id]);
            return res.status(201).json({ message: 'Task created' });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    },

    updateTask: async (req: Request, res: Response) => {
        // se o retorno de connect() for null, então o objeto vazio é retornado
        const { connection, closeConnection } = await connect() ?? {};

        const { id, titulo, descricao, concluido_em, status } = req.body;

        const query = 'UPDATE tarefas SET titulo = ?, descricao = ?, concluido_em = ?, status = ? WHERE id = ?';
        try {
            await connection?.query(query, [titulo, descricao, concluido_em, status, id]);
            return res.status(200).json({ message: 'Task updated' });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    },

    updateStatusTask: async (req: Request, res: Response) => {
        // se o retorno de connect() for null, então o objeto vazio é retornado
        const { connection, closeConnection } = await connect() ?? {};

        const { id, status, concluido_em } = req.body;

        
        try {
            if(concluido_em === null) {
                const query = 'UPDATE tarefas SET status = ?, concluido_em = ? WHERE id = ?';
                await connection?.query(query, [status, null, id]);
                return res.status(200).json({ message: 'Task status updated' });
            }

            const query = 'UPDATE tarefas SET status = ?, concluido_em = ? WHERE id = ?';
            const convertedDate = new Date(concluido_em).toISOString().slice(0, 19).replace('T', ' ');
            await connection?.query(query, [status, convertedDate, id]);
            return res.status(200).json({ message: 'Task status updated' });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    },

    deleteTask: async (req: Request, res: Response) => {
        // se o retorno de connect() for null, então o objeto vazio é retornado
        const { connection, closeConnection } = await connect() ?? {};

        const id = req.params.id.split(':')[1];

        const query = 'DELETE FROM tarefas WHERE id = ?';
        try {
            await connection?.query(query, [id]);
            return res.status(200).json({ message: 'Task deleted' });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    },

    
}
