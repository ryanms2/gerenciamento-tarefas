import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { AuthContext } from "@/context/authContext";
import { getTasks } from "@/services/data";
import { RecentActivitiesProps, TaskUpdateChartsProps } from "@/types";
import { parseCookies } from "nookies";
import { useState, useEffect, useContext } from "react";

  
export function RecentActivities() {
  const { user } = useContext(AuthContext)
  const [tasks, setTasks] = useState<any>([])
  const [recentActivities, setRecentActivities] = useState<any>([])
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

    const convertedTasks = tasks.map((task: TaskUpdateChartsProps) => {
    const now = new Date();
    const timeDiff = now.getTime() - (task.concluido_em?.getTime() || task.criado_em.getTime());
    const hoursAgo = Math.floor(timeDiff / (1000 * 60 * 60));
    const daysAgo = Math.floor(hoursAgo / 24);
    const monthsAgo = Math.floor(daysAgo / 30);

    let timeAgo;
    if (timeDiff < 0) {
        timeAgo = 'just now';
    } else if (monthsAgo > 0) {
        timeAgo = `${monthsAgo} ${monthsAgo === 1 ? 'month' : 'months'} ago`;
    } else if (daysAgo > 0) {
        timeAgo = `${daysAgo} ${daysAgo === 1 ? 'day' : 'days'} ago`;
    } else {
        timeAgo = `${hoursAgo} ${hoursAgo === 1 ? 'hour' : 'hours'} ago`;
    }

    let action;
    if (task.status === 'concluída') {
        action = 'Task Completed';
    } else if (task.status === 'em andamento') {
        action = 'Task In Progress';
    } else {
        action = 'New Task Created';
    }
    return {
        id: task.id,
        action: action,
        task: task.titulo,
        user_image: user?.imagem,
        user_name: user?.nome,
        timestamp: timeAgo
    };
    })
    setRecentActivities(convertedTasks);
    }, [tasks, user])

    return (
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Latest updates on tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {recentActivities.map((activity: RecentActivitiesProps) => (
                <li key={activity.id} className="flex items-start space-x-4">
                  <Avatar>
                    <AvatarImage src={activity.user_image} alt="User avatar" />
                    <AvatarFallback>{activity.user_name}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-sm text-gray-500">
                      {activity.task} by {activity.user_name}
                    </p>
                    <p className="text-xs text-gray-400">{activity.timestamp}</p>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
    )
}