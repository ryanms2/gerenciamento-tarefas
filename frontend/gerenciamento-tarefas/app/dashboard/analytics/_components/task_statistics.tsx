import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getTasks } from "@/services/data";
import { TaskUpdateChartsProps } from "@/types";
import { ListTodo, CheckCircle2, Clock } from "lucide-react";
import { parseCookies } from "nookies";
import { useEffect, useState } from "react";

export function TaskStatistic() {
const [tasks, setTasks] = useState<any>([])
const [completedTasks, setCompletedTasks] = useState<any>([])
const [averageCompletionTime, setAverageCompletionTime] = useState(0)
    useEffect(() => {
        const { 'gerentarefas.token': token } = parseCookies();
        const fetchTasks = async () => {
            const data = await getTasks(token);
            if(data.message) {
                return;
            }
            const newDate = data.map((task: TaskUpdateChartsProps) => {
                return {
                  ...task,
                  criado_em: new Date(task.criado_em),
                  concluido_em: task.concluido_em ? new Date(task.concluido_em) : null
                }
              })
              setTasks(newDate)

        }
        fetchTasks();
        
        
        
    }, [])

    useEffect(() => {
    const completed = tasks.filter((task: TaskUpdateChartsProps) => task.status === 'concluída');
    setCompletedTasks(completed);

    const averageTime = completed.length > 0 ? completed.reduce((acc: number, task: TaskUpdateChartsProps) => {
        const created = task.criado_em.getTime();
        const completed = task.concluido_em?.getTime() || new Date().getTime();
        const diff = completed - created;
        return acc + diff;
    }, 0) / completed.length : 0;
     const averageCompletionTime =averageTime / (1000 * 60 * 60 * 24);
    setAverageCompletionTime(Math.floor(averageCompletionTime) ) 
    }, [tasks])
     
 return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <ListTodo className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{tasks.length}</div>
        </CardContent>
        </Card>
        <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{completedTasks.length}</div>
        </CardContent>
        </Card>
        <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Completion Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{averageCompletionTime} days</div>
        </CardContent>
    </Card>
  </div>
 );
}