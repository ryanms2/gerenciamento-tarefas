import axios from "axios";
import { parseCookies } from "nookies";

export function getAPIClient(ctx?: any) {
    const { 'gerentarefas.token': token } = parseCookies(ctx);
    
    const api = axios.create({
        baseURL: 'http://localhost:3004/api'
    })

    if(token) {
        api.defaults.headers['Authorization'] = `Bearer ${token}`
    }

    return api;
}