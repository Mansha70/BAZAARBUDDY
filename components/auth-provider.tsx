"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

type User = {
  id: string
  name: string
  email: string
  type: "vendor" | "supplier"
  phone: string
  location: string
  avatar?: string
}

type AuthContextType = {
  user: User | null
  login: (email: string, password: string, type: "vendor" | "supplier") => Promise<boolean>
  register: (userData: Omit<User, "id"> & { password: string }) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("bazaarbuddy_user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string, type: "vendor" | "supplier"): Promise<boolean> => {
    // Mock authentication - in real app, this would call an API
    const mockUsers = [
      {
        id: "1",
        name: "Rajesh Kumar",
        email: "rajesh@vendor.com",
        type: "vendor",
        phone: "+91 98765 43210",
        location: "Connaught Place, Delhi",
      },
      {
        id: "2",
        name: "Priya Sharma",
        email: "priya@supplier.com",
        type: "supplier",
        phone: "+91 87654 32109",
        location: "Azadpur Mandi, Delhi",
      },
    ]

    const foundUser = mockUsers.find((u) => u.email === email && u.type === type)
    if (foundUser) {
      setUser(foundUser as User)
      localStorage.setItem("bazaarbuddy_user", JSON.stringify(foundUser))
      return true
    }
    return false
  }

  const register = async (userData: Omit<User, "id"> & { password: string }): Promise<boolean> => {
    // Mock registration
    const newUser: User = {
      id: Date.now().toString(),
      name: userData.name,
      email: userData.email,
      type: userData.type,
      phone: userData.phone,
      location: userData.location,
    }

    setUser(newUser)
    localStorage.setItem("bazaarbuddy_user", JSON.stringify(newUser))
    return true
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("bazaarbuddy_user")
  }

  return <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>{children}</AuthContext.Provider>
}
