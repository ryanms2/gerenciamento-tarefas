import { NextFunction, Response, Request } from "express";

import jwt from 'jsonwebtoken';

export const userMiddleware = {
    checkEmailAndPassword: async (req: Request, res: Response, next: NextFunction) => {
        const { password, email } = req.body;

        if (!password) {
            return res.status(400).json({ message: 'password is required' });
        }

        if (!email) {
            return res.status(400).json({ message: 'email is required' });
        }

        next();
    },

    checkRegisterUser: async (req: Request, res: Response, next: NextFunction) => {
        const { name, password, email } = req.body;

        if (!password) {
            return res.status(400).json({ message: 'password is required' });
        }

        if (!email) {
            return res.status(400).json({ message: 'email is required' });
        }

        if (!name) {
            return res.status(400).json({ message: 'name is required' });
        }

        next();
    },

    checkDeleteUser: async (req: Request, res: Response, next: NextFunction) => {
        const { password } = req.params;

        if (!password) {
            return res.status(400).json({ message: 'password is required' });
        }

        next();
    },

    checkToken: async (req: Request, res: Response, next: NextFunction) => {
        const token = req.headers.authorization?.split(' ')[1] ?? '';

        if (!token) {
            return res.status(401).json({ message: 'Token is required' });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET ?? '') as jwt.JwtPayload;
            
            if (decoded.exp && Date.now() >= decoded.exp * 1000) {
                return res.status(401).json({ message: 'Token has expired' });
            }
            
            next();
        } catch (error) {
            console.error(error);
            return res.status(401).json({ message: 'Token is invalid' });
        }
    }
}