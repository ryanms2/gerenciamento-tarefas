import { Router } from "express";
import { usersController } from "../controller/users";
import { userMiddleware } from "../middleware/user";


const usersRouter = Router();

usersRouter.post('/user',
    userMiddleware.checkEmailAndPassword,
    usersController.getUser
);

usersRouter.post('/user/register',
    userMiddleware.checkRegisterUser,
    usersController.createUser
);

usersRouter.put('/user',
    userMiddleware.checkToken,
    usersController.updateUser
);

usersRouter.delete('/user/:password',
    userMiddleware.checkToken,
    userMiddleware.checkDeleteUser,
    usersController.deleteUser
);

usersRouter.post('/user/token', 
    userMiddleware.checkToken, 
    usersController.checkToken
);

export default usersRouter;