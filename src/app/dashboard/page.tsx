import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Users, Calendar, Package, ShoppingBag, TrendingUp, Building2, GraduationCap, FileText } from "lucide-react"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  // Get user-specific data based on role
  let stats = []
  const recentActivity = []

  switch (session.user.role) {
    case "ADMIN":
      const [totalUsers, totalOrgs, totalEvents, totalProducts] = await Promise.all([
        prisma.user.count(),
        prisma.organization.count(),
        prisma.event.count(),
        prisma.product.count()
      ])
      
      stats = [
        { title: "Tổng người dùng", value: totalUsers, icon: Users, color: "text-blue-600" },
        { title: "Tổ chức", value: totalOrgs, icon: Building2, color: "text-green-600" },
        { title: "Sự kiện", value: totalEvents, icon: Calendar, color: "text-purple-600" },
        { title: "Sản phẩm", value: totalProducts, icon: Package, color: "text-orange-600" }
      ]
      break

    case "PARTNER":
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
              products: true
            }
          }
        }
      })

      stats = [
        { title: "Thành viên", value: organization?._count.members || 0, icon: Users, color: "text-blue-600" },
        { title: "Sự kiện", value: organization?._count.events || 0, icon: Calendar, color: "text-purple-600" },
        { title: "Sản phẩm", value: organization?._count.products || 0, icon: Package, color: "text-orange-600" },
        { title: "Tổ chức", value: organization?.name || "Chưa có", icon: Building2, color: "text-green-600" }
      ]
      break

    case "MENTOR":
      const [totalSessions, totalStudents] = await Promise.all([
        prisma.mentorSession.count({
          where: { mentorId: session.user.id }
        }),
        prisma.mentorSession.findMany({
          where: { mentorId: session.user.id },
          select: { studentId: true },
          distinct: ['studentId']
        })
      ])

      stats = [
        { title: "Phiên mentoring", value: totalSessions, icon: GraduationCap, color: "text-blue-600" },
        { title: "Học viên", value: totalStudents.length, icon: Users, color: "text-green-600" },
        { title: "Tài liệu", value: 0, icon: FileText, color: "text-purple-600" },
        { title: "Lịch dạy", value: 0, icon: Calendar, color: "text-orange-600" }
      ]
      break

    case "USER":
    default:
      const [userOrders, userTickets] = await Promise.all([
        prisma.order.count({
          where: { userId: session.user.id }
        }),
        prisma.eventTicket.count({
          where: { userId: session.user.id }
        })
      ])

      stats = [
        { title: "Đơn hàng", value: userOrders, icon: ShoppingBag, color: "text-blue-600" },
        { title: "Vé sự kiện", value: userTickets, icon: Calendar, color: "text-green-600" },
        { title: "Học tập", value: 0, icon: GraduationCap, color: "text-purple-600" },
        { title: "Hồ sơ", value: "Hoàn thành", icon: FileText, color: "text-orange-600" }
      ]
      break
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard Tổng quan</h1>
        <p className="text-muted-foreground">
          Chào mừng trở lại, {session.user.name}! Đây là tổng quan về tài khoản của bạn.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Thao tác nhanh</CardTitle>
          <CardDescription>
            Truy cập nhanh các tính năng chính
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {session.user.role === "ADMIN" && (
              <>
                <Button asChild variant="outline">
                  <Link href="/dashboard/admin/users">
                    <Users className="h-4 w-4 mr-2" />
                    Quản lý người dùng
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/dashboard/admin/organizations">
                    <Building2 className="h-4 w-4 mr-2" />
                    Quản lý tổ chức
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/dashboard/admin/events">
                    <Calendar className="h-4 w-4 mr-2" />
                    Quản lý sự kiện
                  </Link>
                </Button>
              </>
            )}
            
            {session.user.role === "PARTNER" && (
              <>
                <Button asChild variant="outline">
                  <Link href="/dashboard/partner/members">
                    <Users className="h-4 w-4 mr-2" />
                    Thành viên
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/dashboard/partner/events">
                    <Calendar className="h-4 w-4 mr-2" />
                    Sự kiện
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/dashboard/partner/products">
                    <Package className="h-4 w-4 mr-2" />
                    Sản phẩm
                  </Link>
                </Button>
              </>
            )}

            {session.user.role === "MENTOR" && (
              <>
                <Button asChild variant="outline">
                  <Link href="/dashboard/mentor/schedule">
                    <Calendar className="h-4 w-4 mr-2" />
                    Lịch dạy
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/dashboard/mentor/students">
                    <Users className="h-4 w-4 mr-2" />
                    Học viên
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/dashboard/mentor/materials">
                    <FileText className="h-4 w-4 mr-2" />
                    Tài liệu
                  </Link>
                </Button>
              </>
            )}

            {session.user.role === "USER" && (
              <>
                <Button asChild variant="outline">
                  <Link href="/dashboard/user/profile">
                    <FileText className="h-4 w-4 mr-2" />
                    Hồ sơ cá nhân
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/dashboard/user/orders">
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    Đơn hàng
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/dashboard/user/learning">
                    <GraduationCap className="h-4 w-4 mr-2" />
                    Học tập
                  </Link>
                </Button>
              </>
            )}

            {/* Common actions for all roles */}
            <Button asChild variant="outline">
              <Link href="/calendar">
                <Calendar className="h-4 w-4 mr-2" />
                Lịch
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/services">
                <Package className="h-4 w-4 mr-2" />
                Dịch vụ
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/events">
                <Calendar className="h-4 w-4 mr-2" />
                Sự kiện
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}



