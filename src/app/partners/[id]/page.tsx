import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Building2, MapPin, Mail, Phone, Calendar, Users, Package, Crown, Star } from "lucide-react"
import Image from "next/image"

export default async function PartnerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  const organization = await prisma.organization.findUnique({
    where: { id },
    include: {
      creator: true,
      members: true,
      events: true,
      products: true,
    },
  })

  if (!organization) {
    notFound()
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

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case "VIP":
        return <Crown className="h-4 w-4" />
      case "STANDARD":
        return <Star className="h-4 w-4" />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-12">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="tedx-gradient text-white py-16 rounded-lg mb-8">
            <div className="container">
              <div className="flex items-center gap-4 mb-4">
                <Badge variant={getTierBadgeVariant(organization.tier)} className="bg-white/20 text-white border-white/30">
                  {getTierIcon(organization.tier)}
                  <span className="ml-1">{organization.tier}</span>
                </Badge>
                <Badge variant="outline" className="bg-white/20 text-white border-white/30">
                  {organization.status}
                </Badge>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{organization.name}</h1>
              <p className="text-xl text-red-50 max-w-3xl">{organization.description}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* About Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Building2 className="mr-2 h-5 w-5" />
                    Giới thiệu về tổ chức
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg leading-relaxed mb-6">{organization.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Địa chỉ:</span>
                      <span>{organization.address || "Chưa cập nhật"}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Email:</span>
                      <span>{organization.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Điện thoại:</span>
                      <span>{organization.phone || "Chưa cập nhật"}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Thành lập:</span>
                      <span>{new Date(organization.createdAt).toLocaleDateString("vi-VN")}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Events Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="mr-2 h-5 w-5" />
                    Sự kiện ({organization.events.length})
                  </CardTitle>
                  <CardDescription>
                    Các sự kiện được tổ chức bởi {organization.name}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {organization.events.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      Chưa có sự kiện nào được tổ chức
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {organization.events.slice(0, 3).map((event) => (
                        <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h4 className="font-semibold">{event.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {new Date(event.date).toLocaleDateString("vi-VN")} • {event.location}
                            </p>
                          </div>
                          <Badge variant="outline">{event.type}</Badge>
                        </div>
                      ))}
                      {organization.events.length > 3 && (
                        <p className="text-center text-sm text-muted-foreground">
                          Và {organization.events.length - 3} sự kiện khác...
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Products Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Package className="mr-2 h-5 w-5" />
                    Sản phẩm ({organization.products.length})
                  </CardTitle>
                  <CardDescription>
                    Merchandise được bán bởi {organization.name}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {organization.products.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      Chưa có sản phẩm nào được bán
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {organization.products.slice(0, 4).map((product) => (
                        <div key={product.id} className="border rounded-lg p-4">
                          <div className="aspect-square bg-muted rounded-md mb-3 flex items-center justify-center">
                            <Package className="h-12 w-12 text-muted-foreground/50" />
                          </div>
                          <h4 className="font-semibold mb-1">{product.name}</h4>
                          <p className="text-sm text-muted-foreground mb-2">{product.category}</p>
                          <p className="text-sm font-medium text-green-600">
                            {product.price.toLocaleString("vi-VN")} VND
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Thông tin liên hệ</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">{organization.email}</p>
                    </div>
                  </div>
                  {organization.phone && (
                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Điện thoại</p>
                        <p className="text-sm text-muted-foreground">{organization.phone}</p>
                      </div>
                    </div>
                  )}
                  {organization.address && (
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Địa chỉ</p>
                        <p className="text-sm text-muted-foreground">{organization.address}</p>
                      </div>
                    </div>
                  )}
                  <Separator />
                  <Button className="w-full">Liên hệ tổ chức</Button>
                </CardContent>
              </Card>

              {/* Stats Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Thống kê</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Thành viên</span>
                    </div>
                    <span className="font-semibold">{organization.members.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Sự kiện</span>
                    </div>
                    <span className="font-semibold">{organization.events.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Sản phẩm</span>
                    </div>
                    <span className="font-semibold">{organization.products.length}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Tier Benefits */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    {getTierIcon(organization.tier)}
                    <span className="ml-2">Lợi ích {organization.tier}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {organization.tier === "VIP" ? (
                    <ul className="space-y-2 text-sm">
                      <li>• Chiết khấu 1% từ doanh thu</li>
                      <li>• Hỗ trợ ưu tiên 24/7</li>
                      <li>• Quảng cáo miễn phí</li>
                      <li>• Truy cập tính năng cao cấp</li>
                    </ul>
                  ) : (
                    <ul className="space-y-2 text-sm">
                      <li>• Chiết khấu 3% từ doanh thu</li>
                      <li>• Hỗ trợ trong giờ hành chính</li>
                      <li>• Quảng cáo có phí</li>
                      <li>• Truy cập tính năng cơ bản</li>
                    </ul>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}



