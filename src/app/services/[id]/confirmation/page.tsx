"use client"

import { Suspense, useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Mail, Phone, ArrowRight, Home } from "lucide-react"
import Link from "next/link"

interface Service {
  id: string
  name: string
  description: string
  price: number
  organization?: {
    name: string
  }
}

function ServiceConfirmationContent() {
  const { data: session } = useSession()
  const params = useParams()
  const router = useRouter()
  const [service, setService] = useState<Service | null>(null)

  useEffect(() => {
    const loadService = async () => {
      // Mock API call to fetch service details
      await new Promise(resolve => setTimeout(resolve, 500))
      const mockService: Service = {
        id: params.id as string,
        name: "Event Planning Consultation",
        description: "Expert guidance for planning your TEDx event from start to finish.",
        price: 5000000,
        organization: { name: "TON Platform" }
      }
      setService(mockService)
    }

    loadService()
  }, [params.id])

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
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Icon */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-600 rounded-full mb-4">
              <CheckCircle className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-4 text-white">Purchase Successful!</h1>
            <p className="text-xl text-gray-300">
              Thank you for purchasing {service.name}
            </p>
          </div>

          {/* Service Details */}
          <Card className="bg-gray-800/90 backdrop-blur-sm border border-gray-700/50 shadow-xl mb-8">
            <CardHeader>
              <CardTitle className="text-white">Service Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-left">
              <div className="flex justify-between">
                <span className="text-gray-300">Service:</span>
                <span className="text-white font-medium">{service.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Provider:</span>
                <span className="text-white">{service.organization?.name || 'TON Platform'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Amount Paid:</span>
                <span className="text-green-500 font-bold">₫{service.price.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="bg-gray-800/90 backdrop-blur-sm border border-gray-700/50 shadow-xl mb-8">
            <CardHeader>
              <CardTitle className="text-white">What&apos;s Next?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-left">
              <div className="flex items-start space-x-3">
                <Mail className="h-5 w-5 text-red-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-white">Payment Instructions</h4>
                  <p className="text-sm text-gray-400">
                    You will receive detailed payment instructions via email within the next few minutes.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Phone className="h-5 w-5 text-red-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-white">Service Activation</h4>
                  <p className="text-sm text-gray-400">
                    Once payment is confirmed, our support team will contact you within 24 hours to schedule your service.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-red-600 hover:bg-red-700 text-white">
              <Link href="/dashboard">
                <Home className="h-4 w-4 mr-2" />
                Go to Dashboard
              </Link>
            </Button>
            <Button variant="outline" asChild className="border-gray-600 text-gray-300 hover:bg-gray-700">
              <Link href="/services">
                <ArrowRight className="h-4 w-4 mr-2" />
                Browse More Services
              </Link>
            </Button>
          </div>

          {/* Contact Info */}
          <div className="mt-12 p-6 bg-gray-800/50 rounded-lg">
            <h3 className="font-medium text-white mb-2">Need Help?</h3>
            <p className="text-sm text-gray-400">
              Contact our support team at{" "}
              <a href="mailto:support@ton-platform.vn" className="text-red-500 hover:text-red-400">
                support@ton-platform.vn
              </a>
              {" "}or call{" "}
              <a href="tel:+84123456789" className="text-red-500 hover:text-red-400">
                +84 123 456 789
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ServiceConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    }>
      <ServiceConfirmationContent />
    </Suspense>
  )
}
