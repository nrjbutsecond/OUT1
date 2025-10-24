import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Package, Plus } from "lucide-react"

export default async function PartnerProductsPage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "PARTNER") {
    redirect("/login")
  }

  // Get partner's organization
  const organization = await prisma.organization.findFirst({
    where: {
      OR: [
        { createdBy: session.user.id },
        { 
          members: {
            some: {
              userId: session.user.id,
              approved: true
            }
          }
        }
      ]
    },
    include: {
      products: {
        orderBy: {
          createdAt: "desc"
        }
      }
    }
  })

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Sản phẩm của tổ chức</h1>
          <p className="text-muted-foreground">
            Quản lý sản phẩm của {organization?.name}
          </p>
        </div>
        <Button asChild>
          <Link href="/merchandise">
            <Plus className="h-4 w-4 mr-2" />
            Thêm sản phẩm mới
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Danh sách sản phẩm
          </CardTitle>
          <CardDescription>
            Tổng cộng {organization?.products.length || 0} sản phẩm
          </CardDescription>
        </CardHeader>
        <CardContent>
          {organization?.products.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Chưa có sản phẩm nào</p>
              <Button asChild className="mt-4">
                <Link href="/merchandise">
                  Thêm sản phẩm đầu tiên
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {organization?.products.map((product) => (
                <div key={product.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {product.description}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Danh mục: {product.category}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Tồn kho: {product.stock} sản phẩm
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {product.price.toLocaleString('vi-VN')}đ
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {product.approved ? "Đã duyệt" : "Chờ duyệt"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
