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
import { ArrowLeft, CreditCard, User, Mail, Phone, Building, FileText, QrCode, Clock, CheckCircle } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
import { useApp } from "@/contexts/app-context"

interface Service {
  id: string
  name: string
  description: string
  price: number
  category: string
  features: string[]
  organization?: {
    name: string
  }
}

interface BuyerInfo {
  fullName: string
  email: string
  phone: string
  organization: string
  notes: string
}

function ServicePaymentContent() {
  const { data: session, status } = useSession()
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { addNotification } = useApp()
  const [service, setService] = useState<Service | null>(null)
  const [buyerInfo, setBuyerInfo] = useState<BuyerInfo>({
    fullName: "",
    email: "",
    phone: "",
    organization: "",
    notes: ""
  })
  const [paymentMethod, setPaymentMethod] = useState("bank_transfer")
  const [loading, setLoading] = useState(false)
  const [paymentStep, setPaymentStep] = useState<'info' | 'payment' | 'processing' | 'success'>('info')

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
      return
    }

    const loadService = async () => {
      // Mock API call to fetch service details
      await new Promise(resolve => setTimeout(resolve, 500))
      const mockService: Service = {
        id: params.id as string,
        name: "Event Planning Consultation",
        description: "Expert guidance for planning your TEDx event from start to finish.",
        price: 5000000,
        category: "onsite",
        features: ["Initial consultation", "Timeline development", "Budget planning", "Vendor recommendations"],
        organization: { name: "TON Platform" }
      }
      setService(mockService)

      // Get buyer info from URL params (passed from checkout)
      const fullName = searchParams.get('fullName') || session?.user?.name || ""
      const email = searchParams.get('email') || session?.user?.email || ""
      const phone = searchParams.get('phone') || ""
      const organization = searchParams.get('organization') || ""
      const notes = searchParams.get('notes') || ""

      setBuyerInfo({
        fullName,
        email,
        phone,
        organization,
        notes
      })
    }

    loadService()
  }, [params.id, status, router, session, searchParams])

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
    return true
  }

  const handleProceedToPayment = () => {
    if (!validateForm()) return
    setPaymentStep('payment')
  }

  const handlePayment = async () => {
    if (!service) return

    setPaymentStep('processing')
    setLoading(true)

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000))

      // Mock payment success
      const paymentData = {
        serviceId: service.id,
        userId: session?.user?.id,
        buyerInfo,
        paymentMethod,
        total: service.price,
        transactionId: `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        status: 'completed'
      }

      // In real app, this would call payment API
      console.log('Payment processed:', paymentData)

      setPaymentStep('success')
      
      // Add notification
      addNotification({
        title: "Service Purchase Successful",
        content: `Your purchase of "${service.name}" has been completed successfully. Service will be activated within 24 hours.`,
        type: "SERVICE"
      })
      
      toast.success("Payment successful! Service has been activated.")
      
      // Redirect to success page after 3 seconds
      setTimeout(() => {
        router.push(`/services/${service.id}/success?transactionId=${paymentData.transactionId}`)
      }, 3000)

    } catch (error) {
      toast.error("Payment failed. Please try again.")
      setPaymentStep('payment')
    } finally {
      setLoading(false)
    }
  }

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    )
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
          <h1 className="text-4xl font-bold mb-4 text-white">Service Payment</h1>
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
              {/* Service Information */}
              <Card className="bg-white/95 backdrop-blur-sm border border-gray-200 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-gray-900">Service Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-gray-700">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">{service.name}</h3>
                    <p className="text-sm text-gray-600">{service.description}</p>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Category:</span>
                      <span className="capitalize font-medium">{service.category.replace('_', ' ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Provider:</span>
                      <span className="font-medium">{service.organization?.name || 'TON Platform'}</span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h4 className="font-medium text-gray-900 mb-2">Features Included:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                      {service.features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                    <div className="space-y-2">
                      <Label htmlFor="organization" className="text-gray-700 font-medium">Organization</Label>
                      <Input
                        id="organization"
                        value={buyerInfo.organization}
                        onChange={(e) => handleInputChange("organization", e.target.value)}
                        placeholder="Your Organization"
                        className="bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-red-500 focus:ring-red-500/20"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes" className="text-gray-700 font-medium">Additional Notes</Label>
                    <textarea
                      id="notes"
                      value={buyerInfo.notes}
                      onChange={(e) => handleInputChange("notes", e.target.value)}
                      placeholder="Any special requirements or questions..."
                      rows={3}
                      className="w-full px-3 py-2 bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:border-red-500 focus:ring-red-500/20 rounded-md"
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
                    <FileText className="h-5 w-5 text-red-500" />
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Service:</span>
                      <span className="text-gray-900 font-medium">{service.name}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600">Provider:</span>
                      <span className="text-gray-900">{service.organization?.name || 'TON Platform'}</span>
                    </div>

                    <Separator className="bg-gray-300" />

                    <div className="flex justify-between text-lg font-bold">
                      <span className="text-gray-900">Total:</span>
                      <span className="text-red-500">
                        {formatCurrency(service.price)}
                      </span>
                    </div>
                  </div>

                  <Button 
                    className="w-full bg-red-600 hover:bg-red-700 text-white" 
                    size="lg"
                    onClick={handleProceedToPayment}
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
                        <span className="font-bold text-red-500">{formatCurrency(service.price)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Reference:</span>
                        <span className="font-medium text-gray-900">SVC-{service.id}</span>
                      </div>
                    </div>
                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                      <p className="text-sm text-yellow-800">
                        <strong>Important:</strong> Please include the reference code in your transfer description. 
                        We will activate your service within 24 hours after receiving payment.
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
                <p className="text-gray-600 mb-6">Your service has been activated successfully.</p>
                <p className="text-sm text-gray-500">Redirecting to confirmation page...</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

export default function ServicePaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    }>
      <ServicePaymentContent />
    </Suspense>
  )
}
