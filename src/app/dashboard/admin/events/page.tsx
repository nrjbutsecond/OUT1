import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar, Search, Plus, Edit, Trash2, Eye, CheckCircle, XCircle } from "lucide-react"

export default async function AdminEventsPage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "ADMIN") {
    redirect("/login")
  }

  const events = await prisma.event.findMany({
    include: {
      organization: true,
      tickets: {
        include: {
          user: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  const getStatusBadgeVariant = (approved: boolean) => {
    return approved ? "default" : "secondary"
  }

  const getTypeBadgeVariant = (type: string) => {
    switch (type) {
      case "TEDX":
        return "destructive"
      case "WORKSHOP":
        return "default"
      default:
        return "secondary"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Events Management</h1>
          <p className="text-muted-foreground">
            Manage all events in the platform
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-8 w-8 text-primary" />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tổng quan</CardTitle>
          <CardDescription>
            Thống kê sự kiện theo trạng thái và loại
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-primary">{events.length}</div>
              <div className="text-sm text-muted-foreground">Tổng sự kiện</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {events.filter(e => e.approved).length}
              </div>
              <div className="text-sm text-muted-foreground">Đã duyệt</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {events.filter(e => !e.approved).length}
              </div>
              <div className="text-sm text-muted-foreground">Chờ duyệt</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {events.reduce((sum, e) => sum + e.tickets.length, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Tổng vé bán</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách sự kiện</CardTitle>
          <CardDescription>
            Tìm kiếm và quản lý sự kiện
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm theo tên sự kiện..."
                  className="pl-10"
                />
              </div>
            </div>
            <Button className="bg-red-600 hover:bg-red-700">
              <Plus className="h-4 w-4 mr-2" />
              Thêm sự kiện
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên sự kiện</TableHead>
                <TableHead>Tổ chức</TableHead>
                <TableHead>Loại</TableHead>
                <TableHead>Ngày</TableHead>
                <TableHead>Địa điểm</TableHead>
                <TableHead>Giá vé</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Vé bán</TableHead>
                <TableHead>Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.map((event) => (
                <TableRow key={event.id}>
                  <TableCell className="font-medium">{event.name}</TableCell>
                  <TableCell>
                    {event.organization?.name || "TON Platform"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getTypeBadgeVariant(event.type)}>
                      {event.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(event.date).toLocaleDateString("vi-VN")}
                  </TableCell>
                  <TableCell>{event.location}</TableCell>
                  <TableCell>
                    ₫{event.ticketPrice.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(event.approved)}>
                      {event.approved ? (
                        <>
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Đã duyệt
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3 mr-1" />
                          Chờ duyệt
                        </>
                      )}
                    </Badge>
                  </TableCell>
                  <TableCell>{event.tickets.length}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      {!event.approved && (
                        <Button variant="ghost" size="sm" className="text-green-600">
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      )}
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