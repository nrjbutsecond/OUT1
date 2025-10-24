"use client"

import { Suspense, useEffect, useState } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Download, Mail, Calendar, User, CreditCard, ArrowRight } from "lucide-react"
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

function ServiceSuccessContent() {
  const { data: session } = useSession()
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [service, setService] = useState<Service | null>(null)
  const [transactionId, setTransactionId] = useState<string>("")

  useEffect(() => {
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
    }

    const txId = searchParams.get('transactionId')
    if (txId) {
      setTransactionId(txId)
    }

    loadService()
  }, [params.id, searchParams])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full mb-6">
            <CheckCircle className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4 text-white">Payment Successful!</h1>
          <p className="text-xl text-gray-300 mb-2">Your service has been activated</p>
          <p className="text-gray-400">Transaction ID: {transactionId}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Service Details */}
          <Card className="bg-white/95 backdrop-blur-sm border border-gray-200 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <User className="h-5 w-5 text-red-500" />
                Service Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-700">
              <div>
                <h3 className="font-semibold text-gray-900 text-lg">{service.name}</h3>
                <p className="text-sm text-gray-600">{service.description}</p>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Provider:</span>
                  <span className="font-medium">{service.organization?.name || 'TON Platform'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Category:</span>
                  <span className="capitalize font-medium">{service.category.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Amount Paid:</span>
                  <span className="font-bold text-red-500">{formatCurrency(service.price)}</span>
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

          {/* Next Steps */}
          <Card className="bg-white/95 backdrop-blur-sm border border-gray-200 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <Calendar className="h-5 w-5 text-red-500" />
                What's Next?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-700">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                  <div>
                    <h4 className="font-medium text-gray-900">Email Confirmation</h4>
                    <p className="text-sm text-gray-600">You'll receive a confirmation email with service details and next steps.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                  <div>
                    <h4 className="font-medium text-gray-900">Team Contact</h4>
                    <p className="text-sm text-gray-600">Our support team will contact you within 24 hours to schedule your consultation.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                  <div>
                    <h4 className="font-medium text-gray-900">Service Activation</h4>
                    <p className="text-sm text-gray-600">Your service will be fully activated and accessible from your dashboard.</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Need Help?</h4>
                <p className="text-sm text-blue-800">
                  If you have any questions about your service, please contact our support team at 
                  <a href="mailto:support@ton-platform.vn" className="text-blue-600 hover:underline ml-1">
                    support@ton-platform.vn
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
          <Button asChild className="bg-red-600 hover:bg-red-700 text-white px-8 py-3">
            <Link href="/dashboard">
              <ArrowRight className="h-5 w-5 mr-2" />
              Go to Dashboard
            </Link>
          </Button>
          <Button variant="outline" asChild className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3">
            <Link href="/services">
              Browse More Services
            </Link>
          </Button>
          <Button variant="outline" asChild className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3">
            <a href="mailto:support@ton-platform.vn">
              <Mail className="h-5 w-5 mr-2" />
              Contact Support
            </a>
          </Button>
        </div>

        {/* Receipt Download */}
        <div className="text-center mt-8">
          <Button variant="ghost" className="text-gray-400 hover:text-white">
            <Download className="h-5 w-5 mr-2" />
            Download Receipt
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function ServiceSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    }>
      <ServiceSuccessContent />
    </Suspense>
  )
}
