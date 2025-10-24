import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Clock, Users, Ticket, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface EventPageProps {
  params: Promise<{ id: string }>
}

export default async function EventPage({ params }: EventPageProps) {
  const { id } = await params
  
  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      organization: true
    }
  })

  if (!event) {
    notFound()
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  const isUpcoming = new Date(event.date) > new Date()
  const isSoldOut = false // Mock - would check ticket availability

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="tedx-gradient text-white py-16">
          <div className="container">
            <div className="flex items-center gap-4 mb-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/events">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Quay lại
                </Link>
              </Button>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{event.name}</h1>
            <p className="text-xl text-red-50 max-w-2xl">
              {event.description}
            </p>
          </div>
        </div>

        <div className="container py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Event Details */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Thông tin sự kiện</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <p className="font-medium">Thời gian</p>
                      <p className="text-muted-foreground">{formatDate(event.date)}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <p className="font-medium">Địa điểm</p>
                      <p className="text-muted-foreground">{event.location}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Ticket className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <p className="font-medium">Giá vé</p>
                      <p className="text-muted-foreground">
                        {event.ticketPrice.toLocaleString('vi-VN')}đ
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <p className="font-medium">Tổ chức</p>
                      <p className="text-muted-foreground">
                        {event.organization?.name || 'TON Platform'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Mô tả chi tiết</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {event.description}
                  </p>
                  
                  {event.type === 'TEDX' && (
                    <div className="mt-6 p-4 bg-muted rounded-lg">
                      <h3 className="font-semibold mb-2">Về TEDx</h3>
                      <p className="text-sm text-muted-foreground">
                        TEDx là chương trình cộng đồng tự tổ chức theo phong cách TED, 
                        nơi các bài nói và trình diễn được ghi lại và chia sẻ với thế giới. 
                        Sự kiện này được tổ chức độc lập theo giấy phép TEDx.
                      </p>
                    </div>
                  )}

                  {event.type === 'WORKSHOP' && (
                    <div className="mt-6 p-4 bg-muted rounded-lg">
                      <h3 className="font-semibold mb-2">Về Workshop</h3>
                      <p className="text-sm text-muted-foreground">
                        Workshop này được thiết kế để cung cấp kiến thức thực tế và 
                        kỹ năng cần thiết cho việc tổ chức sự kiện TEDx chuyên nghiệp.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Map Placeholder */}
              {event.latitude && event.longitude && (
                <Card>
                  <CardHeader>
                    <CardTitle>Vị trí</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                        <p className="text-muted-foreground">Bản đồ sẽ được tích hợp sau</p>
                        <p className="text-sm text-muted-foreground">
                          Tọa độ: {event.latitude}, {event.longitude}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Ticket Purchase */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle>Mua vé</CardTitle>
                  <CardDescription>
                    Đặt vé cho sự kiện này
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">
                      {event.ticketPrice.toLocaleString('vi-VN')}đ
                    </div>
                    <p className="text-sm text-muted-foreground">Giá vé</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Loại sự kiện:</span>
                      <Badge variant={event.type === 'TEDX' ? 'default' : 'secondary'}>
                        {event.type === 'TEDX' ? 'TEDx Event' : 'Workshop'}
                      </Badge>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>Trạng thái:</span>
                      <Badge variant={isUpcoming ? 'default' : 'destructive'}>
                        {isUpcoming ? 'Sắp diễn ra' : 'Đã kết thúc'}
                      </Badge>
                    </div>
                  </div>

                  {isUpcoming ? (
                    <Button 
                      className="w-full" 
                      size="lg"
                      disabled={isSoldOut}
                      asChild
                    >
                      <Link href={`/events/${event.id}/purchase`}>
                        <Ticket className="h-5 w-5 mr-2" />
                        {isSoldOut ? 'Hết vé' : 'Mua vé ngay'}
                      </Link>
                    </Button>
                  ) : (
                    <Button 
                      className="w-full" 
                      size="lg"
                      disabled
                    >
                      <Clock className="h-5 w-5 mr-2" />
                      Sự kiện đã kết thúc
                    </Button>
                  )}

                  <div className="text-xs text-muted-foreground text-center">
                    <p>• Vé sẽ được gửi qua email sau khi thanh toán</p>
                    <p>• QR code để vào sự kiện</p>
                    <p>• Không hoàn tiền sau khi mua</p>
                  </div>
                </CardContent>
              </Card>

              {/* Related Events */}
              <Card>
                <CardHeader>
                  <CardTitle>Sự kiện khác</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 border rounded-lg">
                      <h4 className="font-medium">TEDxHanoi 2025</h4>
                      <p className="text-sm text-muted-foreground">15/12/2025</p>
                      <p className="text-sm text-primary">500,000đ</p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <h4 className="font-medium">TON Workshop: Event Management</h4>
                      <p className="text-sm text-muted-foreground">15/09/2025</p>
                      <p className="text-sm text-primary">200,000đ</p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full mt-4" asChild>
                    <Link href="/events">
                      Xem tất cả sự kiện
                    </Link>
                  </Button>
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



