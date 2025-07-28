"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { Users, MapPin, ShoppingCart, TrendingDown, Plus, CheckCircle, Timer } from "lucide-react"

type GroupBuy = {
  id: string
  productName: string
  productEmoji: string
  targetQuantity: number
  currentQuantity: number
  pricePerUnit: number
  discountedPrice: number
  savings: number
  location: string
  timeLeft: string
  participants: number
  maxParticipants: number
  organizer: string
  status: "active" | "completed" | "expired"
}

export default function GroupBuyingPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [groupBuys, setGroupBuys] = useState<GroupBuy[]>([
    {
      id: "1",
      productName: "Premium Basmati Rice",
      productEmoji: "🍚",
      targetQuantity: 100,
      currentQuantity: 75,
      pricePerUnit: 80,
      discountedPrice: 65,
      savings: 15,
      location: "Connaught Place Area",
      timeLeft: "2 days left",
      participants: 15,
      maxParticipants: 20,
      organizer: "Rajesh Kumar",
      status: "active",
    },
    {
      id: "2",
      productName: "Cooking Oil (Refined)",
      productEmoji: "🛢️",
      targetQuantity: 50,
      currentQuantity: 45,
      pricePerUnit: 140,
      discountedPrice: 120,
      savings: 20,
      location: "Karol Bagh Area",
      timeLeft: "1 day left",
      participants: 9,
      maxParticipants: 10,
      organizer: "Priya Sharma",
      status: "active",
    },
    {
      id: "3",
      productName: "Red Onions",
      productEmoji: "🧅",
      targetQuantity: 200,
      currentQuantity: 180,
      pricePerUnit: 35,
      discountedPrice: 28,
      savings: 7,
      location: "Lajpat Nagar Area",
      timeLeft: "5 hours left",
      participants: 18,
      maxParticipants: 25,
      organizer: "Amit Singh",
      status: "active",
    },
    {
      id: "4",
      productName: "Wheat Flour",
      productEmoji: "🌾",
      targetQuantity: 150,
      currentQuantity: 150,
      pricePerUnit: 40,
      discountedPrice: 32,
      savings: 8,
      location: "Rohini Area",
      timeLeft: "Completed",
      participants: 20,
      maxParticipants: 20,
      organizer: "Sunita Devi",
      status: "completed",
    },
  ])

  const [joinedGroups, setJoinedGroups] = useState<string[]>([])

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    // Load joined groups from localStorage
    const stored = localStorage.getItem(`bazaarbuddy_joined_groups_${user?.id}`)
    if (stored) {
      setJoinedGroups(JSON.parse(stored))
    }
  }, [user])

  const joinGroupBuy = (groupId: string) => {
    const group = groupBuys.find((g) => g.id === groupId)
    if (!group) return

    if (group.participants >= group.maxParticipants) {
      toast({
        title: "Group is full",
        description: "This group buy has reached maximum participants",
        variant: "destructive",
      })
      return
    }

    // Update group participants
    setGroupBuys(
      groupBuys.map((g) =>
        g.id === groupId ? { ...g, participants: g.participants + 1, currentQuantity: g.currentQuantity + 10 } : g,
      ),
    )

    // Add to joined groups
    const newJoinedGroups = [...joinedGroups, groupId]
    setJoinedGroups(newJoinedGroups)
    localStorage.setItem(`bazaarbuddy_joined_groups_${user?.id}`, JSON.stringify(newJoinedGroups))

    toast({
      title: "Joined group buy!",
      description: `You've joined the ${group.productName} group buy`,
    })
  }

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      case "expired":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (isLoading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>
  }

  if (!user) {
    return null
  }

  const activeGroups = groupBuys.filter((g) => g.status === "active")
  const completedGroups = groupBuys.filter((g) => g.status === "completed")

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Group Buying 🤝</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join with nearby vendors to buy in bulk and save money! Get better prices through collective purchasing
            power.
          </p>
        </div>

        {/* Benefits Section */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <TrendingDown className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle>Lower Prices</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Get 15-30% discount on bulk purchases when groups reach target quantity</CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle>Community Power</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Connect with vendors in your area and build stronger business relationships
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle>Quality Assured</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                All group buys are organized with verified suppliers ensuring quality products
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Active Group Buys */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Active Group Buys</h2>
            <Button className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Start Group Buy</span>
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeGroups.map((group) => (
              <Card key={group.id} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className="text-3xl">{group.productEmoji}</div>
                      <div>
                        <CardTitle className="text-lg">{group.productName}</CardTitle>
                        <CardDescription className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {group.location}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge className={getStatusColor(group.status)}>{group.status}</Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>
                        {group.currentQuantity}/{group.targetQuantity} kg
                      </span>
                    </div>
                    <Progress value={getProgressPercentage(group.currentQuantity, group.targetQuantity)} />
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-4">
                    {/* Pricing */}
                    <div className="bg-green-50 p-3 rounded-lg">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-600">Regular Price</span>
                        <span className="text-sm line-through text-gray-500">₹{group.pricePerUnit}/kg</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-green-700">Group Price</span>
                        <span className="text-lg font-bold text-green-700">₹{group.discountedPrice}/kg</span>
                      </div>
                      <div className="text-center mt-2">
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          Save ₹{group.savings}/kg ({Math.round((group.savings / group.pricePerUnit) * 100)}% off)
                        </Badge>
                      </div>
                    </div>

                    {/* Participants */}
                    <div className="flex justify-between items-center text-sm">
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span>
                          {group.participants}/{group.maxParticipants} vendors
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Timer className="h-4 w-4 text-gray-400" />
                        <span>{group.timeLeft}</span>
                      </div>
                    </div>

                    {/* Organizer */}
                    <div className="text-sm text-gray-600">
                      Organized by <span className="font-medium">{group.organizer}</span>
                    </div>

                    {/* Action Button */}
                    <Button
                      className="w-full"
                      onClick={() => joinGroupBuy(group.id)}
                      disabled={joinedGroups.includes(group.id) || group.participants >= group.maxParticipants}
                    >
                      {joinedGroups.includes(group.id) ? (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Joined
                        </>
                      ) : group.participants >= group.maxParticipants ? (
                        "Group Full"
                      ) : (
                        <>
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Join Group Buy
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Completed Group Buys */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recently Completed</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedGroups.map((group) => (
              <Card key={group.id} className="opacity-75">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className="text-3xl">{group.productEmoji}</div>
                      <div>
                        <CardTitle className="text-lg">{group.productName}</CardTitle>
                        <CardDescription className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {group.location}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge className={getStatusColor(group.status)}>
                      <CheckCircle className="h-3 w-3 mr-1" />
                      {group.status}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Final Quantity</span>
                      <span>{group.currentQuantity} kg</span>
                    </div>
                    <Progress value={100} />
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-3">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-700">₹{group.discountedPrice}/kg</div>
                        <div className="text-sm text-blue-600">
                          Saved ₹{group.savings}/kg for {group.participants} vendors
                        </div>
                      </div>
                    </div>

                    <div className="text-sm text-gray-600 text-center">
                      Successfully completed with {group.participants} participants
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="mt-16 bg-white rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">How Group Buying Works</h2>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-green-600">1</span>
              </div>
              <h3 className="font-semibold mb-2">Find a Group</h3>
              <p className="text-sm text-gray-600">Browse active group buys in your area</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-blue-600">2</span>
              </div>
              <h3 className="font-semibold mb-2">Join & Commit</h3>
              <p className="text-sm text-gray-600">Join the group and commit to your quantity</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-orange-600">3</span>
              </div>
              <h3 className="font-semibold mb-2">Reach Target</h3>
              <p className="text-sm text-gray-600">Wait for the group to reach minimum quantity</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-purple-600">4</span>
              </div>
              <h3 className="font-semibold mb-2">Get Delivery</h3>
              <p className="text-sm text-gray-600">Receive your order at discounted group price</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
