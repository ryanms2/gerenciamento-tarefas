"use server";

import { TaskUpdateProps, TaskUpdateStatusProps } from "@/types";
import { api } from "./api";



export async function getTasks(token: string) {
    api.defaults.headers['Authorization'] = `Bearer ${token}`
    try {
        const response = await api.get("/tasks");
        return response.data;
    } catch (error: any) {
        console.log(error)
        return error.response.data;
    }
}

export async function createTasks(titulo: string, descricao: string, token: string) {
    api.defaults.headers['Authorization'] = `Bearer ${token}`
    try {
        const response = await api.post("/tasks", { titulo, descricao });
        return response.data;
    } catch (error: any) {
        console.log(error)
        return error.response.data;
    }
}


export async function updateStatusTasks({ id, concluido_em, status }: TaskUpdateStatusProps, token: string) {

    api.defaults.headers['Authorization'] = `Bearer ${token}`
    try {
        
        const response = await api.put("/tasks/status", { id, status ,concluido_em });

        return response.data;
    } catch (error: any) {
        console.log(error)
        return error.response.data;
    }
}

export async function updateTaskData({ id, token, titulo, descricao }: TaskUpdateProps) {

    api.defaults.headers['Authorization'] = `Bearer ${token}`
    try {
        const response = await api.put("/tasks", { id, titulo, descricao });
        return response.data;
    } catch (error: any) {
        console.log(error)
        return error.response.data;
    }

}

export async function deleteTasks(id: number, token: string) {

    api.defaults.headers['Authorization'] = `Bearer ${token}`
    
    try {
        const response = await api.delete(`/tasks:${id}`);
        return response.data;
    } catch (error: any) {
        console.log(error)
        return error.response.data;
    }
}

export async function deleteAccountUser(token: string, password: string) {

    api.defaults.headers['Authorization'] = `Bearer ${token}`
    
    try {
        const response = await api.delete(`/user/${password}`);
        return response.data;
    } catch (error: any) {
        console.log(error)
        return error.response.data;
    }
}

export async function updateAccountUser(token: string, name: string, email: string, password: string, image: string) {

    api.defaults.headers['Authorization'] = `Bearer ${token}`
    
    try {
        const response = await api.put(`/user`, { name, email, password, image });
        return response.data;
    } catch (error: any) {
        console.log(error)
        return error.response.data;
    }

}

export async function createAccountUser(name: string, email: string, password: string) {
    
    try {
        const response = await api.post(`/user/register`, { name, email, password });
        console.log(response)
        return response.data;
    } catch (error: any) {
        console.log(error)
        return error.response.data;
    }

}
