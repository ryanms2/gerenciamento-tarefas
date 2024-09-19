"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { DialogHeader, DialogFooter, Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {  Search, ArrowUpDown, Edit2, Trash2, PlusCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { TaskOverview } from "./_components/task_overview";
import { toast } from "@/components/ui/use-toast";
import { parseCookies } from "nookies";
import { useRouter } from "next/navigation";
import { createTasks, deleteTasks, getTasks, updateStatusTasks, updateTaskData } from "@/services/data";
import { TaskUpdateChartsProps } from "@/types";


export function ManagerDashboard() {
  const [tasks, setTasks] = useState<any>([])
  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [newTaskDescription, setNewTaskDescription] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortOrder, setSortOrder] = useState("descending")
  const [filteredTasks, setFilteredTasks] = useState<any>(tasks)
  const [editingTask, setEditingTask] = useState<any>(null)
  const [editTitle, setEditTitle] = useState("")
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editDescription, setEditDescription] = useState("")
  const router = useRouter()

  useEffect(() => {
      const { 'gerentarefas.token': token } = parseCookies();
      
      if(!token) {
        return router.push('/auth')
      }
      
      const findTasks = async () => {
        const fetchTasks = await getTasks(token)
        if(fetchTasks.message) {
          return setTasks([])
        }
        const newDate = fetchTasks.map((task: TaskUpdateChartsProps) => {
          return {
            ...task,
            criado_em: new Date(task.criado_em),
            concluido_em: task.concluido_em ? new Date(task.concluido_em) : null
          }
        })
        setTasks(newDate)
      }
      findTasks()
  }, [router])
  

  useEffect(() => {
    const filtered = tasks?.filter((task: TaskUpdateChartsProps) => 
      task.titulo.toLowerCase().includes(searchQuery.toLowerCase())
    )
    const sorted = [...filtered].sort((a: TaskUpdateChartsProps, b: TaskUpdateChartsProps) => 
      sortOrder === "descending" 
        ? b.criado_em.getTime() - a.criado_em.getTime()
        : a.criado_em.getTime() - b.criado_em.getTime()
    )
    setFilteredTasks(sorted)
  }, [tasks, searchQuery, sortOrder])

  const addTask = () => {
    if (newTaskTitle.trim() !== "" && newTaskDescription.trim() !== "") {

      const { 'gerentarefas.token': token } = parseCookies();

      const createTask = async () => {
        const data = await createTasks(newTaskTitle, newTaskDescription, token)
        if(data.message === "Task created") {
          const updateTasks = await getTasks(token)
          const newDate = updateTasks.map((task: TaskUpdateChartsProps) => {
            return {
              ...task,
              criado_em: new Date(task.criado_em),
              concluido_em: task.concluido_em ? new Date(task.concluido_em) : null
            }
          })
          setTasks(newDate)
          toast({
            title: "Task Created",
            description: "Your task has been successfully created.",
          })
        }

        setNewTaskTitle("")
        setNewTaskDescription("")

      }

      createTask()
    }
  }

  const deleteTask = (id: number) => {
   const { 'gerentarefas.token': token } = parseCookies();
   
    const removeTask = async () => {
      const data = await deleteTasks(id, token)
      
      if(data.message === "Task deleted") {
        const updateTasks = await getTasks(token)
        const newDate = updateTasks.map((task: TaskUpdateChartsProps) => {
          return {
            ...task,
            criado_em: new Date(task.criado_em),
            concluido_em: task.concluido_em ? new Date(task.concluido_em) : null
          }
        })
        setTasks(newDate)
        toast({
          title: "Task Deleted",
          description: "Your task has been successfully deleted.",
        })
      }
    }
    removeTask()
  }

 

  const updateTaskStatus = (task: TaskUpdateChartsProps, newStatus: string) => {
    const { 'gerentarefas.token': token } = parseCookies();
    const updateTask = async () => {
      const status = newStatus
      const { id } = task
      const completedDate = status === "concluida" ? new Date() : null
      const data = await updateStatusTasks( { id, status, concluido_em: completedDate  }, token )

      if(data.message === "Task status updated") {
        const updateTasks = await getTasks(token)
        
        const newDate = updateTasks.map((task: TaskUpdateChartsProps) => {
          return {
            ...task,
            criado_em: new Date(task.criado_em),
            concluido_em: task.concluido_em ? new Date(task.concluido_em) : null
          }
        })
        setTasks(newDate)
        toast({
          title: "Task Updated",
          description: "Your task has been successfully updated.",
        })
      }
    }
    updateTask()
  }

  const startEditingTask = (task: TaskUpdateChartsProps) => {
    setEditingTask(task)
    setEditTitle(task.titulo)
    setEditDescription(task.descricao)
  }

  const saveEditedTask = () => {
    if (editTitle.trim() !== "" && editDescription.trim() !== "") {
      const { 'gerentarefas.token': token } = parseCookies();
      const updateTask = async () => {
        const task = {
          id: editingTask?.id,
          token,
          titulo: editTitle,
          descricao: editDescription
        }
        const data = await updateTaskData(task)

        if(data.message === "Task updated") {
          const updateTasks = await getTasks(token)
          const newDate = updateTasks.map((task: TaskUpdateChartsProps) => {
            return {
              ...task,
              criado_em: new Date(task.criado_em),
              concluido_em: task.concluido_em ? new Date(task.concluido_em) : null
            }
          })

          setTasks(newDate)
          setIsEditDialogOpen(false)
          setEditingTask(null)
          toast({
            title: "Task Updated",
            description: "Your task has been successfully updated.",
          })
        }
      }
      updateTask()
    }
  }

  

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "descending" ? "ascending" : "descending")
  }
    return (
        <div className=" w-full p-4 md:p-8 overflow-auto">
        <h1 className="text-3xl font-bold mb-6 mt-12 md:mt-0">Manager Dashboard</h1>

        {/* Task Overview */}
        <TaskOverview tasks={tasks} />

        {/* Task Management */}
        <Tabs defaultValue="list" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="list">Task List</TabsTrigger>
            <TabsTrigger value="add">Add Task</TabsTrigger>
          </TabsList>
          <TabsContent value="list" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>All Tasks</CardTitle>
                <CardDescription>View and manage all tasks here.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row justify-between items-center mb-4 space-y-2 md:space-y-0">
                  <div className="relative w-full md:w-64">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search tasks"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                  <Button variant="outline" onClick={toggleSortOrder}>
                    <ArrowUpDown className="mr-2 h-4 w-4" />
                    {sortOrder === "descending" ? "Newest First" : "Oldest First"}
                  </Button>
                </div>
                <div className="space-y-4">
                  {filteredTasks.map((task: TaskUpdateChartsProps) => (
                    <div key={task.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1 mr-4 mb-2 md:mb-0">
                        <h3 className="font-semibold">{task.titulo}</h3>
                        <p className="text-sm text-gray-500 mt-1">{task.descricao}</p>
                        <div className="text-xs text-gray-400 mt-1">
                          Created: {formatDate(task.criado_em)}
                          {task.concluido_em && ` | Completed: ${formatDate(task.concluido_em)}`}
                        </div>
                      </div>
                      <div className="flex items-center justify-between md:justify-end w-full md:w-auto">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className={`px-2 py-1 text-xs ${
                                task.status === "concluída" ? "bg-green-100 text-green-800" :
                                task.status === "em andamento" ? "bg-yellow-100 text-yellow-800" :
                                "bg-gray-100 text-gray-800"
                              }`}
                            >
                              { task.status === "concluída" ? "Completed" : task.status === "em andamento" ? "In Progress" : "To Do"}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => updateTaskStatus(task, "pendente")}>
                              To Do
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateTaskStatus(task, "em andamento")}>
                              In Progress
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateTaskStatus(task, "concluida")}>
                              Completed
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <div className="flex ml-2">
                          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                            <DialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => startEditingTask(task)}
                                aria-label={`Edit task: ${task.titulo}`}
                              >
                                <Edit2 className="h-4 w-4 text-blue-500" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                              <DialogHeader>
                                <DialogTitle>Edit Task</DialogTitle>
                                <DialogDescription>
                                  Make changes to your task here. Click save when you re done.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor="edit-title" className="text-right">
                                    Title
                                  </Label>
                                  <Input
                                    id="edit-title"
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                    className="col-span-3"
                                  />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor="edit-description" className="text-right">
                                    Description
                                  </Label>
                                  <Textarea
                                    id="edit-description"
                                    value={editDescription}
                                    onChange={(e) => setEditDescription(e.target.value)}
                                    className="col-span-3"
                                  />
                                </div>
                              </div>
                              <DialogFooter>
                                <Button type="submit" onClick={saveEditedTask}>Save changes</Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => deleteTask(task.id)}
                            aria-label={`Delete task: ${task.titulo}`}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="add">
            <Card>
              <CardHeader>
                <CardTitle>Add New Task</CardTitle>
                <CardDescription>Create a new task for your team.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="task-title">Task Title</Label>
                  <Input 
                    id="task-title" 
                    placeholder="Enter task title" 
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="task-description">Task Description</Label>
                  <Textarea 
                    id="task-description" 
                    placeholder="Enter task description" 
                    value={newTaskDescription}
                    onChange={(e) => setNewTaskDescription(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={addTask}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Task
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    )
}
