import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { prisma } from "@/lib/prisma"
import { PartnerCard } from "@/components/partners/partner-card"
import { PartnerFilters } from "@/components/partners/partner-filters"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function PartnersPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; search?: string }>
}) {
  const params = await searchParams
  const organizations = await prisma.organization.findMany({
    where: {
      approved: true,
      ...(params.type && params.type !== "all" && {
        type: params.type.toUpperCase() as "VIP" | "STANDARD" | "SPONSOR",
      }),
      ...(params.search && {
        name: { contains: params.search },
      }),
    },
    include: {
      _count: {
        select: {
          members: true,
          events: true,
          products: true,
        },
      },
    },
    orderBy: [
      { type: "asc" }, // VIP first
      { createdAt: "desc" },
    ],
  })

  const vipPartners = organizations.filter((org) => org.type === "VIP")
  const standardPartners = organizations.filter((org) => org.type === "STANDARD")
  const sponsors = organizations.filter((org) => org.type === "SPONSOR")

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
                    <div className="tedx-gradient text-white py-16">
          <div className="container">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Đối tác của TON</h1>
            <p className="text-xl text-red-50 max-w-2xl">
              Kết nối với các tổ chức TEDx và nhà tài trợ trên toàn quốc
            </p>
          </div>
        </div>

        <div className="container py-12">
          <PartnerFilters />

          <Tabs defaultValue="all" className="mt-8">
            <TabsList className="grid w-full max-w-md grid-cols-4">
              <TabsTrigger value="all">Tất cả ({organizations.length})</TabsTrigger>
              <TabsTrigger value="vip">VIP ({vipPartners.length})</TabsTrigger>
              <TabsTrigger value="standard">Standard ({standardPartners.length})</TabsTrigger>
              <TabsTrigger value="sponsor">Sponsor ({sponsors.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-8">
              {organizations.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-lg">Không tìm thấy đối tác nào</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {organizations.map((org) => (
                    <PartnerCard key={org.id} organization={org} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="vip" className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vipPartners.map((org) => (
                  <PartnerCard key={org.id} organization={org} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="standard" className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {standardPartners.map((org) => (
                  <PartnerCard key={org.id} organization={org} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="sponsor" className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sponsors.map((org) => (
                  <PartnerCard key={org.id} organization={org} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  )
}

