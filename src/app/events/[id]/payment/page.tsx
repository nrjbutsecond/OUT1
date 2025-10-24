"use client"

import { Suspense, useEffect, useState } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, CreditCard, User, Mail, Phone, Ticket, QrCode, Clock, CheckCircle } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
import { useApp } from "@/contexts/app-context"

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

function EventPaymentContent() {
  const { data: session, status } = useSession()
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { addNotification } = useApp()
  const [event, setEvent] = useState<Event | null>(null)
  const [selectedTicketType, setSelectedTicketType] = useState<string>("")
  const [ticketQuantity, setTicketQuantity] = useState(1)
  const [buyerInfo, setBuyerInfo] = useState<BuyerInfo>({
    fullName: "",
    email: "",
    phone: ""
  })
  const [paymentMethod, setPaymentMethod] = useState("bank_transfer")
  const [loading, setLoading] = useState(false)
  const [paymentStep, setPaymentStep] = useState<'info' | 'payment' | 'processing' | 'success'>('info')

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
      return
    }

    const loadEvent = async () => {
      // Mock API call to fetch event details
      await new Promise(resolve => setTimeout(resolve, 500))
      const mockEvent: Event = {
        id: params.id as string,
        name: "TEDxHanoi 2024: Innovation & Technology",
        description: "Explore the latest breakthroughs in innovation and technology.",
        date: "2024-12-15T10:00:00Z",
        location: "National Convention Center, Hanoi",
        ticketPrice: 0, // Base price, will be overridden by ticket types
        type: "TEDX",
        organization: { name: "TEDxHanoi" },
        ticketTypes: [
          { id: "basic", name: "Basic Access", price: 300000, description: "Access to main event hall.", available: 150 },
          { id: "vip", name: "VIP Experience", price: 800000, description: "Front row seats, VIP lounge access, meet & greet.", available: 30 },
          { id: "student", name: "Student Pass", price: 150000, description: "Discounted access for students (ID required).", available: 200 },
        ]
      }
      setEvent(mockEvent)

      // Get buyer info from URL params (passed from purchase page)
      const fullName = searchParams.get('fullName') || session?.user?.name || ""
      const email = searchParams.get('email') || session?.user?.email || ""
      const phone = searchParams.get('phone') || ""
      const ticketType = searchParams.get('ticketType') || ""
      const quantity = parseInt(searchParams.get('quantity') || '1')

      setBuyerInfo({
        fullName,
        email,
        phone
      })

      if (ticketType) {
        setSelectedTicketType(ticketType)
      } else if (mockEvent.ticketTypes.length > 0) {
        setSelectedTicketType(mockEvent.ticketTypes[0].id)
      }

      setTicketQuantity(quantity)
    }

    loadEvent()
  }, [params.id, status, router, session, searchParams])

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

  const handleProceedToPayment = () => {
    if (!validateForm()) return
    setPaymentStep('payment')
  }

  const handlePayment = async () => {
    if (!event) return

    setPaymentStep('processing')
    setLoading(true)

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000))

      // Mock payment success
      const paymentData = {
        eventId: event.id,
        userId: session?.user?.id,
        ticketTypeId: selectedTicketType,
        quantity: ticketQuantity,
        buyerInfo,
        paymentMethod,
        total: calculateTotal(),
        transactionId: `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        qrCode: `EVENT-${event.id}-${Date.now()}`,
        status: 'completed'
      }

      // In real app, this would call payment API
      console.log('Payment processed:', paymentData)

      setPaymentStep('success')
      
      // Add notification
      addNotification({
        title: "Event Ticket Purchase Successful",
        content: `Your tickets for "${event.name}" have been purchased successfully. Tickets will be sent to your email.`,
        type: "EVENT"
      })
      
      toast.success("Payment successful! Your tickets have been issued.")
      
      // Redirect to success page after 3 seconds
      setTimeout(() => {
        router.push(`/events/${event.id}/success?transactionId=${paymentData.transactionId}&qr=${paymentData.qrCode}&quantity=${ticketQuantity}`)
      }, 3000)

    } catch (error) {
      toast.error("Payment failed. Please try again.")
      setPaymentStep('payment')
    } finally {
      setLoading(false)
    }
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <Button variant="ghost" onClick={() => router.back()} className="mb-8 text-gray-300 hover:text-red-500">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 text-white">Event Ticket Payment</h1>
          <div className="flex justify-center items-center space-x-4 text-sm text-gray-400">
            <div className={`flex items-center ${paymentStep === 'info' ? 'text-red-500' : paymentStep === 'payment' || paymentStep === 'processing' || paymentStep === 'success' ? 'text-green-500' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${paymentStep === 'info' ? 'bg-red-500 text-white' : paymentStep === 'payment' || paymentStep === 'processing' || paymentStep === 'success' ? 'bg-green-500 text-white' : 'bg-gray-600 text-gray-300'}`}>
                1
              </div>
              Information
            </div>
            <div className="w-8 h-0.5 bg-gray-600"></div>
            <div className={`flex items-center ${paymentStep === 'payment' ? 'text-red-500' : paymentStep === 'processing' || paymentStep === 'success' ? 'text-green-500' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${paymentStep === 'payment' ? 'bg-red-500 text-white' : paymentStep === 'processing' || paymentStep === 'success' ? 'bg-green-500 text-white' : 'bg-gray-600 text-gray-300'}`}>
                2
              </div>
              Payment
            </div>
            <div className="w-8 h-0.5 bg-gray-600"></div>
            <div className={`flex items-center ${paymentStep === 'processing' ? 'text-red-500' : paymentStep === 'success' ? 'text-green-500' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${paymentStep === 'processing' ? 'bg-red-500 text-white' : paymentStep === 'success' ? 'bg-green-500 text-white' : 'bg-gray-600 text-gray-300'}`}>
                {paymentStep === 'success' ? <CheckCircle className="w-5 h-5" /> : '3'}
              </div>
              Complete
            </div>
          </div>
        </div>

        {paymentStep === 'info' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Event Information */}
              <Card className="bg-white/95 backdrop-blur-sm border border-gray-200 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-gray-900">Event Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-gray-700">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">{event.name}</h3>
                    <p className="text-sm text-gray-600">{event.description}</p>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Date & Time:</span>
                      <span className="font-medium">{formatDate(event.date)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Location:</span>
                      <span className="font-medium">{event.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Organization:</span>
                      <span className="font-medium">{event.organization?.name || 'TON Platform'}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Ticket Type Selection */}
              <Card className="bg-white/95 backdrop-blur-sm border border-gray-200 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900">
                    <Ticket className="h-5 w-5 text-red-500" />
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
                            : "border-gray-300 hover:border-gray-400"
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
                            <div className="text-lg font-bold text-red-500">
                              {formatCurrency(ticketType.price)}
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
              <Card className="bg-white/95 backdrop-blur-sm border border-gray-200 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900">
                    <User className="h-5 w-5 text-red-500" />
                    Buyer Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="text-gray-700 font-medium">Full Name *</Label>
                      <Input
                        id="fullName"
                        value={buyerInfo.fullName}
                        onChange={(e) => handleInputChange("fullName", e.target.value)}
                        placeholder="John Doe"
                        className="bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-red-500 focus:ring-red-500/20"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-700 font-medium">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={buyerInfo.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="john@example.com"
                        className="bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-red-500 focus:ring-red-500/20"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-gray-700 font-medium">Phone Number *</Label>
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
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              <Card className="sticky top-8 bg-white/95 backdrop-blur-sm border border-gray-200 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900">
                    <Ticket className="h-5 w-5 text-red-500" />
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Ticket Quantity */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Ticket Quantity:</span>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setTicketQuantity(Math.max(1, ticketQuantity - 1))}
                          className="border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                          -
                        </Button>
                        <span className="w-12 text-center font-medium text-gray-900">
                          {ticketQuantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setTicketQuantity(Math.min(10, ticketQuantity + 1))}
                          className="border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                          +
                        </Button>
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600">Ticket Type:</span>
                      <span className="text-gray-900">{event.ticketTypes.find(t => t.id === selectedTicketType)?.name || "N/A"}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600">Price per ticket:</span>
                      <span className="text-gray-900">{formatCurrency(event.ticketTypes.find(t => t.id === selectedTicketType)?.price || 0)}</span>
                    </div>

                    <Separator className="bg-gray-300" />

                    <div className="flex justify-between text-lg font-bold">
                      <span className="text-gray-900">Total:</span>
                      <span className="text-red-500">
                        {formatCurrency(calculateTotal())}
                      </span>
                    </div>
                  </div>

                  <Button 
                    className="w-full bg-red-600 hover:bg-red-700 text-white" 
                    size="lg"
                    onClick={handleProceedToPayment}
                    disabled={!selectedTicketType}
                  >
                    <CreditCard className="h-5 w-5 mr-2" />
                    Proceed to Payment
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {paymentStep === 'payment' && (
          <div className="max-w-4xl mx-auto">
            <Card className="bg-white/95 backdrop-blur-sm border border-gray-200 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <CreditCard className="h-5 w-5 text-red-500" />
                  Payment Method
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Choose your preferred payment method
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="text-gray-700">
                  <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-red-300 transition-colors">
                    <RadioGroupItem value="bank_transfer" id="bank_transfer" />
                    <div className="flex-1">
                      <Label htmlFor="bank_transfer" className="text-gray-900 font-medium cursor-pointer">Bank Transfer</Label>
                      <p className="text-sm text-gray-600">Transfer money directly to our bank account</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg opacity-50">
                    <RadioGroupItem value="vnpay" id="vnpay" disabled />
                    <div className="flex-1">
                      <Label htmlFor="vnpay" className="text-gray-500 font-medium">VNPay</Label>
                      <p className="text-sm text-gray-500">Coming Soon</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg opacity-50">
                    <RadioGroupItem value="momo" id="momo" disabled />
                    <div className="flex-1">
                      <Label htmlFor="momo" className="text-gray-500 font-medium">MoMo</Label>
                      <p className="text-sm text-gray-500">Coming Soon</p>
                    </div>
                  </div>
                </RadioGroup>

                {paymentMethod === 'bank_transfer' && (
                  <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-4">Bank Transfer Information</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Bank:</span>
                        <span className="font-medium text-gray-900">Vietcombank</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Account Name:</span>
                        <span className="font-medium text-gray-900">TON Platform</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Account Number:</span>
                        <span className="font-medium text-gray-900">1234567890</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Amount:</span>
                        <span className="font-bold text-red-500">{formatCurrency(calculateTotal())}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Reference:</span>
                        <span className="font-medium text-gray-900">EVT-{event.id}</span>
                      </div>
                    </div>
                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                      <p className="text-sm text-yellow-800">
                        <strong>Important:</strong> Please include the reference code in your transfer description. 
                        Your tickets will be sent via email within 24 hours after receiving payment.
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex gap-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setPaymentStep('info')}
                    className="flex-1"
                  >
                    Back to Information
                  </Button>
                  <Button 
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white" 
                    onClick={handlePayment}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-5 w-5 mr-2" />
                        Complete Payment
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {paymentStep === 'processing' && (
          <div className="max-w-2xl mx-auto text-center">
            <Card className="bg-white/95 backdrop-blur-sm border border-gray-200 shadow-xl">
              <CardContent className="py-12">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-500 mx-auto mb-6"></div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Processing Payment</h2>
                <p className="text-gray-600">Please wait while we process your payment...</p>
              </CardContent>
            </Card>
          </div>
        )}

        {paymentStep === 'success' && (
          <div className="max-w-2xl mx-auto text-center">
            <Card className="bg-white/95 backdrop-blur-sm border border-gray-200 shadow-xl">
              <CardContent className="py-12">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Payment Successful!</h2>
                <p className="text-gray-600 mb-6">Your tickets have been issued successfully.</p>
                <p className="text-sm text-gray-500">Redirecting to confirmation page...</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

export default function EventPaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    }>
      <EventPaymentContent />
    </Suspense>
  )
}
