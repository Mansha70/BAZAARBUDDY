"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ShoppingCart,
  Truck,
  Users,
  TrendingDown,
  Shield,
  Clock,
  Star,
  MapPin,
  Phone,
  ChevronRight,
} from "lucide-react"

export default function HomePage() {
  const [animatedNumbers, setAnimatedNumbers] = useState({
    vendors: 0,
    suppliers: 0,
    orders: 0,
    savings: 0,
  })

  useEffect(() => {
    const targets = { vendors: 1200, suppliers: 350, orders: 5600, savings: 25 }
    const duration = 2000
    const steps = 60

    const increment = {
      vendors: targets.vendors / steps,
      suppliers: targets.suppliers / steps,
      orders: targets.orders / steps,
      savings: targets.savings / steps,
    }

    let currentStep = 0
    const timer = setInterval(() => {
      if (currentStep < steps) {
        setAnimatedNumbers({
          vendors: Math.floor(increment.vendors * currentStep),
          suppliers: Math.floor(increment.suppliers * currentStep),
          orders: Math.floor(increment.orders * currentStep),
          savings: Math.floor(increment.savings * currentStep),
        })
        currentStep++
      } else {
        setAnimatedNumbers(targets)
        clearInterval(timer)
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [])

  const features = [
    {
      icon: TrendingDown,
      title: "Cut Middleman Costs",
      description: "Save 15-30% on raw materials by connecting directly with suppliers",
    },
    {
      icon: Shield,
      title: "Verified Suppliers",
      description: "All suppliers are verified for quality and reliability",
    },
    {
      icon: Clock,
      title: "Quick Delivery",
      description: "Get your materials delivered within 2-4 hours",
    },
    {
      icon: Users,
      title: "Group Buying",
      description: "Join with nearby vendors for bulk discounts",
    },
  ]

  const testimonials = [
    {
      name: "Mansha  Pandey",
      role: "Chaat Vendor, CP",
      content: "BazaarBuddy helped me save ₹3000 monthly on vegetables. Direct supplier connection is amazing!",
      rating: 5,
      avatar: "👨‍🍳",
    },
    {
      name: "Raju Kumbhkar",
      role: "Dosa Stall Owner",
      content: "Quality ingredients at best prices. My customers love the fresh taste!",
      rating: 5,
      avatar: "👩‍🍳",
    },
    {
      name: "Nishant Bhardwaj",
      role: "Vegetable Supplier",
      content: "Great platform to reach more vendors. Increased my sales by 40%!",
      rating: 5,
      avatar: "🚛",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 animate-fade-in">
              Connect <span className="text-green-600">Vendors</span> with
              <br />
              <span className="text-orange-500">Local Suppliers</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Helping street food vendors source fresh raw materials directly from verified suppliers. Cut costs, ensure
              quality, and grow your business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-green-600 hover:bg-green-700 text-lg px-8 py-3">
                <Link href="/register">
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Join as Vendor
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8 py-3 bg-transparent">
                <Link href="/register">
                  <Truck className="mr-2 h-5 w-5" />
                  Join as Supplier
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Floating Cards Animation */}
        <div className="absolute top-20 left-10 animate-float">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">🍅</div>
              <div>
                <p className="font-semibold">Tomatoes</p>
                <p className="text-sm text-green-600">₹25/kg</p>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute top-40 right-10 animate-float-delayed">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">🧅</div>
              <div>
                <p className="font-semibold">Onions</p>
                <p className="text-sm text-green-600">₹30/kg</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">
                {animatedNumbers.vendors.toLocaleString()}+
              </div>
              <div className="text-gray-600">Active Vendors</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-orange-500 mb-2">
                {animatedNumbers.suppliers.toLocaleString()}+
              </div>
              <div className="text-gray-600">Verified Suppliers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                {animatedNumbers.orders.toLocaleString()}+
              </div>
              <div className="text-gray-600">Orders Completed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-purple-600 mb-2">{animatedNumbers.savings}%</div>
              <div className="text-gray-600">Average Savings</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose BazaarBuddy?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We're revolutionizing how street food vendors source their raw materials
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300 group">
                <CardHeader>
                  <div className="mx-auto w-16 h-16 bg-gradient-to-r from-green-500 to-orange-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Browse & Compare</h3>
              <p className="text-gray-600">
                Search for raw materials and compare prices from verified suppliers near you
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-orange-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Place Order</h3>
              <p className="text-gray-600">Select quantity, place order directly with supplier, and track delivery</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Save & Grow</h3>
              <p className="text-gray-600">Enjoy fresh ingredients at lower costs and grow your food business</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-r from-green-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="text-3xl">{testimonial.avatar}</div>
                    <div>
                      <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                      <CardDescription>{testimonial.role}</CardDescription>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 italic">"{testimonial.content}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-orange-500">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Transform Your Business?</h2>
          <p className="text-xl text-green-100 mb-8">
            Join thousands of vendors and suppliers already saving money and growing together
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-3">
              <Link href="/register">
                Get Started Today
                <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-gradient-to-r from-green-500 to-orange-500 p-2 rounded-lg">
                  <ShoppingCart className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold">BazaarBuddy</span>
              </div>
              <p className="text-gray-400">Connecting street food vendors with local suppliers across India.</p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">For Vendors</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/vendor" className="hover:text-white">
                    Browse Suppliers
                  </Link>
                </li>
                <li>
                  <Link href="/group-buying" className="hover:text-white">
                    Group Buying
                  </Link>
                </li>
                <li>
                  <Link href="/orders" className="hover:text-white">
                    Track Orders
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">For Suppliers</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/supplier" className="hover:text-white">
                    Manage Inventory
                  </Link>
                </li>
                <li>
                  <Link href="/supplier" className="hover:text-white">
                    View Orders
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white">
                    Support
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <div className="space-y-2 text-gray-400">
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>+91 98765 43210</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>Delhi, India</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 BazaarBuddy. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
