import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Users, 
  Building2, 
  Calendar, 
  Package, 
  ShoppingCart, 
  GraduationCap,
  TrendingUp,
  DollarSign
} from "lucide-react"

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "ADMIN") {
    redirect("/login")
  }

  // Fetch dashboard statistics
  const [
    totalUsers,
    totalOrganizations,
    totalEvents,
    totalProducts,
    totalServices,
    totalOrders,
    totalMentors,
    pendingOrganizations,
    pendingEvents,
    pendingProducts,
    recentUsers,
    recentOrders,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.organization.count(),
    prisma.event.count(),
    prisma.product.count(),
    prisma.service.count(),
    prisma.order.count(),
    prisma.user.count({ where: { role: "MENTOR" } }),
    prisma.organization.count({ where: { approved: false } }),
    prisma.event.count({ where: { approved: false } }),
    prisma.product.count({ where: { approved: false } }),
    prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        organizationMembers: {
          include: {
            organization: true,
          },
        },
      },
    }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        user: true,
        items: true,
      },
    }),
  ])

  // Calculate revenue
  const completedOrders = await prisma.order.findMany({
    where: { status: "DELIVERED" },
  })
  const totalRevenue = completedOrders.reduce((sum, order) => sum + order.total, 0)

  const stats = [
    {
      title: "Total Users",
      value: totalUsers,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Organizations",
      value: totalOrganizations,
      icon: Building2,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Events",
      value: totalEvents,
      icon: Calendar,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Products",
      value: totalProducts,
      icon: Package,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      title: "Services",
      value: totalServices,
      icon: Package,
      color: "text-indigo-600",
      bgColor: "bg-indigo-100",
    },
    {
      title: "Orders",
      value: totalOrders,
      icon: ShoppingCart,
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
    {
      title: "Mentors",
      value: totalMentors,
      icon: GraduationCap,
      color: "text-teal-600",
      bgColor: "bg-teal-100",
    },
    {
      title: "Revenue",
      value: `₫${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
    },
  ]

  const pendingItems = [
    {
      title: "Pending Organizations",
      count: pendingOrganizations,
      href: "/dashboard/admin/organizations",
    },
    {
      title: "Pending Events",
      count: pendingEvents,
      href: "/dashboard/admin/events",
    },
    {
      title: "Pending Products",
      count: pendingProducts,
      href: "/dashboard/admin/products",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome back, {session.user.name}! Here's what's happening with your platform.
        </p>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Pending Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-red-600" />
            Pending Approvals
          </CardTitle>
          <CardDescription>
            Items that need your attention
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {pendingItems.map((item) => (
              <div key={item.title} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{item.title}</p>
                    <p className="text-sm text-gray-600">{item.count} items</p>
                  </div>
                  {item.count > 0 && (
                    <Badge variant="destructive">{item.count}</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Users</CardTitle>
            <CardDescription>Latest registered users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant={user.role === "ADMIN" ? "destructive" : "secondary"}>
                      {user.role}
                    </Badge>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Latest orders placed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{order.user.name}</p>
                    <p className="text-sm text-gray-600">#{order.id.slice(-8)}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant={order.status === "DELIVERED" ? "default" : "secondary"}>
                      {order.status}
                    </Badge>
                    <p className="text-sm font-medium text-gray-900 mt-1">
                      ₫{order.total.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}