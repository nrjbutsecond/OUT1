import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ShoppingBag } from "lucide-react"

export default async function PartnerOrdersPage() {
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
    }
  })

  // Get orders for partner's products
  const orders = await prisma.order.findMany({
    where: {
      items: {
        some: {
          product: {
            organizationId: organization?.id
          }
        }
      }
    },
    include: {
      items: {
        include: {
          product: true
        }
      },
      user: true
    },
    orderBy: {
      createdAt: "desc"
    },
    take: 10
  })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Đơn hàng của tổ chức</h1>
        <p className="text-muted-foreground">
          Quản lý đơn hàng có sản phẩm của {organization?.name}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Danh sách đơn hàng
          </CardTitle>
          <CardDescription>
            Tổng cộng {orders.length} đơn hàng
          </CardDescription>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Chưa có đơn hàng nào</p>
              <Button asChild className="mt-4">
                <Link href="/dashboard/partner">
                  Quay về Dashboard
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const partnerItems = order.items.filter(item => 
                  item.product.organizationId === organization?.id
                )
                const partnerTotal = partnerItems.reduce((sum, item) => 
                  sum + (item.price * item.quantity), 0
                )

                return (
                  <div key={order.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">Đơn hàng #{order.id.slice(-8)}</p>
                        <p className="text-sm text-muted-foreground">
                          Khách hàng: {order.user.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Email: {order.user.email}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Ngày: {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                        </p>
                        <div className="mt-2">
                          <p className="text-sm font-medium">Sản phẩm của bạn:</p>
                          {partnerItems.map((item) => (
                            <p key={item.id} className="text-sm text-muted-foreground ml-2">
                              • {item.product.name} x{item.quantity}
                            </p>
                          ))}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          {partnerTotal.toLocaleString('vi-VN')}đ
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {order.status}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
