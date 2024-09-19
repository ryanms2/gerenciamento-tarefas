import { Router } from "express";
import taskRouter from "./tasks";
import usersRouter from "./users";


const routers = Router();

routers.use('/', taskRouter);
routers.use('/', usersRouter);


export default routers;