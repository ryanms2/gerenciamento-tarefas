"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { AuthContext } from "@/context/authContext";
import { BarChart3, ChevronDown, ChevronUp, ListTodo, LogOut, Settings } from "lucide-react"
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useContext, useEffect, useState } from "react"
import { DarkMode } from "./_components/darkMode";

export function Sidebar({ className }: { className?: string }) {
    const [selectedMenuItem, setSelectedMenuItem] = useState("")
    const [isUserMenuExpanded, setIsUserMenuExpanded] = useState(false)

    const { user } = useContext(AuthContext)

    const pathname = usePathname()
    useEffect(() => {
        if (pathname.includes("analytics")) {
            setSelectedMenuItem("Analytics")
        } else if (pathname.includes("configurations")) {
            setSelectedMenuItem("Configurations")
        } else {
            setSelectedMenuItem("Dashboard")
        }
    }, [pathname])
    return (
            <div className={`flex flex-col h-full shadow-md ${className}`}>
              <div className="flex-grow p-4">
                <h2 className="text-2xl font-bold mb-4">Task Manager</h2>
                <nav className="space-y-2">
                  <Link href={"/dashboard"}>
                    <Button 
                      variant={selectedMenuItem === "Dashboard" ? "secondary" : "ghost"} 
                      className="w-full justify-start"
                      onClick={() => setSelectedMenuItem("Dashboard")}
                    >
                      <ListTodo className="mr-2 h-4 w-4" />
                      Dashboard
                    </Button>
                  </Link>
                  <Link href={"/dashboard/analytics"}>
                    <Button 
                      variant={selectedMenuItem === "Analytics" ? "secondary" : "ghost"} 
                      className="w-full justify-start"
                      onClick={() => setSelectedMenuItem("Analytics")}
                    >
                      <BarChart3 className="mr-2 h-4 w-4" />
                      Analytics
                    </Button>
                  </Link>
                  
                  <Link href={"/dashboard/configurations"}>
                    <Button 
                      variant={selectedMenuItem === "Configurations" ? "secondary" : "ghost"} 
                      className="w-full justify-start"
                      onClick={() => setSelectedMenuItem("Configurations")}
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Configurations
                    </Button>
                  </Link>
                  
                </nav>
              </div>
              <div className="p-4 border-t">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setIsUserMenuExpanded(!isUserMenuExpanded)}
                >
                  <Avatar className="w-6 h-6 mr-2">
                    <AvatarImage src="/placeholder-avatar.jpg" alt="User avatar" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <span className="flex-grow text-left">{user?.nome}</span>
                  {isUserMenuExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
                {isUserMenuExpanded && (
                  <div className="mt-2 space-y-2">
                    <p className="text-sm text-gray-500">{user?.email}</p>
                    <div className="flex items-center justify-end">
                      <DarkMode />
                    </div>
                    <Button variant="outline" className="w-full justify-start" onClick={() => console.log("Logout clicked")}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </Button>
                  </div>
                )}
              </div>
            </div>

    )
}