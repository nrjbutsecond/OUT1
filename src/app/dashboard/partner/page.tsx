import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Users, Calendar, Package, ShoppingBag, TrendingUp, Building2 } from "lucide-react"

export default async function PartnerDashboard() {
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
      _count: {
        select: {
          members: true,
          events: true,
          products: true,
        }
      }
    }
  })

  // Get recent orders for partner's products
  const recentOrders = await prisma.order.findMany({
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
    take: 5
  })

  const totalRevenue = recentOrders.reduce((sum, order) => {
    const partnerItems = order.items.filter(item => 
      item.product.organizationId === organization?.id
    )
    return sum + partnerItems.reduce((itemSum, item) => itemSum + (item.price * item.quantity), 0)
  }, 0)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard Đối tác</h1>
        <p className="text-muted-foreground">
          Chào mừng trở lại, {session.user.name}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Thành viên</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{organization?._count.members || 0}</div>
            <p className="text-xs text-muted-foreground">
              Tổng số thành viên trong tổ chức
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sự kiện</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{organization?._count.events || 0}</div>
            <p className="text-xs text-muted-foreground">
              Sự kiện đã tổ chức
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sản phẩm</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{organization?._count.products || 0}</div>
            <p className="text-xs text-muted-foreground">
              Sản phẩm đang bán
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Doanh thu</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalRevenue.toLocaleString('vi-VN')}đ
            </div>
            <p className="text-xs text-muted-foreground">
              Từ đơn hàng gần đây
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Organization Info */}
      {organization && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Thông tin tổ chức
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><strong>Tên:</strong> {organization.name}</p>
              <p><strong>Loại:</strong> {organization.type}</p>
              <p><strong>Mô tả:</strong> {organization.description}</p>
              <p><strong>Chiết khấu:</strong> {organization.commission}%</p>
            </div>
            <div className="mt-4">
              <Button asChild>
                <Link href={`/partners/${organization.id}`}>
                  Xem trang tổ chức
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Đơn hàng gần đây
          </CardTitle>
          <CardDescription>
            Các đơn hàng có sản phẩm của tổ chức bạn
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recentOrders.length === 0 ? (
            <p className="text-muted-foreground">Chưa có đơn hàng nào</p>
          ) : (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">Đơn hàng #{order.id.slice(-8)}</p>
                      <p className="text-sm text-muted-foreground">
                        Khách hàng: {order.user.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Ngày: {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        {order.total.toLocaleString('vi-VN')}đ
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {order.status}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Thao tác nhanh</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button asChild variant="outline">
              <Link href="/events">
                Tạo sự kiện mới
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/merchandise">
                Thêm sản phẩm
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/calendar">
                Xem lịch
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


