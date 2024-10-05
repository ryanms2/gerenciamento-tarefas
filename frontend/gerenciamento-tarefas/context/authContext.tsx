"use client"

import { createContext, useEffect, useState } from "react";
import { parseCookies, setCookie } from "nookies";
import { api } from "@/services/api";
import { login } from "@/auth";
import { AuthContextType, AuthTokenType, SignInData, User } from "@/types";



export const AuthContext = createContext({} as AuthContextType);

export function AuthProvider({ children }: any) {
  const [ user, setUser ] = useState<User | null>(null);
  const isAuthenticated = !!user;


  useEffect(() => {
    const { 'gerentarefas.token': token } = parseCookies();

    if(token) {
      const validateToken = async() => {
        try {
          const validateToken: AuthTokenType = await api.post("/user/token", {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
          });

        setUser({
          id: validateToken.data.credentials.id,
          nome: validateToken.data.credentials.nome,
          email: validateToken.data.credentials.email,
          imagem: validateToken.data.credentials.imagem,
        });
        } catch (error: any) {
          return error.response;
        }
        
      }
      validateToken();
    }
  }, [])

  async function updateUser({ id, nome, email, imagem }: User) {
    
    
    setUser({
      id,
      nome,
      email,
      imagem
    });
  }

  async function signIn({ email, password }: SignInData) {

    try {
      const response = await login({ email, password });
      if (response?.message === "login success") {
      
      setCookie(undefined, 'gerentarefas.token', response?.token, {
        maxAge: 60 * 60 * 1, // 1 hour
      })

      api.defaults.headers['Authorization'] = `Bearer ${response.token}`;

  
      setUser(response.user);
      return true
    }

    return response?.message;
    } catch (error: any) {
      return error.response.data.message; 
      
    }
    
      
    
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, signIn, updateUser }}>
        {children}
    </AuthContext.Provider>
  )
    
}