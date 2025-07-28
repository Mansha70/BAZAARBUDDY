"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Package, Clock, CheckCircle, XCircle, Truck, Star, RefreshCw } from "lucide-react"

type Order = {
  id: string
  vendorId: string
  items: {
    productId: string
    productName: string
    supplierName: string
    quantity: number
    price: number
  }[]
  total: number
  status: "pending" | "accepted" | "rejected" | "delivered"
  createdAt: string
}

export default function OrdersPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (user) {
      loadOrders()
    }
  }, [user])

  const loadOrders = () => {
    const storedOrders = JSON.parse(localStorage.getItem("bazaarbuddy_orders") || "[]")
    const userOrders = storedOrders.filter((order: Order) => order.vendorId === user?.id)
    setOrders(
      userOrders.sort((a: Order, b: Order) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    )
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />
      case "accepted":
        return <CheckCircle className="h-4 w-4" />
      case "rejected":
        return <XCircle className="h-4 w-4" />
      case "delivered":
        return <Truck className="h-4 w-4" />
      default:
        return <Package className="h-4 w-4" />
    }
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

  const getStatusMessage = (status: string) => {
    switch (status) {
      case "pending":
        return "Waiting for supplier confirmation"
      case "accepted":
        return "Order confirmed, preparing for delivery"
      case "rejected":
        return "Order was rejected by supplier"
      case "delivered":
        return "Order delivered successfully"
      default:
        return "Unknown status"
    }
  }

  const rateSupplier = (orderId: string, rating: number) => {
    toast({
      title: "Rating submitted",
      description: `Thank you for rating this supplier!`,
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Order History 📦</h1>
            <p className="text-gray-600">Track your orders and manage deliveries</p>
          </div>
          <Button onClick={loadOrders} variant="outline" className="flex items-center space-x-2 bg-transparent">
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </Button>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders yet</h3>
              <p className="text-gray-600 mb-4">Start shopping to see your orders here</p>
              <Button onClick={() => router.push("/vendor")}>Browse Products</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order.id} className="overflow-hidden">
                <CardHeader className="bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        <span>Order #{order.id}</span>
                        {getStatusIcon(order.status)}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        Placed on{" "}
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600 mb-2">₹{order.total}</div>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-6">
                  {/* Status Message */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <p className="text-blue-800 font-medium">{getStatusMessage(order.status)}</p>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-4 mb-6">
                    <h4 className="font-semibold text-gray-900">Order Items</h4>
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h5 className="font-medium">{item.productName}</h5>
                          <p className="text-sm text-gray-600">
                            Supplier: {item.supplierName} • Quantity: {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">₹{item.price * item.quantity}</div>
                          <div className="text-sm text-gray-600">₹{item.price} each</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Timeline */}
                  <div className="border-t pt-6">
                    <h4 className="font-semibold text-gray-900 mb-4">Order Timeline</h4>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium">Order Placed</p>
                          <p className="text-sm text-gray-600">{new Date(order.createdAt).toLocaleString("en-IN")}</p>
                        </div>
                      </div>

                      {order.status !== "pending" && (
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              order.status === "rejected" ? "bg-red-100" : "bg-blue-100"
                            }`}
                          >
                            {order.status === "rejected" ? (
                              <XCircle className="h-4 w-4 text-red-600" />
                            ) : (
                              <CheckCircle className="h-4 w-4 text-blue-600" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">
                              {order.status === "rejected" ? "Order Rejected" : "Order Confirmed"}
                            </p>
                            <p className="text-sm text-gray-600">By supplier</p>
                          </div>
                        </div>
                      )}

                      {order.status === "delivered" && (
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <Truck className="h-4 w-4 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium">Order Delivered</p>
                            <p className="text-sm text-gray-600">Successfully delivered</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  {order.status === "delivered" && (
                    <div className="border-t pt-6 mt-6">
                      <h4 className="font-semibold text-gray-900 mb-4">Rate Your Experience</h4>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-600">Rate this supplier:</span>
                        <div className="flex space-x-1">
                          {[1, 2, 3, 4, 5].map((rating) => (
                            <button
                              key={rating}
                              onClick={() => rateSupplier(order.id, rating)}
                              className="p-1 hover:scale-110 transition-transform"
                            >
                              <Star className="h-5 w-5 text-yellow-400 hover:fill-yellow-400" />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
