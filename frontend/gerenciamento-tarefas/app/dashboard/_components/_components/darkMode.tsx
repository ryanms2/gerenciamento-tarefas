"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function DarkMode() {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 green:-rotate-90 green:scale-0 rose:-rotate-90 rose:scale-0 dark-green:-rotate-90 dark-green:scale-0 dark-rose:-rotate-90 dark-rose:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 green:rotate-0 green:scale-100 rose:rotate-0 rose:scale-100 dark-green:rotate-0 dark-green:scale-100 dark-rose:rotate-0 dark-rose:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("green")}>
          Green
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark-green")}>
          Dark Green
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("rose")}>
          Rose
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark-rose")}>
          Dark Rose
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
