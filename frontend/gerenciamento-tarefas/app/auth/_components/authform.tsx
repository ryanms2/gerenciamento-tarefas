"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from '@/components/ui/use-toast';
import { useForm } from 'react-hook-form';
import { parseCookies } from 'nookies';
import { useContext, useEffect } from "react";
import { AuthContext } from "@/context/authContext";
import { useRouter } from "next/navigation";
import Link from "next/link";


export function LoginPage() {
    const { register, handleSubmit, formState } = useForm()
    const { signIn } = useContext(AuthContext)
    const router = useRouter();

  async function handleSignIn(data: any) {
    
      const response = await signIn(data);
      console.log(response);
      if (response === "Email or password is invalid" || response === undefined) {
        
        toast({
          title: "Email or password incorrect",
          description: "Please check your credentials and try again",
        });
        return;
      }

      return router.push('/dashboard');
       
  };

  useEffect(() => {
    const { 'gerentarefas.token': token } = parseCookies();
    
    if (token) {
      router.push('/dashboard');
    }
  })

  return (
    <div className="flex items-center justify-center min-h-screen ">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
          <CardDescription className="text-center">
            Enter your email and password to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(handleSignIn)}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="m@example.com" {...register('email')} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" {...register('password')} required />
              </div>
              <Button type="submit" className="w-full" 
              disabled={formState.isSubmitting} >
                {formState.isSubmitting ? 'Sending...' : 'Login'}
              </Button>
            </div>
          </form>
          <div className="mt-4 text-center">
            <a href="#" className="text-sm text-blue-600 hover:underline">
              Forgot password?
            </a>
          </div>
        </CardContent>
        <CardFooter className="flex flex-wrap items-center justify-between gap-2">
          <div className="text-sm text-gray-500">
            Don&apos;t have an account?
          </div>
          <Button variant="link" className="p-0 text-sm">
            <Link href={"/auth/signup"}>Sign up</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

