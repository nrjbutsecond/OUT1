import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingBag, Package, Calendar, CreditCard, Download } from "lucide-react"

export default async function UserOrdersPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  // Get user's orders
  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: {
      items: {
        include: {
          product: true
        }
      },
      discountCode: true
    },
    orderBy: { createdAt: "desc" }
  })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Đơn hàng của tôi</h1>
        <p className="text-muted-foreground">
          Xem lịch sử đơn hàng và theo dõi trạng thái
        </p>
      </div>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Chưa có đơn hàng nào</h3>
            <p className="text-muted-foreground text-center mb-6">
              Bạn chưa có đơn hàng nào. Hãy khám phá các dịch vụ và sự kiện thú vị!
            </p>
            <div className="flex gap-4">
              <Button asChild>
                <a href="/services">
                  <Package className="h-4 w-4 mr-2" />
                  Xem dịch vụ
                </a>
              </Button>
              <Button asChild variant="outline">
                <a href="/events">
                  <Calendar className="h-4 w-4 mr-2" />
                  Xem sự kiện
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <ShoppingBag className="h-5 w-5" />
                      Đơn hàng #{order.id.slice(-8).toUpperCase()}
                    </CardTitle>
                    <CardDescription>
                      Đặt ngày {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <Badge 
                      variant={
                        order.status === "COMPLETED" ? "default" :
                        order.status === "PENDING" ? "secondary" :
                        order.status === "CANCELLED" ? "destructive" : "outline"
                      }
                    >
                      {order.status === "COMPLETED" && "Hoàn thành"}
                      {order.status === "PENDING" && "Đang xử lý"}
                      {order.status === "CANCELLED" && "Đã hủy"}
                      {order.status === "REFUNDED" && "Đã hoàn tiền"}
                    </Badge>
                    <div className="text-lg font-semibold mt-2">
                      {order.totalAmount?.toLocaleString('vi-VN')} VNĐ
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Order Items */}
                  <div>
                    <h4 className="font-medium mb-3">Sản phẩm/Dịch vụ:</h4>
                    <div className="space-y-2">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex justify-between items-center p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <Package className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <div className="font-medium">{item.product?.name || "Sản phẩm"}</div>
                              <div className="text-sm text-muted-foreground">
                                Số lượng: {item.quantity}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">
                              {item.price?.toLocaleString('vi-VN')} VNĐ
                            </div>
                            {item.quantity && item.quantity > 1 && (
                              <div className="text-sm text-muted-foreground">
                                x{item.quantity}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="border-t pt-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Tạm tính:</span>
                        <span>{order.totalAmount?.toLocaleString('vi-VN')} VNĐ</span>
                      </div>
                      {order.discountCode && (
                        <div className="flex justify-between text-green-600">
                          <span>Giảm giá ({order.discountCode.code}):</span>
                          <span>-{order.discountAmount?.toLocaleString('vi-VN')} VNĐ</span>
                        </div>
                      )}
                      <div className="flex justify-between font-semibold text-lg border-t pt-2">
                        <span>Tổng cộng:</span>
                        <span>{order.totalAmount?.toLocaleString('vi-VN')} VNĐ</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-4">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Tải hóa đơn
                    </Button>
                    {order.status === "COMPLETED" && (
                      <Button variant="outline" size="sm">
                        Đánh giá
                      </Button>
                    )}
                    {order.status === "PENDING" && (
                      <Button variant="destructive" size="sm">
                        Hủy đơn
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
