"use server";

import { api } from "@/services/api";

type SignInData = {
  email: string;
  password: string;
}

type Response = {
data: {
  "message": string;
  "credentials": [
    {
      "id": number;
      "nome": string;
      "email": string;
      "imagem": string;
    }
  ],
  "token": string;
}
  
}

export async function login({ email, password }: SignInData) {

  try {
    const response: Response = await api.post("/user", { email, password });

      if (response.data.token) {
        const { token, credentials, message } = response.data;
        const { id, nome, email, imagem } = credentials[0];
        const user = { id, nome, email, imagem };
        return { message, token, user };
      }
  } catch (error: any) {
    return error.response.data;
    
  }
      
    
}