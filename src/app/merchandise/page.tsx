import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { prisma } from "@/lib/prisma"
import { ProductCard } from "@/components/merchandise/product-card"
import { ProductFilters } from "@/components/merchandise/product-filters"

export default async function MerchandisePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string; org?: string }>
}) {
  const params = await searchParams
  const products = await prisma.product.findMany({
    where: {
      approved: true,
      stock: {
        gt: 0,
      },
      ...(params.category && {
        category: params.category,
      }),
      ...(params.search && {
        OR: [
          { name: { contains: params.search } },
          { description: { contains: params.search } },
        ],
      }),
      ...(params.org && params.org !== "all" && {
        organizationId: params.org === "ton" ? null : params.org,
      }),
    },
    include: {
      organization: true,
    },
    orderBy: [
      { organizationId: "asc" }, // TON products first (null values)
      { createdAt: "desc" },
    ],
  })

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
                    <div className="tedx-gradient text-white py-16">
          <div className="container">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">TON Merchandise</h1>
            <p className="text-xl text-red-50 max-w-2xl">
              Cửa hàng chính thức của TON và các tổ chức đối tác
            </p>
          </div>
        </div>

        <div className="container py-12">
          <ProductFilters />

          {products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                Không tìm thấy sản phẩm nào
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}


