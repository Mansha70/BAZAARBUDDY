"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Search, MapPin, Star, ShoppingCart, Filter, Plus, Minus, Truck, Phone } from "lucide-react"

type Product = {
  id: string
  name: string
  category: string
  emoji: string
  unit: string
}

type Supplier = {
  id: string
  name: string
  rating: number
  distance: number
  phone: string
  location: string
  products: { productId: string; price: number; available: number }[]
}

type CartItem = {
  productId: string
  supplierId: string
  quantity: number
  price: number
}

export default function VendorDashboard() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [cart, setCart] = useState<CartItem[]>([])
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null)

  const products: Product[] = [
    { id: "1", name: "Tomatoes", category: "vegetables", emoji: "🍅", unit: "kg" },
    { id: "2", name: "Onions", category: "vegetables", emoji: "🧅", unit: "kg" },
    { id: "3", name: "Potatoes", category: "vegetables", emoji: "🥔", unit: "kg" },
    { id: "4", name: "Cooking Oil", category: "oil", emoji: "🛢️", unit: "liter" },
    { id: "5", name: "Wheat Flour", category: "grains", emoji: "🌾", unit: "kg" },
    { id: "6", name: "Rice", category: "grains", emoji: "🍚", unit: "kg" },
    { id: "7", name: "Turmeric Powder", category: "spices", emoji: "🟡", unit: "kg" },
    { id: "8", name: "Red Chili Powder", category: "spices", emoji: "🌶️", unit: "kg" },
    { id: "9", name: "Cumin Seeds", category: "spices", emoji: "🟤", unit: "kg" },
    { id: "10", name: "Green Chilies", category: "vegetables", emoji: "🌶️", unit: "kg" },
  ]

  const suppliers: Supplier[] = [
    {
      id: "1",
      name: "Raju Trader",
      rating: 4.8,
      distance: 2.3,
      phone: "+91 8709793192",
      location: "Delhi Mandi",
      products: [
        { productId: "1", price: 25, available: 500 },
        { productId: "2", price: 30, available: 300 },
        { productId: "3", price: 20, available: 400 },
        { productId: "10", price: 40, available: 100 },
      ],
    },
    {
      id: "2",
      name: "FreshMart Suppliers",
      rating: 4.6,
      distance: 3.1,
      phone: "+91 7982512360",
      location: "Ghazipur Mandi",
      products: [
        { productId: "1", price: 28, available: 200 },
        { productId: "2", price: 32, available: 150 },
        { productId: "4", price: 120, available: 50 },
        { productId: "5", price: 35, available: 300 },
      ],
    },
    {
      id: "3",
      name: "Spice King",
      rating: 4.9,
      distance: 1.8,
      phone: "+91 76543 21098",
      location: "Khari Baoli",
      products: [
        { productId: "7", price: 180, available: 100 },
        { productId: "8", price: 220, available: 80 },
        { productId: "9", price: 350, available: 50 },
      ],
    },
    {
      id: "4",
      name: "Grain Master",
      rating: 4.7,
      distance: 4.2,
      phone: "+91 65432 10987",
      location: "Najafgarh Mandi",
      products: [
        { productId: "5", price: 32, available: 500 },
        { productId: "6", price: 45, available: 400 },
        { productId: "4", price: 115, available: 100 },
      ],
    },
  ]

  const categories = [
    { id: "all", name: "All Items", emoji: "🛒" },
    { id: "vegetables", name: "Vegetables", emoji: "🥬" },
    { id: "spices", name: "Spices", emoji: "🌶️" },
    { id: "grains", name: "Grains", emoji: "🌾" },
    { id: "oil", name: "Oil", emoji: "🛢️" },
  ]

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    } else if (user && user.type !== "vendor") {
      router.push("/supplier")
    }
  }, [user, isLoading, router])

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getProductSuppliers = (productId: string) => {
    return suppliers
      .filter((supplier) => supplier.products.some((p) => p.productId === productId))
      .map((supplier) => ({
        ...supplier,
        productInfo: supplier.products.find((p) => p.productId === productId)!,
      }))
      .sort((a, b) => a.productInfo.price - b.productInfo.price)
  }

  const addToCart = (productId: string, supplierId: string, price: number) => {
    const existingItem = cart.find((item) => item.productId === productId && item.supplierId === supplierId)

    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.productId === productId && item.supplierId === supplierId
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        ),
      )
    } else {
      setCart([...cart, { productId, supplierId, quantity: 1, price }])
    }

    toast({
      title: "Added to cart",
      description: "Item added successfully",
    })
  }

  const updateCartQuantity = (productId: string, supplierId: string, change: number) => {
    setCart(
      cart
        .map((item) => {
          if (item.productId === productId && item.supplierId === supplierId) {
            const newQuantity = Math.max(0, item.quantity + change)
            return newQuantity === 0 ? null : { ...item, quantity: newQuantity }
          }
          return item
        })
        .filter(Boolean) as CartItem[],
    )
  }

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const placeOrder = () => {
    if (cart.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Add items to cart before placing order",
        variant: "destructive",
      })
      return
    }

    // Store order in localStorage (in real app, this would be an API call)
    const orders = JSON.parse(localStorage.getItem("bazaarbuddy_orders") || "[]")
    const newOrder = {
      id: Date.now().toString(),
      vendorId: user?.id,
      items: cart.map((item) => ({
        ...item,
        productName: products.find((p) => p.id === item.productId)?.name,
        supplierName: suppliers.find((s) => s.id === item.supplierId)?.name,
      })),
      total: getCartTotal(),
      status: "pending",
      createdAt: new Date().toISOString(),
    }

    orders.push(newOrder)
    localStorage.setItem("bazaarbuddy_orders", JSON.stringify(orders))

    setCart([])
    toast({
      title: "Order placed successfully!",
      description: `Order #${newOrder.id} has been placed`,
    })
  }

  if (isLoading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user.name}! 👋</h1>
          <p className="text-gray-600">Find the best deals on raw materials from verified suppliers</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search and Filters */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search for raw materials..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
                  <Filter className="h-4 w-4" />
                  <span>Filters</span>
                </Button>
              </div>

              {/* Categories */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className="flex items-center space-x-1"
                  >
                    <span>{category.emoji}</span>
                    <span>{category.name}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="text-3xl">{product.emoji}</div>
                        <div>
                          <CardTitle className="text-lg">{product.name}</CardTitle>
                          <CardDescription>per {product.unit}</CardDescription>
                        </div>
                      </div>
                      <Badge variant="secondary">{product.category}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button
                      onClick={() => setSelectedProduct(selectedProduct === product.id ? null : product.id)}
                      className="w-full"
                      variant={selectedProduct === product.id ? "secondary" : "default"}
                    >
                      {selectedProduct === product.id ? "Hide Suppliers" : "View Suppliers"}
                    </Button>

                    {selectedProduct === product.id && (
                      <div className="mt-4 space-y-3">
                        {getProductSuppliers(product.id).map((supplier) => (
                          <div key={supplier.id} className="border rounded-lg p-3 bg-gray-50">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h4 className="font-semibold text-sm">{supplier.name}</h4>
                                <div className="flex items-center space-x-2 text-xs text-gray-600">
                                  <div className="flex items-center">
                                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                                    {supplier.rating}
                                  </div>
                                  <div className="flex items-center">
                                    <MapPin className="h-3 w-3 mr-1" />
                                    {supplier.distance}km
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-bold text-green-600">₹{supplier.productInfo.price}</div>
                                <div className="text-xs text-gray-500">
                                  {supplier.productInfo.available} {product.unit} available
                                </div>
                              </div>
                            </div>
                            <div className="flex justify-between items-center">
                              <div className="flex items-center space-x-2 text-xs text-gray-600">
                                <Phone className="h-3 w-3" />
                                <span>{supplier.phone}</span>
                              </div>
                              <Button
                                size="sm"
                                onClick={() => addToCart(product.id, supplier.id, supplier.productInfo.price)}
                                className="text-xs"
                              >
                                <Plus className="h-3 w-3 mr-1" />
                                Add
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Cart Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ShoppingCart className="h-5 w-5" />
                  <span>Cart ({cart.length})</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {cart.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">Your cart is empty</p>
                ) : (
                  <div className="space-y-3">
                    {cart.map((item, index) => {
                      const product = products.find((p) => p.id === item.productId)
                      const supplier = suppliers.find((s) => s.id === item.supplierId)
                      return (
                        <div key={index} className="border rounded-lg p-3">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-semibold text-sm">{product?.name}</h4>
                              <p className="text-xs text-gray-600">{supplier?.name}</p>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-sm">₹{item.price * item.quantity}</div>
                              <div className="text-xs text-gray-500">
                                ₹{item.price} × {item.quantity}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateCartQuantity(item.productId, item.supplierId, -1)}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="text-sm font-medium">{item.quantity}</span>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateCartQuantity(item.productId, item.supplierId, 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      )
                    })}

                    <div className="border-t pt-3">
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-semibold">Total:</span>
                        <span className="font-bold text-lg text-green-600">₹{getCartTotal()}</span>
                      </div>
                      <Button onClick={placeOrder} className="w-full">
                        <Truck className="h-4 w-4 mr-2" />
                        Place Order
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
