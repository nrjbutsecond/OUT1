"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CreditCard, MapPin, User, Phone, Mail, ShoppingCart } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface CartItem {
  id: string
  productId: string
  name: string
  price: number
  quantity: number
  image?: string
  organization?: string
}

interface ShippingInfo {
  fullName: string
  phone: string
  email: string
  address: string
  city: string
  district: string
  ward: string
  note?: string
}

export default function CheckoutPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    fullName: session?.user?.name || "",
    phone: "",
    email: session?.user?.email || "",
    address: "",
    city: "",
    district: "",
    ward: "",
    note: ""
  })
  const [paymentMethod, setPaymentMethod] = useState("bank_transfer")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
      return
    }

    // Load cart from localStorage
    const savedCart = localStorage.getItem("checkout-cart")
    if (savedCart) {
      setCartItems(JSON.parse(savedCart))
    } else {
      // Fallback to regular cart
      const regularCart = localStorage.getItem("cart")
      if (regularCart) {
        setCartItems(JSON.parse(regularCart))
      } else {
        router.push("/cart")
        return
      }
    }
  }, [status, router, session])

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  }

  const calculateShipping = () => {
    return cartItems.length > 0 ? 30000 : 0
  }

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping()
  }

  const handleInputChange = (field: keyof ShippingInfo, value: string) => {
    setShippingInfo(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const validateForm = () => {
    const required = ['fullName', 'phone', 'email', 'address', 'city', 'district', 'ward']
    for (const field of required) {
      if (!shippingInfo[field as keyof ShippingInfo]) {
        toast.error(`Vui lòng điền ${field}`)
        return false
      }
    }
    return true
  }

  const handlePlaceOrder = async () => {
    if (!validateForm()) return

    setLoading(true)

    try {
      // Mock order creation
      const orderData = {
        userId: session?.user?.id,
        items: cartItems,
        shippingInfo,
        paymentMethod,
        total: calculateTotal(),
        subtotal: calculateSubtotal(),
        shipping: calculateShipping()
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Clear cart
      localStorage.removeItem("cart")
      localStorage.removeItem("checkout-cart")

      toast.success("Đặt hàng thành công!")
      router.push(`/orders/${Date.now()}`) // Mock order ID
    } catch (error) {
      toast.error("Đặt hàng thất bại. Vui lòng thử lại.")
    } finally {
      setLoading(false)
    }
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (status === "unauthenticated" || cartItems.length === 0) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="tedx-gradient text-white py-16">
          <div className="container">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Thanh toán</h1>
            <p className="text-xl text-red-50 max-w-2xl">
              Hoàn tất thông tin để đặt hàng
            </p>
          </div>
        </div>

        <div className="container py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Shipping Information */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Thông tin giao hàng
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Họ và tên *</Label>
                      <Input
                        id="fullName"
                        value={shippingInfo.fullName}
                        onChange={(e) => handleInputChange("fullName", e.target.value)}
                        placeholder="Nguyễn Văn A"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Số điện thoại *</Label>
                      <Input
                        id="phone"
                        value={shippingInfo.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        placeholder="0123456789"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={shippingInfo.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="email@example.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Địa chỉ chi tiết *</Label>
                    <Textarea
                      id="address"
                      value={shippingInfo.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      placeholder="Số nhà, tên đường..."
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">Tỉnh/Thành phố *</Label>
                      <Input
                        id="city"
                        value={shippingInfo.city}
                        onChange={(e) => handleInputChange("city", e.target.value)}
                        placeholder="Hà Nội"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="district">Quận/Huyện *</Label>
                      <Input
                        id="district"
                        value={shippingInfo.district}
                        onChange={(e) => handleInputChange("district", e.target.value)}
                        placeholder="Cầu Giấy"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ward">Phường/Xã *</Label>
                      <Input
                        id="ward"
                        value={shippingInfo.ward}
                        onChange={(e) => handleInputChange("ward", e.target.value)}
                        placeholder="Dịch Vọng"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="note">Ghi chú</Label>
                    <Textarea
                      id="note"
                      value={shippingInfo.note}
                      onChange={(e) => handleInputChange("note", e.target.value)}
                      placeholder="Ghi chú thêm cho đơn hàng..."
                      rows={2}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Phương thức thanh toán
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="bank_transfer" id="bank_transfer" />
                      <Label htmlFor="bank_transfer">Chuyển khoản ngân hàng</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="cod" id="cod" />
                      <Label htmlFor="cod">Thanh toán khi nhận hàng (COD)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="vnpay" id="vnpay" />
                      <Label htmlFor="vnpay">VNPay (Sẽ tích hợp sau)</Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5" />
                    Tóm tắt đơn hàng
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Order Items */}
                  <div className="space-y-3">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.quantity} × {item.price.toLocaleString('vi-VN')}đ
                          </p>
                        </div>
                        <p className="font-medium">
                          {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                        </p>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Tạm tính:</span>
                      <span>{calculateSubtotal().toLocaleString('vi-VN')}đ</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>Phí vận chuyển:</span>
                      <span>{calculateShipping().toLocaleString('vi-VN')}đ</span>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-between text-lg font-bold">
                      <span>Tổng cộng:</span>
                      <span className="text-primary">
                        {calculateTotal().toLocaleString('vi-VN')}đ
                      </span>
                    </div>
                  </div>

                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={handlePlaceOrder}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Đang xử lý...
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-5 w-5 mr-2" />
                        Đặt hàng
                      </>
                    )}
                  </Button>

                  <Button variant="outline" className="w-full" onClick={() => router.back()}>
                    Quay lại giỏ hàng
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



