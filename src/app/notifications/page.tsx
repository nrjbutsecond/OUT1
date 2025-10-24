"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, Check, X, Calendar, ShoppingCart, Ticket, Mail } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface Notification {
  id: string
  title: string
  content: string
  type: 'info' | 'success' | 'warning' | 'error'
  category: 'general' | 'order' | 'event' | 'service'
  read: boolean
  createdAt: string
  actionUrl?: string
}

export default function NotificationsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
      return
    }

    // Load notifications
    const loadNotifications = async () => {
      try {
        // Mock notifications data
        const mockNotifications: Notification[] = [
          {
            id: "1",
            title: "Chào mừng đến với TON Platform!",
            content: "Cảm ơn bạn đã tham gia cộng đồng TEDx Organizer Network. Hãy khám phá các dịch vụ và sự kiện của chúng tôi.",
            type: "success",
            category: "general",
            read: false,
            createdAt: new Date().toISOString()
          },
          {
            id: "2",
            title: "Đơn hàng #12345 đã được xác nhận",
            content: "Đơn hàng của bạn đã được xác nhận và đang được chuẩn bị giao hàng.",
            type: "info",
            category: "order",
            read: false,
            createdAt: new Date(Date.now() - 3600000).toISOString(),
            actionUrl: "/orders/12345"
          },
          {
            id: "3",
            title: "Vé TEDxHanoi 2025 đã sẵn sàng",
            content: "Vé của bạn cho sự kiện TEDxHanoi 2025 đã được gửi qua email. Vui lòng kiểm tra hộp thư.",
            type: "success",
            category: "event",
            read: true,
            createdAt: new Date(Date.now() - 7200000).toISOString(),
            actionUrl: "/events/event-123"
          },
          {
            id: "4",
            title: "Nhắc nhở: Workshop sắp diễn ra",
            content: "Workshop 'Event Management' sẽ diễn ra vào ngày mai. Đừng quên tham gia!",
            type: "warning",
            category: "service",
            read: false,
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            actionUrl: "/services/workshop-123"
          },
          {
            id: "5",
            title: "Cập nhật hệ thống",
            content: "Hệ thống sẽ được bảo trì từ 2:00-4:00 ngày mai. Vui lòng lưu công việc trước đó.",
            type: "info",
            category: "general",
            read: true,
            createdAt: new Date(Date.now() - 172800000).toISOString()
          }
        ]

        setNotifications(mockNotifications)
      } catch (error) {
        toast.error("Lỗi khi tải thông báo")
      } finally {
        setLoading(false)
      }
    }

    loadNotifications()
  }, [status, router])

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    )
    toast.success("Đã đánh dấu tất cả là đã đọc")
  }

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id))
    toast.success("Đã xóa thông báo")
  }

  const getNotificationIcon = (category: string) => {
    switch (category) {
      case 'order':
        return <ShoppingCart className="h-5 w-5" />
      case 'event':
        return <Ticket className="h-5 w-5" />
      case 'service':
        return <Calendar className="h-5 w-5" />
      default:
        return <Mail className="h-5 w-5" />
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'text-green-600'
      case 'warning':
        return 'text-yellow-600'
      case 'error':
        return 'text-red-600'
      default:
        return 'text-blue-600'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) {
      return 'Vừa xong'
    } else if (diffInHours < 24) {
      return `${diffInHours} giờ trước`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      return `${diffInDays} ngày trước`
    }
  }

  const unreadCount = notifications.filter(n => !n.read).length
  const generalNotifications = notifications.filter(n => n.category === 'general')
  const orderNotifications = notifications.filter(n => n.category === 'order')
  const eventNotifications = notifications.filter(n => n.category === 'event')
  const serviceNotifications = notifications.filter(n => n.category === 'service')

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (status === "unauthenticated") {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="tedx-gradient text-white py-16">
          <div className="container">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">Thông báo</h1>
                <p className="text-xl text-red-50 max-w-2xl">
                  Cập nhật mới nhất từ TON Platform
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Badge variant="secondary" className="text-lg px-4 py-2">
                  {unreadCount} chưa đọc
                </Badge>
                {unreadCount > 0 && (
                  <Button variant="outline" onClick={markAllAsRead}>
                    <Check className="h-4 w-4 mr-2" />
                    Đánh dấu tất cả
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="container py-12">
          <Tabs defaultValue="all" className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-5">
              <TabsTrigger value="all">Tất cả ({notifications.length})</TabsTrigger>
              <TabsTrigger value="general">Chung ({generalNotifications.length})</TabsTrigger>
              <TabsTrigger value="order">Đơn hàng ({orderNotifications.length})</TabsTrigger>
              <TabsTrigger value="event">Sự kiện ({eventNotifications.length})</TabsTrigger>
              <TabsTrigger value="service">Dịch vụ ({serviceNotifications.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {notifications.length === 0 ? (
                <div className="text-center py-16">
                  <Bell className="h-24 w-24 text-muted-foreground mx-auto mb-4" />
                  <h2 className="text-2xl font-bold mb-2">Không có thông báo</h2>
                  <p className="text-muted-foreground">
                    Bạn chưa có thông báo nào
                  </p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <Card key={notification.id} className={`${!notification.read ? 'border-primary bg-primary/5' : ''}`}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className={`${getNotificationColor(notification.type)} mt-1`}>
                          {getNotificationIcon(notification.category)}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className={`font-semibold ${!notification.read ? 'text-primary' : ''}`}>
                                {notification.title}
                              </h3>
                              <p className="text-muted-foreground mt-1">
                                {notification.content}
                              </p>
                              <p className="text-sm text-muted-foreground mt-2">
                                {formatDate(notification.createdAt)}
                              </p>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              {!notification.read && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => markAsRead(notification.id)}
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteNotification(notification.id)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          
                          {notification.actionUrl && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="mt-3"
                              onClick={() => router.push(notification.actionUrl!)}
                            >
                              Xem chi tiết
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="general" className="space-y-4">
              {generalNotifications.map((notification) => (
                <Card key={notification.id} className={`${!notification.read ? 'border-primary bg-primary/5' : ''}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`${getNotificationColor(notification.type)} mt-1`}>
                        {getNotificationIcon(notification.category)}
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-semibold ${!notification.read ? 'text-primary' : ''}`}>
                          {notification.title}
                        </h3>
                        <p className="text-muted-foreground mt-1">
                          {notification.content}
                        </p>
                        <p className="text-sm text-muted-foreground mt-2">
                          {formatDate(notification.createdAt)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="order" className="space-y-4">
              {orderNotifications.map((notification) => (
                <Card key={notification.id} className={`${!notification.read ? 'border-primary bg-primary/5' : ''}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`${getNotificationColor(notification.type)} mt-1`}>
                        {getNotificationIcon(notification.category)}
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-semibold ${!notification.read ? 'text-primary' : ''}`}>
                          {notification.title}
                        </h3>
                        <p className="text-muted-foreground mt-1">
                          {notification.content}
                        </p>
                        <p className="text-sm text-muted-foreground mt-2">
                          {formatDate(notification.createdAt)}
                        </p>
                        {notification.actionUrl && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-3"
                            onClick={() => router.push(notification.actionUrl!)}
                          >
                            Xem đơn hàng
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="event" className="space-y-4">
              {eventNotifications.map((notification) => (
                <Card key={notification.id} className={`${!notification.read ? 'border-primary bg-primary/5' : ''}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`${getNotificationColor(notification.type)} mt-1`}>
                        {getNotificationIcon(notification.category)}
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-semibold ${!notification.read ? 'text-primary' : ''}`}>
                          {notification.title}
                        </h3>
                        <p className="text-muted-foreground mt-1">
                          {notification.content}
                        </p>
                        <p className="text-sm text-muted-foreground mt-2">
                          {formatDate(notification.createdAt)}
                        </p>
                        {notification.actionUrl && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-3"
                            onClick={() => router.push(notification.actionUrl!)}
                          >
                            Xem sự kiện
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="service" className="space-y-4">
              {serviceNotifications.map((notification) => (
                <Card key={notification.id} className={`${!notification.read ? 'border-primary bg-primary/5' : ''}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`${getNotificationColor(notification.type)} mt-1`}>
                        {getNotificationIcon(notification.category)}
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-semibold ${!notification.read ? 'text-primary' : ''}`}>
                          {notification.title}
                        </h3>
                        <p className="text-muted-foreground mt-1">
                          {notification.content}
                        </p>
                        <p className="text-sm text-muted-foreground mt-2">
                          {formatDate(notification.createdAt)}
                        </p>
                        {notification.actionUrl && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-3"
                            onClick={() => router.push(notification.actionUrl!)}
                          >
                            Xem dịch vụ
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  )
}



