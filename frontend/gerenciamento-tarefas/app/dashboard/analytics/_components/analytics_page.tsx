"use client";

import { TaskStatistic } from "./task_statistics";
import { Charts } from "./charts";
import { RecentActivities } from "./recent_activities";
import { parseCookies } from "nookies";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function AnalyticsPage() {
const router = useRouter();
  useEffect(() => {
    const { 'gerentarefas.token': token } = parseCookies();
    
    if(!token) {
      return router.push('/auth')
    }
    
}, [router])

  return (
    <div className="flex h-screen w-screen">

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8 overflow-auto">
        <h1 className="text-3xl font-bold mb-6 mt-12 md:mt-0">Analytics Dashboard</h1>

        {/* Task Statistics */}
        <TaskStatistic />

        {/* Charts */}
        <Charts />

        {/* Recent Activities */}
        <RecentActivities />
      </div>
    </div>
  )
}
