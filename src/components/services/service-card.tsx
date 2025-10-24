"use client"

import { Service, Organization } from "@prisma/client"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"
import { ServicePurchaseButton } from "./service-purchase-button"
import Link from "next/link"

type ServiceWithOrg = Service & { organization: Organization | null }

export function ServiceCard({ service }: { service: ServiceWithOrg }) {
  const features = JSON.parse(service.features) as string[]

  return (
    <Card className="flex flex-col h-full light-theme bg-white/95 backdrop-blur-sm border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <CardHeader>
        <div className="flex items-start justify-between mb-2">
          <Badge variant={service.organizationId ? "secondary" : "default"} className="bg-red-100 text-red-800">
            {service.organizationId ? service.organization?.name : "TON"}
          </Badge>
          <Badge variant="outline" className="border-gray-300 text-gray-700">{service.category}</Badge>
        </div>
        <CardTitle className="line-clamp-2 text-gray-900">{service.name}</CardTitle>
        <CardDescription className="line-clamp-3 text-gray-600">{service.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="space-y-2">
          <p className="text-sm font-semibold text-gray-900">Key Features:</p>
          <ul className="text-sm text-gray-600 space-y-1">
            {features.slice(0, 3).map((feature, index) => (
              <li key={index} className="flex items-start">
                <span className="mr-2 text-red-600">•</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="text-2xl font-bold text-red-600 mb-4">
            {formatCurrency(service.price)}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50" asChild>
              <Link href={`/services/${service.id}`}>View Details</Link>
            </Button>
            <ServicePurchaseButton serviceId={service.id} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}


