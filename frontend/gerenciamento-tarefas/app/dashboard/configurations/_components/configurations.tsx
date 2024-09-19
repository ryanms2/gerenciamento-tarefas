"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { parseCookies, destroyCookie, setCookie } from "nookies";
import { deleteAccountUser, updateAccountUser } from "@/services/data";
import { AuthContext } from "@/context/authContext";
import { toast } from "@/components/ui/use-toast";
import { DarkMode } from "../../_components/_components/darkMode";
import { useTheme } from "next-themes";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export function ConfigurationsPage() {
  const { user, updateUser } = useContext(AuthContext);
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState<string | undefined>()
  const [name, setName] = useState<string | undefined>()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deletePassword, setDeletePassword] = useState("")
  const [deleteError, setDeleteError] = useState("")
  const [deleteSuccess, setDeleteSuccess] = useState(false)
  const router = useRouter()
  const { setTheme, theme } = useTheme()
  const [themeSelect, setThemeSelect] = useState(theme)

  useEffect(() => {
    const { 'gerentarefas.token': token } = parseCookies();
      
      if(!token) {
        return router.push('/auth')
      }
      
  }, [router, user])

  useEffect(() => {
    setName(user?.nome)
    setEmail(user?.email)
  }, [user])

  const handleChangeThemes = () => {
    setTheme(themeSelect || 'dark')
  }

  const deleteAccount = async() => {
    if(!deletePassword) {
      setDeleteError("Please enter your password to delete your account")
      return
    }
    const { 'gerentarefas.token': token } = parseCookies();
    const response = await deleteAccountUser(token, deletePassword);
    if(response.message === 'User deleted') {
      setDeleteSuccess(true)
      setDeleteError("")

      destroyCookie(undefined, 'gerentarefas.token');
      router.push('/auth')
    } else {
      setDeleteError(response.message)
      setDeleteSuccess(false)
    }
  }

  const updateAccount = async() => {
    const { 'gerentarefas.token': token } = parseCookies();
    const response = await updateAccountUser(token, name || '', email || '', password);
    if(response.message === 'User updated') {
      destroyCookie(undefined, 'gerentarefas.token');
      setCookie(undefined, 'gerentarefas.token', response.token, {
        maxAge: 60 * 60 * 1, // 1 hour
      });

      updateUser({
        id: user?.id || 0,
        nome: name || '',
        email: email || ''
      });

      toast({
        title: "User updated",
        description: "Your account has been updated successfully",
      });
    }

    

    setName(user?.nome)
    setEmail(user?.email)
  }

  return (
    <div className="flex w-screen">
     
      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8 overflow-auto">
        <h1 className="text-3xl font-bold mb-6 mt-12 md:mt-0">Configurations</h1>

        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
          </TabsList>
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
                <CardDescription>Manage your account details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" value={name} onChange={e => setName(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" placeholder="*******" value={password} onChange={e => setPassword(e.target.value)} />
                </div>
              </CardContent>
              <CardFooter className="justify-between">
                <Button onClick={updateAccount}>Save Changes</Button>
                <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="destructive">
                        Delete Account
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Are you sure you want to delete your account?</DialogTitle>
                        <DialogDescription>
                          This action cannot be undone. Please enter your password to confirm.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="delete-password">Password</Label>
                          <Input
                            id="delete-password"
                            type="password"
                            placeholder="Enter your password"
                            value={deletePassword}
                            onChange={(e) => setDeletePassword(e.target.value)}
                          />
                        </div>
                        {deleteError && (
                          <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{deleteError}</AlertDescription>
                          </Alert>
                        )}
                        {deleteSuccess && (
                          <Alert>
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Success</AlertTitle>
                            <AlertDescription>Your account has been successfully deleted.</AlertDescription>
                          </Alert>
                        )}
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={deleteAccount}>Delete Account</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle>Appearance Settings</CardTitle>
                <CardDescription>Customize the look and feel of your dashboard</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="color-theme">Color Theme</Label>
                  <Select defaultValue="dark" value={themeSelect} onValueChange={setThemeSelect}>
                    <SelectTrigger id="color-theme">
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Blue</SelectItem>
                      <SelectItem value="dark">Dark Blue</SelectItem>
                      <SelectItem value="green">Green</SelectItem>
                      <SelectItem value="dark-green">Dark Green</SelectItem>
                      <SelectItem value="rose">Rose</SelectItem>
                      <SelectItem value="dark-rose">Dark Rose</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleChangeThemes}>Apply Theme</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}