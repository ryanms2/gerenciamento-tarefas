'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Eye, EyeOff, CheckCircle2, XCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from 'next/link'
import { createAccountUser } from '@/services/data'
import { toast } from '@/components/ui/use-toast'
import { useRouter } from 'next/navigation'
import { FormData } from "@/types";



const passwordStrengthRegex = {
  strong: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  medium: /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{8,}$/
}

export function SignUp() {
  const [showPassword, setShowPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong' | null>(null)
  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>()
  const router = useRouter()

  const password = watch('password')

  const checkPasswordStrength = (password: string) => {
    if (passwordStrengthRegex.strong.test(password)) {
      setPasswordStrength('strong')
    } else if (passwordStrengthRegex.medium.test(password)) {
      setPasswordStrength('medium')
    } else {
      setPasswordStrength('weak')
    }
  }

  const onSubmit = async(data: FormData) => {
    if (passwordStrength === 'weak') {
      alert('Please choose a stronger password')
      return
    }
    
    const response = await createAccountUser(data.name, data.email, data.password)
    if(response.message === "User created") {
      toast({
        title: "Account created",
        description: "Your account has been created successfully",
      });
      router.push('/auth')
    } else {
      toast({
        title: "Error",
        description: response.message,
      });
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen ">
    <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Sign Up</CardTitle>
            <CardDescription className="text-center">Create a new account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" type="text" {...register('name', { required: 'Name is required' })} />
                {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' } })}
                />
                {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    {...register('password', { 
                      required: 'Password is required',
                      minLength: { value: 8, message: 'Password must be at least 8 characters' },
                      onChange: (e) => checkPasswordStrength(e.target.value)
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4 text-gray-500" /> : <Eye className="h-4 w-4 text-gray-500" />}
                  </button>
                </div>
                {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
              </div>
              {password && passwordStrength && (
                <Alert variant={passwordStrength === 'strong' ? 'default' : 'destructive'}>
                  <AlertTitle className="flex items-center">
                    {passwordStrength === 'strong' ? (
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                    ) : (
                      <XCircle className="h-4 w-4 mr-2" />
                    )}
                    Password Strength: {passwordStrength}
                  </AlertTitle>
                  <AlertDescription>
                    {passwordStrength === 'weak' && 'Your password is too weak. It should be at least 8 characters long and include uppercase, lowercase, numbers, and special characters.'}
                    {passwordStrength === 'medium' && 'Your password is okay, but could be stronger. Try adding special characters.'}
                    {passwordStrength === 'strong' && 'Your password is strong!'}
                  </AlertDescription>
                </Alert>
              )}
              <Button type="submit" className="w-full" disabled={passwordStrength === 'weak'}>
                Create Account
              </Button>
            </form>
          </CardContent>
          <CardFooter className="text-sm text-center text-gray-500">
            Already have an account? <Link href="/auth" className="text-primary hover:underline">
            Sign in
            </Link> 
          </CardFooter>
        </Card>
    </div>
    
  )
}