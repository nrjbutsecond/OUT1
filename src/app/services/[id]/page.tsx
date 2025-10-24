import { notFound } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ServicePurchaseButton } from "@/components/services/service-purchase-button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import { CheckCircle } from "lucide-react"

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const service = await prisma.service.findUnique({
    where: { id },
    include: {
      organization: true,
    },
  })

  if (!service || !service.approved) {
    notFound()
  }

  const session = await getServerSession(authOptions)
  const features = JSON.parse(service.features) as string[]

  // Check if user already purchased this service
  let hasPurchased = false
  if (session?.user) {
    const purchase = await prisma.servicePurchase.findFirst({
      where: {
        userId: session.user.id,
        serviceId: service.id,
      },
    })
    hasPurchased = !!purchase
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="tedx-gradient text-white py-12">
          <div className="container">
            <Badge variant="secondary" className="mb-4">
              {service.organizationId ? service.organization?.name : "TON"}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{service.name}</h1>
            <p className="text-xl text-red-50 max-w-3xl">{service.description}</p>
          </div>
        </div>

        <div className="container py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Tính năng dịch vụ</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Về dịch vụ</CardTitle>
                </CardHeader>
                <CardContent className="prose max-w-none">
                  <p>
                    {service.description}
                  </p>
                  <p className="text-muted-foreground mt-4">
                    Dịch vụ này được cung cấp bởi{" "}
                    <strong>{service.organizationId ? service.organization?.name : "TON"}</strong>
                  </p>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="sticky top-20">
                <CardHeader>
                  <CardTitle className="text-3xl font-bold text-primary">
                    {formatCurrency(service.price)}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge>{service.category}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {hasPurchased ? (
                    <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-md text-sm">
                      You have already purchased this service
                    </div>
                  ) : (
                    <ServicePurchaseButton serviceId={service.id} />
                  )}

                  <div className="border-t pt-4 space-y-2 text-sm text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Service Type</span>
                      <span className="font-medium text-foreground">{service.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Provider</span>
                      <span className="font-medium text-foreground">
                        {service.organizationId ? service.organization?.name : "TON"}
                      </span>
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

