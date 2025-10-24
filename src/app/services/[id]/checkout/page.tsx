"use client"

import { Suspense, useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, CreditCard, User, Mail, Phone, Building, FileText } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

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

function ServiceCheckoutContent() {
  const { data: session, status } = useSession()
  const params = useParams()
  const router = useRouter()
  const [service, setService] = useState<Service | null>(null)
  const [buyerInfo, setBuyerInfo] = useState<BuyerInfo>({
    fullName: session?.user?.name || "",
    email: session?.user?.email || "",
    phone: "",
    organization: "",
    notes: ""
  })
  const [paymentMethod, setPaymentMethod] = useState("bank_transfer")
  const [loading, setLoading] = useState(false)

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

      // Populate buyer info if user is logged in
      if (session?.user) {
        setBuyerInfo(prev => ({
          ...prev,
          fullName: session.user.name || "",
          email: session.user.email || "",
        }))
      }
    }

    loadService()
  }, [params.id, status, router, session])

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

  const handlePurchase = async () => {
    if (!service || !validateForm()) return

    // Redirect to payment page with buyer info as URL params
    const params = new URLSearchParams({
      fullName: buyerInfo.fullName,
      email: buyerInfo.email,
      phone: buyerInfo.phone,
      organization: buyerInfo.organization,
      notes: buyerInfo.notes
    })

    router.push(`/services/${service.id}/payment?${params.toString()}`)
  }

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <Button variant="ghost" onClick={() => router.back()} className="mb-8 text-gray-300 hover:text-red-500">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Service Details
        </Button>

        <h1 className="text-4xl font-bold mb-8 text-center text-white">Service Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Service Information */}
            <Card className="bg-gray-800/90 backdrop-blur-sm border border-gray-700/50 shadow-xl">
              <CardHeader>
                <CardTitle className="text-white">Service Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-gray-300">
                <div>
                  <h3 className="font-semibold text-white text-lg">{service.name}</h3>
                  <p className="text-sm text-gray-400">{service.description}</p>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Category:</span>
                    <span className="capitalize">{service.category.replace('_', ' ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Provider:</span>
                    <span>{service.organization?.name || 'TON Platform'}</span>
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="font-medium text-white mb-2">Features Included:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-400">
                    {service.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Buyer Information */}
            <Card className="bg-gray-800/90 backdrop-blur-sm border border-gray-700/50 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <User className="h-5 w-5 text-red-500" />
                  Buyer Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-gray-300 font-medium">Full Name *</Label>
                    <Input
                      id="fullName"
                      value={buyerInfo.fullName}
                      onChange={(e) => handleInputChange("fullName", e.target.value)}
                      placeholder="John Doe"
                      className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-red-500 focus:ring-red-500/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-300 font-medium">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={buyerInfo.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="john@example.com"
                      className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-red-500 focus:ring-red-500/20"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-gray-300 font-medium">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={buyerInfo.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="+84 123 456 789"
                      className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-red-500 focus:ring-red-500/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="organization" className="text-gray-300 font-medium">Organization</Label>
                    <Input
                      id="organization"
                      value={buyerInfo.organization}
                      onChange={(e) => handleInputChange("organization", e.target.value)}
                      placeholder="Your Organization"
                      className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-red-500 focus:ring-red-500/20"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes" className="text-gray-300 font-medium">Additional Notes</Label>
                  <textarea
                    id="notes"
                    value={buyerInfo.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    placeholder="Any special requirements or questions..."
                    rows={3}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:border-red-500 focus:ring-red-500/20 rounded-md"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card className="bg-gray-800/90 backdrop-blur-sm border border-gray-700/50 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <CreditCard className="h-5 w-5 text-red-500" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="text-gray-300">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="bank_transfer" id="bank_transfer" />
                    <Label htmlFor="bank_transfer" className="text-gray-300">Bank Transfer</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="vnpay" id="vnpay" disabled />
                    <Label htmlFor="vnpay" className="text-gray-500">VNPay (Coming Soon)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="momo" id="momo" disabled />
                    <Label htmlFor="momo" className="text-gray-500">MoMo (Coming Soon)</Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card className="sticky top-8 bg-gray-800/90 backdrop-blur-sm border border-gray-700/50 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <FileText className="h-5 w-5 text-red-500" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Service:</span>
                    <span className="text-white font-medium">{service.name}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-300">Provider:</span>
                    <span className="text-white">{service.organization?.name || 'TON Platform'}</span>
                  </div>

                  <Separator className="bg-gray-700" />

                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-white">Total:</span>
                    <span className="text-red-500">
                      ₫{service.price.toLocaleString()}
                    </span>
                  </div>
                </div>

                <Button 
                  className="w-full bg-red-600 hover:bg-red-700 text-white" 
                  size="lg"
                  onClick={handlePurchase}
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
                      Complete Purchase
                    </>
                  )}
                </Button>

                <div className="text-xs text-gray-500 text-center space-y-1">
                  <p>• Payment instructions will be sent via email</p>
                  <p>• Service will be activated after payment confirmation</p>
                  <p>• Support team will contact you within 24 hours</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ServiceCheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    }>
      <ServiceCheckoutContent />
    </Suspense>
  )
}