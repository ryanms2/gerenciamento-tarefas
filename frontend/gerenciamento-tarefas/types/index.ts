export type SignInData = {
    email: string;
    password: string;
}

export type FormData = {
    name: string
    email: string
    password: string
}

export type Response = {
  data: {
    "message": string;
    "credentials": [
      {
        "id": number;
        "nome": string;
        "email": string;
      }
    ],
    "token": string;
  }
    
}

export type User = {
    id: number;
    nome: string;
    email: string;
}

export type AuthContextType = {
    isAuthenticated: boolean;
    user: User | null;
    signIn: (data: SignInData) => Promise<string | undefined>;
    updateUser: (data: User) => Promise<void>;
}

export type AuthTokenType = {
  data: {
    message: string;
    credentials: { id: number, nome: string, email: string };
  }
  
}

export type TaskUpdateStatusProps = {
    id: number;
    concluido_em: null | Date;
    status: string;
}

export type TaskUpdateProps = {
    id: number;
    token: string;
    titulo: string;
    descricao: string;
}

export type TaskUpdateChartsProps = {
    id: number;
    titulo: string;
    descricao: string;
    criado_em: Date;
    concluido_em: null | Date;
    status: string;
}

export type RecentActivitiesProps = {
    id: number;
    action: string;
    task: string;
    user: string;
    timestamp: string;
}