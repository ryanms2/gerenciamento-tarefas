import { Request, Response } from "express";
import { connect } from "../model/database";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const usersController = {
    getUser: async (req: Request, res: Response) => {
        const { connection, closeConnection } = await connect() ?? {};

        const { email, password } = req.body;

        const query = 'SELECT id, nome, email, imagem, senha FROM usuarios WHERE email = $1';
        try {
            const result = await connection?.query(query, [email]);
            const user = result?.rows[0];

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            const passwordDecypted = await bcrypt.compare(password, user.senha);

            if (!passwordDecypted) {
                return res.status(401).json({ message: 'Email or password is invalid' });
            }

            const token = jwt.sign({ id: user.id, nome: user.nome, email: user.email, imagem: user.imagem }, process.env.JWT_SECRET ?? '', { expiresIn: '1h' });
            return res.status(200).json({ 
                message: 'login success', 
                credentials: user,
                token
             });

        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Internal server error' });
        } finally {
            await closeConnection();
        }
    },

    createUser: async (req: Request, res: Response) => {
        const { connection, closeConnection } = await connect() ?? {};

        const { name, email, password } = req.body;

        const query = 'INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3)';
        try {
            const passwordBcrypted = await bcrypt.hash(password, 10);
            await connection?.query(query, [name, email, passwordBcrypted]);

            return res.status(201).json({ message: 'User created' });

        } catch (error: any) {
            console.log(error);
            if (error.code === '23505') { // Unique violation error code for PostgreSQL
                return res.status(409).json({ message: 'Email already registered' });
            }
            return res.status(500).json({ message: 'Internal server error' });
        } finally {
            await closeConnection();
        }
    },

    updateUser: async (req: Request, res: Response) => {
        const { connection, closeConnection } = await connect() ?? {};

        const { name, email, password, image } = req.body;
        const token = req.headers.authorization?.split(' ')[1] ?? '';
        const decoded = jwt.verify(token, process.env.JWT_SECRET ?? '') as { id: number };

        try {
            if (name) {
                const updateNameQuery = 'UPDATE usuarios SET nome = $1 WHERE id = $2';
                await connection?.query(updateNameQuery, [name, decoded.id]);
            }

            if (email) {
                const updateEmailQuery = 'UPDATE usuarios SET email = $1 WHERE id = $2';
                await connection?.query(updateEmailQuery, [email, decoded.id]);
            }

            if (password) {
                const updatePasswordQuery = 'UPDATE usuarios SET senha = $1 WHERE id = $2';
                const passwordBcrypted = await bcrypt.hash(password, 10);
                await connection?.query(updatePasswordQuery, [passwordBcrypted, decoded.id]);
            }

            if (image) {
                const updateImagemQuery = 'UPDATE usuarios SET imagem = $1 WHERE id = $2';
                await connection?.query(updateImagemQuery, [image, decoded.id]);
            }

            const query = 'SELECT id, nome, email, imagem FROM usuarios WHERE id = $1';
            const result = await connection?.query(query, [decoded.id]);
            const user = result?.rows[0];

            const newToken = jwt.sign({ id: user.id, nome: user.nome, email: user.email, imagem: user.imagem }, process.env.JWT_SECRET ?? '', { expiresIn: '1h' });

            return res.status(200).json({ message: 'User updated', token: newToken });

        } catch (error: any) {
            console.log(error);
            return res.status(500).json({ message: 'Internal server error' });
        } finally {
            await closeConnection();
        }
    },

    deleteUser: async (req: Request, res: Response) => {
        const { connection, closeConnection } = await connect() ?? {};

        const { password } = req.params;
        const token = req.headers.authorization?.split(' ')[1] ?? '';
        const decoded = jwt.verify(token, process.env.JWT_SECRET ?? '') as { id: number };

        const queryCheckPassword = 'SELECT senha FROM usuarios WHERE id = $1';
        const queryDeleteUser = 'DELETE FROM usuarios WHERE id = $1';
        const queryDeleteTasks = 'DELETE FROM tarefas WHERE usuario_id = $1';

        try {
            const resultCheckPassword = await connection?.query(queryCheckPassword, [decoded.id]);
            const user = resultCheckPassword?.rows[0];

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            const passwordDecypted = await bcrypt.compare(password, user.senha);

            if (!passwordDecypted) {
                return res.status(401).json({ message: 'Password is invalid' });
            }

            await connection?.query(queryDeleteTasks, [decoded.id]);
            await connection?.query(queryDeleteUser, [decoded.id]);

            return res.status(200).json({ message: 'User deleted' });

        } catch (error: any) {
            console.log(error);
            return res.status(500).json({ message: 'Internal server error' });
        } finally {
            await closeConnection();
        }
    },

    checkToken: async (req: Request, res: Response) => {
        const token = req.headers.authorization?.split(' ')[1] ?? '';

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET ?? '') as { id: number, nome: string, email: string, imagem: string };
            return res.status(200).json({ message: 'Token is valid', credentials: decoded });

        } catch (error) {
            return res.status(401).json({ message: 'Token is invalid' });
        }
    }
}