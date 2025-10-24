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
import { Building2, Search, CheckCircle, XCircle, Eye, Edit, Crown, Star } from "lucide-react"

export default async function AdminOrganizationsPage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "ADMIN") {
    redirect("/login")
  }

  const organizations = await prisma.organization.findMany({
    include: {
      members: {
        include: {
          user: true,
        },
      },
      events: true,
      products: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "default"
      case "PENDING":
        return "secondary"
      case "REJECTED":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getTierBadgeVariant = (tier: string) => {
    switch (tier) {
      case "VIP":
        return "default"
      case "STANDARD":
        return "secondary"
      default:
        return "outline"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quản lý tổ chức</h1>
          <p className="text-muted-foreground">
            Duyệt và quản lý các tổ chức trong hệ thống
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Building2 className="h-8 w-8 text-primary" />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tổng quan</CardTitle>
          <CardDescription>
            Thống kê tổ chức theo trạng thái và hạng
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-primary">{organizations.length}</div>
              <div className="text-sm text-muted-foreground">Tổng tổ chức</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {organizations.filter((o: { approved: boolean }) => o.approved).length}
              </div>
              <div className="text-sm text-muted-foreground">Đã duyệt</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {organizations.filter((o: { approved: boolean }) => !o.approved).length}
              </div>
              <div className="text-sm text-muted-foreground">Chờ duyệt</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {organizations.filter((o: { type: string }) => o.type === "VIP").length}
              </div>
              <div className="text-sm text-muted-foreground">VIP</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách tổ chức</CardTitle>
          <CardDescription>
            Tìm kiếm và lọc tổ chức
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm theo tên tổ chức..."
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
                <SelectItem value="APPROVED">Đã duyệt</SelectItem>
                <SelectItem value="PENDING">Chờ duyệt</SelectItem>
                <SelectItem value="REJECTED">Từ chối</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Lọc theo hạng" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả hạng</SelectItem>
                <SelectItem value="VIP">VIP</SelectItem>
                <SelectItem value="STANDARD">Standard</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên tổ chức</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Hạng</TableHead>
                <TableHead>Thành viên</TableHead>
                <TableHead>Sự kiện</TableHead>
                <TableHead>Sản phẩm</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead>Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {organizations.map((org: typeof organizations[number]) => (
                <TableRow key={org.id}>
                  <TableCell className="font-medium">{org.name}</TableCell>
                  <TableCell>{org.creator?.email || "N/A"}</TableCell>
                  <TableCell>
                    <Badge variant={org.approved ? "default" : "secondary"}>
                      {org.approved ? <CheckCircle className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
                      {org.approved ? "Đã duyệt" : "Chờ duyệt"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={org.type === "VIP" ? "default" : "secondary"}>
                      {org.type === "VIP" && <Crown className="w-3 h-3 mr-1" />}
                      {org.type === "STANDARD" && <Star className="w-3 h-3 mr-1" />}
                      {org.type}
                    </Badge>
                  </TableCell>
                  <TableCell>{org.members.length}</TableCell>
                  <TableCell>{org.events.length}</TableCell>
                  <TableCell>{org.products.length}</TableCell>
                  <TableCell>
                    {new Date(org.createdAt).toLocaleDateString("vi-VN")}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      {!org.approved && (
                        <>
                          <Button variant="ghost" size="sm" className="text-green-600">
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600">
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </>
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



