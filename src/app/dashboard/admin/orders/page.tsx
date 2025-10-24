import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ShoppingCart, Search, Eye, DollarSign, Package, Ticket } from "lucide-react"

export default async function AdminOrdersPage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "ADMIN") {
    redirect("/login")
  }

  const orders = await prisma.order.findMany({
    include: {
      user: true,
      items: {
        include: {
          product: true,
          event: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "default"
      case "PENDING":
        return "secondary"
      case "CANCELLED":
        return "destructive"
      case "PROCESSING":
        return "outline"
      default:
        return "outline"
    }
  }

  const getTypeBadgeVariant = (type: string) => {
    switch (type) {
      case "PRODUCT":
        return "default"
      case "EVENT":
        return "secondary"
      case "SERVICE":
        return "outline"
      default:
        return "outline"
    }
  }

  const totalRevenue = orders
    .filter((o: { status: string }) => o.status === "COMPLETED")
    .reduce((sum: number, order: { totalAmount: number }) => sum + order.totalAmount, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quản lý đơn hàng</h1>
          <p className="text-muted-foreground">
            Theo dõi và quản lý tất cả đơn hàng trong hệ thống
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ShoppingCart className="h-8 w-8 text-primary" />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tổng quan</CardTitle>
          <CardDescription>
            Thống kê đơn hàng và doanh thu
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-primary">{orders.length}</div>
              <div className="text-sm text-muted-foreground">Tổng đơn hàng</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {orders.filter((o: { status: string }) => o.status === "COMPLETED").length}
              </div>
              <div className="text-sm text-muted-foreground">Hoàn thành</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {orders.filter((o: { status: string }) => o.status === "PENDING").length}
              </div>
              <div className="text-sm text-muted-foreground">Chờ xử lý</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {totalRevenue.toLocaleString("vi-VN")} VND
              </div>
              <div className="text-sm text-muted-foreground">Doanh thu</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách đơn hàng</CardTitle>
          <CardDescription>
            Tìm kiếm và lọc đơn hàng
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm theo mã đơn hàng, tên khách hàng..."
                  className="pl-10"
                />
              </div>
            </div>
            <Select>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Lọc theo trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="COMPLETED">Hoàn thành</SelectItem>
                <SelectItem value="PENDING">Chờ xử lý</SelectItem>
                <SelectItem value="PROCESSING">Đang xử lý</SelectItem>
                <SelectItem value="CANCELLED">Đã hủy</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Lọc theo loại" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả loại</SelectItem>
                <SelectItem value="PRODUCT">Sản phẩm</SelectItem>
                <SelectItem value="EVENT">Sự kiện</SelectItem>
                <SelectItem value="SERVICE">Dịch vụ</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã đơn hàng</TableHead>
                <TableHead>Khách hàng</TableHead>
                <TableHead>Loại</TableHead>
                <TableHead>Số lượng</TableHead>
                <TableHead>Tổng tiền</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead>Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order: typeof orders[number]) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">#{order.id.slice(-8)}</TableCell>
                  <TableCell>{order.user.name}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      {order.items.map((_item: unknown, index: number) => (
                        <Badge key={index} variant={getTypeBadgeVariant(order.type)}>
                          {order.type === "MERCHANDISE" && <Package className="w-3 h-3 mr-1" />}
                          {order.type === "TICKET" && <Ticket className="w-3 h-3 mr-1" />}
                          {order.type}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{order.items.length}</TableCell>
                  <TableCell className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-1 text-green-600" />
                    {order.total.toLocaleString("vi-VN")} VND
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(order.status)}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}



