import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ShoppingBag, Briefcase, Bell } from "lucide-react"

export default async function UserDashboard() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  const [orders, servicePurchases, notifications] = await Promise.all([
    prisma.order.findMany({
      where: { userId: session.user.id },
      take: 5,
      orderBy: { createdAt: "desc" },
    }),
    prisma.servicePurchase.findMany({
      where: { userId: session.user.id },
      include: { service: true },
    }),
    prisma.notification.findMany({
      where: { userId: session.user.id, read: false },
      take: 5,
      orderBy: { createdAt: "desc" },
    }),
  ])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Chào mừng, {session.user.name}!</h1>
        <p className="text-muted-foreground">Quản lý hoạt động của bạn trên TON Platform</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Đơn hàng</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.length}</div>
            <p className="text-xs text-muted-foreground">Tổng đơn hàng</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Dịch vụ</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{servicePurchases.length}</div>
            <p className="text-xs text-muted-foreground">Dịch vụ đã đăng ký</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Thông báo</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{notifications.length}</div>
            <p className="text-xs text-muted-foreground">Chưa đọc</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Dịch vụ đã đăng ký</CardTitle>
            <CardDescription>Các dịch vụ bạn đang sử dụng</CardDescription>
          </CardHeader>
          <CardContent>
            {servicePurchases.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">Bạn chưa đăng ký dịch vụ nào</p>
                <Button asChild>
                  <Link href="/services">Khám phá dịch vụ</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {servicePurchases.map((purchase) => (
                  <div key={purchase.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{purchase.service.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Trạng thái: {purchase.status}
                      </p>
                    </div>
                    {purchase.workspaceId && (
                      <Button size="sm" asChild>
                        <Link href={`/workspace/${purchase.workspaceId}`}>
                          Workspace
                        </Link>
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Thông báo mới</CardTitle>
            <CardDescription>Các thông báo chưa đọc</CardDescription>
          </CardHeader>
          <CardContent>
            {notifications.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Không có thông báo mới
              </p>
            ) : (
              <div className="space-y-4">
                {notifications.map((notif) => (
                  <div key={notif.id} className="p-3 border rounded-lg">
                    <p className="font-medium text-sm">{notif.title}</p>
                    <p className="text-sm text-muted-foreground">{notif.content}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Hành động nhanh</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <Button asChild>
            <Link href="/services">Khám phá dịch vụ</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/events">Xem sự kiện</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/merchandise">Mua sắm</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/profile">Cập nhật hồ sơ</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

