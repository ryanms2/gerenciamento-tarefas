"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { getTasks } from '@/services/data';
import { parseCookies } from 'nookies';
import { TaskUpdateChartsProps } from '@/types';
  

export function Charts() {
  const [tasks, setTasks] = useState<any>([])
  const [taskStatusData, setTaskStatusData] = useState<any>([])
  const [taskCompletionData, setTaskCompletionData] = useState<any>([])

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
    const inProgress = tasks.filter((task: TaskUpdateChartsProps) => task.status === 'em andamento');
    const toDo = tasks.filter((task: TaskUpdateChartsProps) => task.status === 'pendente');

    setTaskStatusData([
      { name: 'To Do', value: toDo.length },
      { name: 'In Progress', value: inProgress.length },
      { name: 'Completed', value: completed.length },
    ])

    const completionData = tasks.reduce((acc: any, task: TaskUpdateChartsProps) => {
      const date = task.concluido_em?.toISOString().split('T')[0];
      if(date) {
        if(acc[date]) {
          acc[date] += 1;
        } else {
          acc[date] = 1;
        }
      }
      return acc;
    }, {})
    const formattedData = Object.keys(completionData).map((date) => {
      return {
        date,
        completed: completionData[date]
      }
    })
    setTaskCompletionData(formattedData);
  }, [tasks])
 return (
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
    <Card>
      <CardHeader>
        <CardTitle>Task Status Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={taskStatusData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
    <Card>
      <CardHeader>
        <CardTitle>Task Completion Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={taskCompletionData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="completed" stroke="#8884d8" fill="#8884d8" />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  </div>
 );
}