import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { prisma } from "@/lib/prisma"
import { ServiceCard } from "@/components/services/service-card"
import { ServiceFilters } from "@/components/services/service-filters"

export default async function ServicesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string }>
}) {
  const params = await searchParams
  const services = await prisma.service.findMany({
    where: {
      approved: true,
      ...(params.category && {
        category: params.category,
      }),
      ...(params.search && {
        OR: [
          { name: { contains: params.search } },
          { description: { contains: params.search } },
        ],
      }),
    },
    include: {
      organization: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
                    <div className="tedx-gradient text-white py-16">
          <div className="container">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Dịch vụ của TON</h1>
            <p className="text-xl text-red-50 max-w-2xl">
              Khám phá các dịch vụ chuyên nghiệp giúp nâng cao chất lượng sự kiện TEDx của bạn
            </p>
          </div>
        </div>

        <div className="container py-12">
          <ServiceFilters />

          {services.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                Không tìm thấy dịch vụ nào phù hợp
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}


