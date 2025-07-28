"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/components/auth-provider"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { ShoppingCart, Truck, Eye, EyeOff } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [userType, setUserType] = useState<"vendor" | "supplier">("vendor")

  const { login } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const success = await login(email, password, userType)
      if (success) {
        toast({
          title: "Login successful!",
          description: `Welcome back to BazaarBuddy`,
        })
        router.push(userType === "vendor" ? "/vendor" : "/supplier")
      } else {
        toast({
          title: "Login failed",
          description: "Invalid credentials. Try: raju@vendor.com or kris@supplier.com",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50">
      <Navbar />

      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-green-500 to-orange-500 rounded-full flex items-center justify-center mb-4">
              <ShoppingCart className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
            <CardDescription>Sign in to your BazaarBuddy account</CardDescription>
          </CardHeader>

          <CardContent>
            <Tabs value={userType} onValueChange={(value) => setUserType(value as "vendor" | "supplier")}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="vendor" className="flex items-center space-x-2">
                  <ShoppingCart className="h-4 w-4" />
                  <span>Vendor</span>
                </TabsTrigger>
                <TabsTrigger value="supplier" className="flex items-center space-x-2">
                  <Truck className="h-4 w-4" />
                  <span>Supplier</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="vendor">
                <div className="bg-blue-50 p-3 rounded-lg mb-4">
                  <p className="text-sm text-blue-700">
                    <strong>Demo Account:</strong> raju@vendor.com / password1234
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="supplier">
                <div className="bg-green-50 p-3 rounded-lg mb-4">
                  <p className="text-sm text-green-700">
                    <strong>Demo Account:</strong> nishant@supplier.com / password1867
                  </p>
                </div>
              </TabsContent>
            </Tabs>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link href="/register" className="text-green-600 hover:text-green-500 font-medium">
                  Sign up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
