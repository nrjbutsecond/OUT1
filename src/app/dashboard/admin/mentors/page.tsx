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
import { GraduationCap, Search, Plus, Edit, Trash2, Eye, Calendar, BookOpen } from "lucide-react"

export default async function AdminMentorsPage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "ADMIN") {
    redirect("/login")
  }

  const mentors = await prisma.user.findMany({
    where: {
      role: "MENTOR",
    },
    include: {
      organizationMembers: {
        include: {
          organization: true,
        },
      },
      mentorSessionsAsMentor: true,
      mentorSchedules: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quản lý Mentor</h1>
          <p className="text-muted-foreground">
            Quản lý các mentor và tài liệu đào tạo
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Thêm mentor
          </Button>
          <GraduationCap className="h-8 w-8 text-primary" />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tổng quan</CardTitle>
          <CardDescription>
            Thống kê mentor và hoạt động đào tạo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-primary">{mentors.length}</div>
              <div className="text-sm text-muted-foreground">Tổng mentor</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {mentors.filter(m => m.emailVerified).length}
              </div>
              <div className="text-sm text-muted-foreground">Đã xác thực</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {mentors.filter(m => m.organization).length}
              </div>
              <div className="text-sm text-muted-foreground">Có tổ chức</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600">0</div>
              <div className="text-sm text-muted-foreground">Lớp học đang mở</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách Mentor</CardTitle>
          <CardDescription>
            Tìm kiếm và quản lý mentor
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm theo tên mentor..."
                  className="pl-10"
                />
              </div>
            </div>
            <Select>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Lọc theo tổ chức" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả tổ chức</SelectItem>
                {mentors
                  .filter(m => m.organization)
                  .map(m => m.organization!)
                  .filter((org, index, self) => 
                    index === self.findIndex(o => o.id === org.id)
                  )
                  .map(org => (
                    <SelectItem key={org.id} value={org.id}>
                      {org.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên mentor</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Tổ chức</TableHead>
                <TableHead>Chuyên môn</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Lịch rảnh</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead>Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mentors.map((mentor) => (
                <TableRow key={mentor.id}>
                  <TableCell className="font-medium">{mentor.name}</TableCell>
                  <TableCell>{mentor.email}</TableCell>
                  <TableCell>
                    {mentor.organization?.name || "Không có"}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">TEDx Events</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={mentor.emailVerified ? "default" : "secondary"}>
                      {mentor.emailVerified ? "Hoạt động" : "Chờ xác thực"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Đã đăng ký</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(mentor.createdAt).toLocaleDateString("vi-VN")}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <BookOpen className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tài liệu đào tạo</CardTitle>
          <CardDescription>
            Quản lý tài liệu và khóa học
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              Chưa có tài liệu đào tạo nào được tạo
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Thêm tài liệu
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}



