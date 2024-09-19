import { NextFunction, Response, Request } from "express";

export const taskMiddleware = {
    checkCreateTask: async (req: Request, res: Response, next: NextFunction) => {
        const { titulo, descricao } = req.body;

        if (!titulo) {
            return res.status(400).json({ message: 'title is required' });
        }

        if (!descricao) {
            return res.status(400).json({ message: 'description is required' });
        }

        next();
    },

    checkUpdateStatusTask: async (req: Request, res: Response, next: NextFunction) => {
        const { id, status } = req.body;

        if (!id) {
            return res.status(400).json({ message: 'id is required' });
        }

        if (!status) {
            return res.status(400).json({ message: 'status is required' });
        }

        next();
    },

    checkDeleteTask: async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const Taskid = id.split(':')[1];
        if (!Taskid) {
            return res.status(400).json({ message: 'taskId is required' });
        }

        next();
    }
}
