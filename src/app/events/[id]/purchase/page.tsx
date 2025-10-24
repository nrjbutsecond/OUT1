"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useParams, useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Ticket, CreditCard, User, Mail, Phone, ArrowLeft, QrCode } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

interface TicketType {
  id: string
  name: string
  price: number
  description: string
  available: number
}

interface Event {
  id: string
  name: string
  description: string
  date: string
  location: string
  ticketPrice: number
  type: string
  organization?: {
    name: string
  }
  ticketTypes: TicketType[]
}

interface BuyerInfo {
  fullName: string
  email: string
  phone: string
}

export default function EventPurchasePage() {
  const { data: session, status } = useSession()
  const params = useParams()
  const router = useRouter()
  const [event, setEvent] = useState<Event | null>(null)
  const [selectedTicketType, setSelectedTicketType] = useState<string>("")
  const [ticketQuantity, setTicketQuantity] = useState(1)
  const [buyerInfo, setBuyerInfo] = useState<BuyerInfo>({
    fullName: session?.user?.name || "",
    email: session?.user?.email || "",
    phone: ""
  })
  const [paymentMethod, setPaymentMethod] = useState("bank_transfer")
  const [loading, setLoading] = useState(false)
  const [eventLoading, setEventLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
      return
    }

    // Load event data
    const loadEvent = async () => {
      try {
        const response = await fetch(`/api/events/${params.id}`)
        if (response.ok) {
          const eventData = await response.json()
          setEvent(eventData)
          
          // Pre-select first ticket type if available
          if (eventData.ticketTypes && eventData.ticketTypes.length > 0) {
            setSelectedTicketType(eventData.ticketTypes[0].id)
          }
        } else {
          toast.error("Event not found")
          router.push("/events")
        }
      } catch (error) {
        console.error("Error loading event:", error)
        toast.error("Error loading event information")
        router.push("/events")
      } finally {
        setEventLoading(false)
      }
    }

    loadEvent()
  }, [params.id, status, router, session])

  const calculateTotal = () => {
    if (!event || !selectedTicketType) return 0
    const ticketType = event.ticketTypes.find(t => t.id === selectedTicketType)
    if (!ticketType) return 0
    return ticketType.price * ticketQuantity
  }

  const handleInputChange = (field: keyof BuyerInfo, value: string) => {
    setBuyerInfo(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const validateForm = () => {
    if (!buyerInfo.fullName || !buyerInfo.email || !buyerInfo.phone) {
      toast.error("Please fill in all required information")
      return false
    }
    if (!selectedTicketType) {
      toast.error("Please select a ticket type")
      return false
    }
    return true
  }

  const handlePurchase = async () => {
    if (!event || !validateForm()) return

    // Redirect to payment page with buyer info as URL params
    const params = new URLSearchParams({
      fullName: buyerInfo.fullName,
      email: buyerInfo.email,
      phone: buyerInfo.phone,
      ticketType: selectedTicketType,
      quantity: ticketQuantity.toString()
    })

    router.push(`/events/${event.id}/payment?${params.toString()}`)
  }

  if (status === "loading" || eventLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    )
  }

  if (status === "unauthenticated") {
    return null
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Event Not Found</h1>
          <Button onClick={() => router.push("/events")} className="bg-red-600 hover:bg-red-700">
            Back to Events
          </Button>
        </div>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateString))
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="tedx-gradient text-white py-16">
          <div className="container">
            <div className="flex items-center gap-4 mb-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href={`/events/${event.id}`}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Quay lại
                </Link>
              </Button>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Mua vé: {event.name}</h1>
            <p className="text-xl text-red-50 max-w-2xl">
              Hoàn tất thông tin để mua vé sự kiện
            </p>
          </div>
        </div>

        <div className="container py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Event Info & Buyer Details */}
            <div className="space-y-6">
              {/* Event Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Thông tin sự kiện</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <h3 className="font-semibold">{event.name}</h3>
                    <p className="text-sm text-muted-foreground">{event.description}</p>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Thời gian:</span>
                      <span>{formatDate(event.date)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Địa điểm:</span>
                      <span>{event.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tổ chức:</span>
                      <span>{event.organization?.name || 'TON Platform'}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Ticket Type Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Ticket className="h-5 w-5" />
                    Select Ticket Type
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {event.ticketTypes.map((ticketType) => (
                      <div
                        key={ticketType.id}
                        className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                          selectedTicketType === ticketType.id
                            ? "border-red-500 bg-red-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => setSelectedTicketType(ticketType.id)}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{ticketType.name}</h4>
                            <p className="text-sm text-gray-600 mt-1">{ticketType.description}</p>
                            <p className="text-xs text-gray-500 mt-2">
                              Available: {ticketType.available} tickets
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-red-600">
                              ${ticketType.price.toLocaleString()}
                            </div>
                            <div className="text-xs text-gray-500">per ticket</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Buyer Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Buyer Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-gray-900 font-medium">Full Name *</Label>
                    <Input
                      id="fullName"
                      value={buyerInfo.fullName}
                      onChange={(e) => handleInputChange("fullName", e.target.value)}
                      placeholder="John Doe"
                      className="bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-red-500 focus:ring-red-500/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-900 font-medium">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={buyerInfo.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="john@example.com"
                      className="bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-red-500 focus:ring-red-500/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-gray-900 font-medium">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={buyerInfo.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="+84 123 456 789"
                      className="bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-red-500 focus:ring-red-500/20"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="bank_transfer" id="bank_transfer" />
                      <Label htmlFor="bank_transfer" className="text-gray-900">Bank Transfer</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="vnpay" id="vnpay" />
                      <Label htmlFor="vnpay" className="text-gray-900">VNPay (Coming Soon)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="momo" id="momo" />
                      <Label htmlFor="momo" className="text-gray-900">MoMo (Coming Soon)</Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Ticket className="h-5 w-5" />
                    Tóm tắt đơn hàng
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Ticket Quantity */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Số lượng vé:</span>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setTicketQuantity(Math.max(1, ticketQuantity - 1))}
                        >
                          -
                        </Button>
                        <span className="w-12 text-center font-medium">
                          {ticketQuantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setTicketQuantity(Math.min(10, ticketQuantity + 1))}
                        >
                          +
                        </Button>
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-900">Ticket Price:</span>
                      <span className="text-gray-900">${event.ticketPrice.toLocaleString()}</span>
                    </div>

                    <Separator />

                    <div className="flex justify-between text-lg font-bold">
                      <span className="text-gray-900">Total:</span>
                      <span className="text-red-600">
                        ${calculateTotal().toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <Button 
                    className="w-full bg-red-600 hover:bg-red-700 text-white" 
                    size="lg"
                    onClick={handlePurchase}
                    disabled={loading || !selectedTicketType}
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <Ticket className="h-5 w-5 mr-2" />
                        Complete Purchase
                      </>
                    )}
                  </Button>

                  <div className="text-xs text-gray-500 text-center space-y-1">
                    <p>• Tickets will be sent via email after payment</p>
                    <p>• QR code for event entry</p>
                    <p>• No refunds after purchase</p>
                    <p>• Show QR code at entrance</p>
                  </div>
                </CardContent>
              </Card>

              {/* QR Code Preview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <QrCode className="h-5 w-5" />
                    Ticket QR Code
                  </CardTitle>
                  <CardDescription>
                    QR code will be generated after successful payment
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <QrCode className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">QR code will appear here</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}



