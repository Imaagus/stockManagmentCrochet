import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

import { useState, useEffect } from 'react'

export type UserRole = 'admin' | 'manager' | 'employee'

export interface User {
  id: number
  username: string
  role: UserRole
}

const users: User[] = [
  { id: 1, username: 'admin', role: 'admin' },
  { id: 2, username: 'manager', role: 'manager' },
  { id: 3, username: 'employee', role: 'employee' },
]

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)

  const login = (username: string, password: string) => {
    // En una aplicación real, aquí verificarías las credenciales con el backend
    const foundUser = users.find(u => u.username === username)
    if (foundUser) {
      setUser(foundUser)
      localStorage.setItem('user', JSON.stringify(foundUser))
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  return { user, login, logout }
}

export const checkPermission = (user: User | null, requiredRole: UserRole): boolean => {
  if (!user) return false
  
  const roleHierarchy: UserRole[] = ['employee', 'manager', 'admin']
  return roleHierarchy.indexOf(user.role) >= roleHierarchy.indexOf(requiredRole)
}

