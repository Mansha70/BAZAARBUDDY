"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Package, Plus, Edit, Trash2, CheckCircle, XCircle, Clock, Phone, Users, ShoppingCart } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

type Product = {
  id: string
  name: string
  category: string
  emoji: string
  unit: string
  price: number
  available: number
}

type Order = {
  id: string
  vendorId: string
  vendorName: string
  vendorPhone: string
  items: {
    productId: string
    productName: string
    quantity: number
    price: number
  }[]
  total: number
  status: "pending" | "accepted" | "rejected" | "delivered"
  createdAt: string
}

export default function SupplierDashboard() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [products, setProducts] = useState<Product[]>([
    { id: "1", name: "Tomatoes", category: "vegetables", emoji: "🍅", unit: "kg", price: 25, available: 500 },
    { id: "2", name: "Onions", category: "vegetables", emoji: "🧅", unit: "kg", price: 30, available: 300 },
    { id: "3", name: "Potatoes", category: "vegetables", emoji: "🥔", unit: "kg", price: 20, available: 400 },
    { id: "4", name: "Green Chilies", category: "vegetables", emoji: "🌶️", unit: "kg", price: 40, available: 100 },
  ])

  const [orders, setOrders] = useState<Order[]>([])
  const [isAddProductOpen, setIsAddProductOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "vegetables",
    emoji: "🥬",
    unit: "kg",
    price: 0,
    available: 0,
  })

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    } else if (user && user.type !== "supplier") {
      router.push("/vendor")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    // Load orders from localStorage
    const storedOrders = JSON.parse(localStorage.getItem("bazaarbuddy_orders") || "[]")
    const supplierOrders = storedOrders.filter((order: Order) =>
      order.items.some((item) => products.some((product) => product.id === item.productId)),
    )
    setOrders(supplierOrders)
  }, [products])

  const addProduct = () => {
    if (!newProduct.name || newProduct.price <= 0 || newProduct.available <= 0) {
      toast({
        title: "Invalid product data",
        description: "Please fill all fields with valid values",
        variant: "destructive",
      })
      return
    }

    const product: Product = {
      id: Date.now().toString(),
      ...newProduct,
    }

    setProducts([...products, product])
    setNewProduct({ name: "", category: "vegetables", emoji: "🥬", unit: "kg", price: 0, available: 0 })
    setIsAddProductOpen(false)

    toast({
      title: "Product added",
      description: `${product.name} has been added to your inventory`,
    })
  }

  const updateProduct = (product: Product) => {
    setProducts(products.map((p) => (p.id === product.id ? product : p)))
    setEditingProduct(null)

    toast({
      title: "Product updated",
      description: `${product.name} has been updated`,
    })
  }

  const deleteProduct = (productId: string) => {
    const product = products.find((p) => p.id === productId)
    setProducts(products.filter((p) => p.id !== productId))

    toast({
      title: "Product deleted",
      description: `${product?.name} has been removed from your inventory`,
    })
  }

  const updateOrderStatus = (orderId: string, status: "accepted" | "rejected" | "delivered") => {
    const updatedOrders = orders.map((order) => (order.id === orderId ? { ...order, status } : order))
    setOrders(updatedOrders)

    // Update in localStorage
    const allOrders = JSON.parse(localStorage.getItem("bazaarbuddy_orders") || "[]")
    const updatedAllOrders = allOrders.map((order: Order) => (order.id === orderId ? { ...order, status } : order))
    localStorage.setItem("bazaarbuddy_orders", JSON.stringify(updatedAllOrders))

    toast({
      title: "Order updated",
      description: `Order #${orderId} has been ${status}`,
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "accepted":
        return "bg-blue-100 text-blue-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStats = () => {
    const totalProducts = products.length
    const totalOrders = orders.length
    const pendingOrders = orders.filter((o) => o.status === "pending").length
    const totalRevenue = orders.filter((o) => o.status === "delivered").reduce((sum, order) => sum + order.total, 0)

    return { totalProducts, totalOrders, pendingOrders, totalRevenue }
  }

  if (isLoading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>
  }

  if (!user) {
    return null
  }

  const stats = getStats()

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome, {user.name}! 🚛</h1>
          <p className="text-gray-600">Manage your inventory and orders</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.totalProducts}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.totalOrders}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Pending Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pendingOrders}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">₹{stats.totalRevenue.toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="products" className="space-y-6">
          <TabsList>
            <TabsTrigger value="products" className="flex items-center space-x-2">
              <Package className="h-4 w-4" />
              <span>Products</span>
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center space-x-2">
              <ShoppingCart className="h-4 w-4" />
              <span>Orders</span>
            </TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Product Inventory</CardTitle>
                    <CardDescription>Manage your product listings and prices</CardDescription>
                  </div>
                  <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
                    <DialogTrigger asChild>
                      <Button className="flex items-center space-x-2">
                        <Plus className="h-4 w-4" />
                        <span>Add Product</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Product</DialogTitle>
                        <DialogDescription>Add a new product to your inventory</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="name">Product Name</Label>
                          <Input
                            id="name"
                            value={newProduct.name}
                            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                            placeholder="Enter product name"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="emoji">Emoji</Label>
                            <Input
                              id="emoji"
                              value={newProduct.emoji}
                              onChange={(e) => setNewProduct({ ...newProduct, emoji: e.target.value })}
                              placeholder="🥬"
                            />
                          </div>
                          <div>
                            <Label htmlFor="unit">Unit</Label>
                            <Input
                              id="unit"
                              value={newProduct.unit}
                              onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })}
                              placeholder="kg"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="price">Price (₹)</Label>
                            <Input
                              id="price"
                              type="number"
                              value={newProduct.price}
                              onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                              placeholder="0"
                            />
                          </div>
                          <div>
                            <Label htmlFor="available">Available Quantity</Label>
                            <Input
                              id="available"
                              type="number"
                              value={newProduct.available}
                              onChange={(e) => setNewProduct({ ...newProduct, available: Number(e.target.value) })}
                              placeholder="0"
                            />
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddProductOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={addProduct}>Add Product</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {products.map((product) => (
                    <Card key={product.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="text-2xl">{product.emoji}</div>
                            <div>
                              <CardTitle className="text-lg">{product.name}</CardTitle>
                              <CardDescription>
                                ₹{product.price} per {product.unit}
                              </CardDescription>
                            </div>
                          </div>
                          <Badge variant={product.available > 0 ? "default" : "destructive"}>
                            {product.available} {product.unit}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex justify-between items-center">
                          <Badge variant="secondary">{product.category}</Badge>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" onClick={() => setEditingProduct(product)}>
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => deleteProduct(product.id)}>
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Incoming Orders</CardTitle>
                <CardDescription>Manage orders from vendors</CardDescription>
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No orders yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <Card key={order.id} className="border-l-4 border-l-blue-500">
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                              <CardDescription className="flex items-center space-x-4 mt-1">
                                <span className="flex items-center">
                                  <Users className="h-4 w-4 mr-1" />
                                  {order.vendorName}
                                </span>
                                <span className="flex items-center">
                                  <Phone className="h-4 w-4 mr-1" />
                                  {order.vendorPhone}
                                </span>
                                <span className="flex items-center">
                                  <Clock className="h-4 w-4 mr-1" />
                                  {new Date(order.createdAt).toLocaleDateString()}
                                </span>
                              </CardDescription>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-lg text-green-600">₹{order.total}</div>
                              <Badge className={getStatusColor(order.status)}>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </Badge>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2 mb-4">
                            {order.items.map((item, index) => (
                              <div key={index} className="flex justify-between items-center text-sm">
                                <span>
                                  {item.productName} × {item.quantity}
                                </span>
                                <span className="font-medium">₹{item.price * item.quantity}</span>
                              </div>
                            ))}
                          </div>

                          {order.status === "pending" && (
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                onClick={() => updateOrderStatus(order.id, "accepted")}
                                className="flex items-center space-x-1"
                              >
                                <CheckCircle className="h-4 w-4" />
                                <span>Accept</span>
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => updateOrderStatus(order.id, "rejected")}
                                className="flex items-center space-x-1"
                              >
                                <XCircle className="h-4 w-4" />
                                <span>Reject</span>
                              </Button>
                            </div>
                          )}

                          {order.status === "accepted" && (
                            <Button
                              size="sm"
                              onClick={() => updateOrderStatus(order.id, "delivered")}
                              className="flex items-center space-x-1"
                            >
                              <CheckCircle className="h-4 w-4" />
                              <span>Mark as Delivered</span>
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Edit Product Dialog */}
        {editingProduct && (
          <Dialog open={!!editingProduct} onOpenChange={() => setEditingProduct(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Product</DialogTitle>
                <DialogDescription>Update product information</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-name">Product Name</Label>
                  <Input
                    id="edit-name"
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-price">Price (₹)</Label>
                    <Input
                      id="edit-price"
                      type="number"
                      value={editingProduct.price}
                      onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-available">Available Quantity</Label>
                    <Input
                      id="edit-available"
                      type="number"
                      value={editingProduct.available}
                      onChange={(e) => setEditingProduct({ ...editingProduct, available: Number(e.target.value) })}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setEditingProduct(null)}>
                  Cancel
                </Button>
                <Button onClick={() => updateProduct(editingProduct)}>Update Product</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  )
}
