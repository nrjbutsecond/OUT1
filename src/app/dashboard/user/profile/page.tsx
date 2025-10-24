import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { User, Mail, Phone, MapPin, Calendar, Building2 } from "lucide-react"

export default async function UserProfilePage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  // Get user details
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      organizationMembers: {
        include: {
          organization: true
        }
      }
    }
  })

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Hồ sơ cá nhân</h1>
        <p className="text-muted-foreground">
          Quản lý thông tin cá nhân và cài đặt tài khoản
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Thông tin cá nhân
              </CardTitle>
              <CardDescription>
                Cập nhật thông tin cơ bản của bạn
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Họ và tên</Label>
                  <Input
                    id="name"
                    defaultValue={user.name || ""}
                    placeholder="Nhập họ và tên"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue={user.email || ""}
                    placeholder="Nhập email"
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Số điện thoại</Label>
                  <Input
                    id="phone"
                    defaultValue={user.phone || ""}
                    placeholder="Nhập số điện thoại"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="organization">Tổ chức</Label>
                  <Input
                    id="organization"
                    defaultValue={user.organization || ""}
                    placeholder="Nhập tên tổ chức"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Giới thiệu bản thân</Label>
                <Textarea
                  id="bio"
                  defaultValue={user.bio || ""}
                  placeholder="Viết một vài dòng về bản thân..."
                  rows={4}
                />
              </div>
              <Button className="w-full">
                Cập nhật thông tin
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Địa chỉ
              </CardTitle>
              <CardDescription>
                Thông tin địa chỉ liên lạc
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">Địa chỉ</Label>
                <Textarea
                  id="address"
                  defaultValue={user.address || ""}
                  placeholder="Nhập địa chỉ đầy đủ"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">Thành phố</Label>
                  <Input
                    id="city"
                    defaultValue={user.city || ""}
                    placeholder="Nhập thành phố"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Quốc gia</Label>
                  <Input
                    id="country"
                    defaultValue={user.country || ""}
                    placeholder="Nhập quốc gia"
                  />
                </div>
              </div>
              <Button className="w-full">
                Cập nhật địa chỉ
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Account Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Trạng thái tài khoản
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Vai trò</span>
                <Badge variant="secondary">
                  {user.role === "USER" && "Người dùng"}
                  {user.role === "ADMIN" && "Quản trị viên"}
                  {user.role === "PARTNER" && "Đối tác"}
                  {user.role === "MENTOR" && "Mentor"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Email xác thực</span>
                <Badge variant={user.emailVerified ? "default" : "destructive"}>
                  {user.emailVerified ? "Đã xác thực" : "Chưa xác thực"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Ngày tạo</span>
                <span className="text-sm text-muted-foreground">
                  {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Organization Membership */}
          {user.organizationMembers.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Thành viên tổ chức
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {user.organizationMembers.map((member) => (
                  <div key={member.id} className="border rounded-lg p-3">
                    <div className="font-medium">{member.organization.name}</div>
                    <div className="text-sm text-muted-foreground">
                      Vai trò: {member.role}
                    </div>
                    <Badge 
                      variant={member.approved ? "default" : "secondary"}
                      className="mt-2"
                    >
                      {member.approved ? "Đã duyệt" : "Chờ duyệt"}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Thống kê
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Đơn hàng</span>
                <span className="text-sm text-muted-foreground">0</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Vé sự kiện</span>
                <span className="text-sm text-muted-foreground">0</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Khóa học</span>
                <span className="text-sm text-muted-foreground">0</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
