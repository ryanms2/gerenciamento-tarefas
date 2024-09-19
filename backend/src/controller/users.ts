import { Request, Response } from "express";
import { connect } from "../model/database";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { decode } from "punycode";

export const usersController = {
    getUser: async (req: Request, res: Response) => {
        // se o retorno de connect() for null, então o objeto vazio é retornado
        const { connection, closeConnection } = await connect() ?? {};

        const { email, password } = req.body;

        const query = 'SELECT id, nome, email FROM usuarios WHERE email = ?';
        const queryCheckPassword = 'SELECT senha FROM usuarios WHERE email = ?';
        try {
            const resultCheckPassword = await connection?.query(queryCheckPassword, [email]);
            const userPassword = Object(resultCheckPassword?.[0]) 
            
            const passwordDecypted = await bcrypt.compare(password, userPassword[0]?.senha);

            if (!passwordDecypted) {
                return res.status(401).json({ message: 'Email or password is invalid' });
            }
            const result = await connection?.query(query, [email]);
            const user = Object(result?.[0])

            const token = jwt.sign({ id: user[0].id, nome: user[0].nome, email: user[0].email }, process.env.JWT_SECRET ?? '', { expiresIn: '1h' });

            return res.status(200).json({ 
                message: 'login success', 
                credentials: user,
                token
             });

        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    },

    createUser: async (req: Request, res: Response) => {
        // se o retorno de connect() for null, então o objeto vazio é retornado
        const { connection, closeConnection } = await connect() ?? {};

        const { name, email, password } = req.body;

        const query = 'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)';
        try {
            const passwordBcrypted = await bcrypt.hash(password, 10);
            const result = await connection?.query(query, [name, email, passwordBcrypted]);

            return res.status(201).json({ message: 'User created' });

        } catch (error: any) {
            console.log(error);
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ message: 'Email already registered' });
            }
            return res.status(500).json({ message: 'Internal server error' });
        }
    },

    updateUser: async (req: Request, res: Response) => {
        // se o retorno de connect() for null, então o objeto vazio é retornado
        const { connection, closeConnection } = await connect() ?? {};

        const { name, email, password } = req.body;
        const token = req.headers.authorization?.split(' ')[1] ?? '';
        const decoded = jwt.verify(token, process.env.JWT_SECRET ?? '') as { id: number };

        try {
            if (name) {
                const updateNameQuery = 'UPDATE usuarios SET nome = ? WHERE id = ?';
                await connection?.query(updateNameQuery, [name, decoded.id]);
            }

            if (email) {
                const updateEmailQuery = 'UPDATE usuarios SET email = ? WHERE id = ?';
                await connection?.query(updateEmailQuery, [email, decoded.id]);
            }

            if (password) {
                const updatePasswordQuery = 'UPDATE usuarios SET senha = ? WHERE id = ?';
                const passwordBcrypted = await bcrypt.hash(password, 10);
                await connection?.query(updatePasswordQuery, [passwordBcrypted, decoded.id]);
            }

            const query = 'SELECT id, nome, email FROM usuarios WHERE email = ?';

            const result = await connection?.query(query, [email]);
            const user = Object(result?.[0])

            const token = jwt.sign({ id: user[0].id, nome: user[0].nome, email: user[0].email }, process.env.JWT_SECRET ?? '', { expiresIn: '1h' });

            return res.status(200).json({ message: 'User updated', token });

        } catch (error: any) {
            console.log(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    },

    deleteUser: async (req: Request, res: Response) => {
        // se o retorno de connect() for null, então o objeto vazio é retornado
        const { connection, closeConnection } = await connect() ?? {};

        const { password } = req.params;
        const token = req.headers.authorization?.split(' ')[1] ?? '';
        const decoded = jwt.verify(token, process.env.JWT_SECRET ?? '') as { id: number };

        const queryCheckPassword = 'SELECT senha FROM usuarios WHERE id = ?';

        const query = 'DELETE FROM usuarios WHERE id = ?';

        const queryDeleteTasks = 'DELETE FROM tarefas WHERE usuario_id = ?';
        try {
            const resultCheckPassword = await connection?.query(queryCheckPassword, [decoded.id]);
            const user = resultCheckPassword?.[0]
            const toObject = Object(user)
            const passwordDecypted = await bcrypt.compare(password, toObject[0].senha);

            if (!passwordDecypted) {
                return res.status(401).json({ message: 'Password is invalid' });
            }

            await connection?.query(queryDeleteTasks, [decoded.id]);
            await connection?.query(query, [decoded.id]);

            return res.status(200).json({ message: 'User deleted' });

        } catch (error: any) {
            console.log(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    },

    checkToken: async (req: Request, res: Response) => {
        const token = req.headers.authorization?.split(' ')[1] ?? '';

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET ?? '') as { id: number, nome: string, email: string };
            return res.status(200).json({ message: 'Token is valid', credentials: decoded });

        } catch (error) {
            return res.status(401).json({ message: 'Token is invalid' });
        }
    }
}