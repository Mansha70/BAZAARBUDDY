"use client"

import type React from "react"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Phone, Mail, MapPin, Clock, MessageCircle, HelpCircle, Users, Truck } from "lucide-react"

export default function ContactPage() {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    userType: "vendor",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Simulate form submission
    toast({
      title: "Message sent successfully!",
      description: "We'll get back to you within 24 hours.",
    })

    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
      userType: "vendor",
    })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const faqs = [
    {
      question: "How do I register as a vendor?",
      answer:
        "Click on 'Register' and select 'Vendor'. Fill  your details including your food stall location and contact information.",
    },
    {
      question: "How do I become a verified supplier?",
      answer:
        "Register as a supplier and our team will verify your business credentials. This usually takes 2-3 business days.",
    },
    {
      question: "What are the delivery charges?",
      answer:
        "Delivery charges vary by distance and order value. Orders above ₹500 get free delivery within 5km radius.",
    },
    {
      question: "How does group buying work?",
      answer:
        "Join group buys with other vendors in your area to get bulk discounts. When the group reaches minimum quantity, everyone gets the discounted price.",
    },
    {
      question: "What payment methods are accepted?",
      answer:
        "We accept cash on delivery, UPI payments, and bank transfers. Digital payments get additional 10% discount.",
    },
    {
      question: "How can I track my orders?",
      answer:
        "Go to 'Track Orders' in your dashboard to see real-time status of all your orders from placement to delivery.",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact & Support 📞</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Need help? We're here to support vendors and suppliers. Get in touch with us anytime.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageCircle className="h-5 w-5" />
                  <span>Send us a Message</span>
                </CardTitle>
                <CardDescription>Fill out the form below and we'll get back to you as soon as possible</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+91 8709793192"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="userType">I am a</Label>
                      <select
                        id="userType"
                        name="userType"
                        value={formData.userType}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      >
                        <option value="vendor">Vendor</option>
                        <option value="supplier">Supplier</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="What is this regarding?"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Describe your issue or question in detail..."
                      rows={5}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            {/* Contact Details */}
            <Card>
              <CardHeader>
                <CardTitle>Get in Touch</CardTitle>
                <CardDescription>Multiple ways to reach our support team</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Phone className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Phone Support</p>
                    <p className="text-sm text-gray-600">+91 870 97939192</p>
                    <p className="text-xs text-gray-500">Mon-Sat, 9 AM - 7 PM</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Mail className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Email Support</p>
                    <p className="text-sm text-gray-600">pandegmansha@gmail.com</p>
                    <p className="text-xs text-gray-500">Response within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-medium">Office Address</p>
                    <p className="text-sm text-gray-600">
                      123 Business Hub
                      <br />
                      Connaught Place
                      <br />
                      New Delhi - 110001
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <Clock className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium">Business Hours</p>
                    <p className="text-sm text-gray-600">
                      Monday - Saturday
                      <br />
                      8:00 AM - 7:00 PM IST
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Help */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Help</CardTitle>
                <CardDescription>Common support categories</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Users className="h-4 w-4 mr-2" />
                  Account Issues
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Truck className="h-4 w-4 mr-2" />
                  Order & Delivery
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Technical Support
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <HelpCircle className="h-4 w-4 mr-2" />
                  General Questions
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Frequently Asked Questions</CardTitle>
              <CardDescription>Find quick answers to common questions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {faqs.map((faq, index) => (
                  <div key={index} className="space-y-2">
                    <h3 className="font-semibold text-gray-900 flex items-start">
                      <HelpCircle className="h-4 w-4 mr-2 mt-0.5 text-green-600 flex-shrink-0" />
                      {faq.question}
                    </h3>
                    <p className="text-gray-600 text-sm pl-6">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Emergency Contact */}
        <div className="mt-8">
          <Card className="bg-red-50 border-red-200">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <Phone className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-red-900">Emergency Support</h3>
                  <p className="text-red-700 text-sm">
                    For urgent delivery issues or payment problems, call our 24/7 helpline:
                    <span className="font-bold ml-1">+91 8709793192</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
