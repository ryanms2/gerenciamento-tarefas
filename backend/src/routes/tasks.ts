import { Router } from "express";
import { tasksController } from "../controller/tasks";
import { userMiddleware } from "../middleware/user";
import { taskMiddleware } from "../middleware/task";

const taskRouter = Router();

taskRouter.get('/tasks',
    userMiddleware.checkToken,
    tasksController.getTasks
);

taskRouter.post('/tasks',
    userMiddleware.checkToken,
    taskMiddleware.checkCreateTask,
    tasksController.createTask
);

taskRouter.put('/tasks',
    userMiddleware.checkToken,
    tasksController.updateTask
);

taskRouter.put('/tasks/status',
    userMiddleware.checkToken,
    taskMiddleware.checkUpdateStatusTask,
    tasksController.updateStatusTask
);

taskRouter.delete('/tasks:id',
    userMiddleware.checkToken,
    taskMiddleware.checkDeleteTask,
    tasksController.deleteTask
);

export default taskRouter;