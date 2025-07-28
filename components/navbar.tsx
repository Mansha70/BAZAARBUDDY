"use client"

import { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Menu, X, ShoppingCart, User, LogOut, Store, Truck, Home, Users, Package, Phone } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, logout } = useAuth()

  const navigation = [
    { name: "Home", href: "/", icon: Home },
    { name: "Group Buying", href: "/group-buying", icon: Users },
    { name: "Track Orders", href: "/orders", icon: Package },
    { name: "Contact", href: "/contact", icon: Phone },
  ]

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-green-500 to-orange-500 p-2 rounded-lg">
                <ShoppingCart className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">BazaarBuddy</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-1"
              >
                <item.icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            ))}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>{user.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href={user.type === "vendor" ? "/vendor" : "/supplier"} className="flex items-center">
                      {user.type === "vendor" ? <Store className="h-4 w-4 mr-2" /> : <Truck className="h-4 w-4 mr-2" />}
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout} className="flex items-center">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex space-x-2">
                <Button asChild variant="outline">
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link href="/register">Register</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700 hover:text-green-600 p-2">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-green-600 block px-3 py-2 rounded-md text-base font-medium flex items-center space-x-2"
                onClick={() => setIsOpen(false)}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            ))}
            {user ? (
              <>
                <Link
                  href={user.type === "vendor" ? "/vendor" : "/supplier"}
                  className="text-gray-700 hover:text-green-600 block px-3 py-2 rounded-md text-base font-medium flex items-center space-x-2"
                  onClick={() => setIsOpen(false)}
                >
                  {user.type === "vendor" ? <Store className="h-4 w-4" /> : <Truck className="h-4 w-4" />}
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={() => {
                    logout()
                    setIsOpen(false)
                  }}
                  className="text-gray-700 hover:text-green-600 block px-3 py-2 rounded-md text-base font-medium flex items-center space-x-2 w-full text-left"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <div className="px-3 py-2 space-y-2">
                <Button asChild variant="outline" className="w-full bg-transparent">
                  <Link href="/login" onClick={() => setIsOpen(false)}>
                    Login
                  </Link>
                </Button>
                <Button asChild className="w-full">
                  <Link href="/register" onClick={() => setIsOpen(false)}>
                    Register
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
