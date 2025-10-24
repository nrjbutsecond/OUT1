"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useParams, useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ShoppingCart, Plus, Minus, Heart, Share2, ArrowLeft, Package, Star } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  stock: number
  images: string[]
  organization?: {
    name: string
  }
}

export default function ProductPage() {
  const { data: session, status } = useSession()
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [loading, setLoading] = useState(false)
  const [productLoading, setProductLoading] = useState(true)

  useEffect(() => {
    // Load product data
    const loadProduct = async () => {
      try {
        const response = await fetch(`/api/products/${params.id}`)
        if (response.ok) {
          const productData = await response.json()
          setProduct(productData)
        } else {
          toast.error("Không tìm thấy sản phẩm")
          router.push("/merchandise")
        }
      } catch (error) {
        toast.error("Lỗi khi tải thông tin sản phẩm")
        router.push("/merchandise")
      } finally {
        setProductLoading(false)
      }
    }

    loadProduct()
  }, [params.id, router])

  const addToCart = () => {
    if (!product) return

    if (status === "unauthenticated") {
      router.push("/login")
      return
    }

    // Get existing cart
    const existingCart = localStorage.getItem("cart")
    const cart = existingCart ? JSON.parse(existingCart) : []

    // Check if product already exists in cart
    const existingItem = cart.find((item: { productId: string; quantity: number }) => item.productId === product.id)
    
    if (existingItem) {
      // Update quantity
      existingItem.quantity += quantity
    } else {
      // Add new item
      cart.push({
        id: Date.now().toString(),
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: quantity,
        image: product.images[0],
        organization: product.organization?.name
      })
    }

    // Save to localStorage
    localStorage.setItem("cart", JSON.stringify(cart))
    
    toast.success(`Đã thêm ${quantity} sản phẩm vào giỏ hàng`)
    setQuantity(1)
  }

  const buyNow = () => {
    addToCart()
    router.push("/cart")
  }

  if (productLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!product) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="tedx-gradient text-white py-16">
          <div className="container">
            <div className="flex items-center gap-4 mb-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/merchandise">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Quay lại
                </Link>
              </Button>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{product.name}</h1>
            <p className="text-xl text-red-50 max-w-2xl">
              {product.description}
            </p>
          </div>
        </div>

        <div className="container py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-red-100 to-orange-100 flex items-center justify-center">
                  <Package className="h-24 w-24 text-muted-foreground" />
                </div>
              </div>
              
              {/* Image Thumbnails */}
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <div
                    key={index}
                    className={`aspect-square bg-muted rounded-lg cursor-pointer border-2 ${
                      selectedImage === index ? 'border-primary' : 'border-transparent'
                    }`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <div className="w-full h-full bg-gradient-to-br from-red-100 to-orange-100 flex items-center justify-center">
                      <Package className="h-8 w-8 text-muted-foreground" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-3xl font-bold">{product.name}</h2>
                  {product.organization && (
                    <Badge variant="secondary">{product.organization.name}</Badge>
                  )}
                </div>
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-3xl font-bold text-primary">
                    {product.price.toLocaleString('vi-VN')}đ
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="text-sm text-muted-foreground ml-1">(4.8)</span>
                  </div>
                </div>

                <p className="text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              </div>

              <Separator />

              {/* Product Details */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Danh mục:</span>
                  <span className="capitalize">{product.category}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tình trạng:</span>
                  <span className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
                    {product.stock > 0 ? `Còn ${product.stock} sản phẩm` : 'Hết hàng'}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tổ chức:</span>
                  <span>{product.organization?.name || 'TON Platform'}</span>
                </div>
              </div>

              <Separator />

              {/* Quantity & Actions */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="font-medium">Số lượng:</span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={addToCart}
                    disabled={product.stock === 0}
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Thêm vào giỏ
                  </Button>
                  
                  <Button
                    className="w-full"
                    onClick={buyNow}
                    disabled={product.stock === 0}
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Mua ngay
                  </Button>
                </div>

                <div className="flex gap-2">
                  <Button variant="ghost" className="flex-1">
                    <Heart className="h-4 w-4 mr-2" />
                    Yêu thích
                  </Button>
                  <Button variant="ghost" className="flex-1">
                    <Share2 className="h-4 w-4 mr-2" />
                    Chia sẻ
                  </Button>
                </div>
              </div>

              {/* Shipping Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Thông tin giao hàng</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Phí vận chuyển:</span>
                    <span className="text-green-600">30,000đ</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Thời gian giao hàng:</span>
                    <span>3-5 ngày làm việc</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Hỗ trợ đổi trả:</span>
                    <span>7 ngày</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Related Products */}
          <div className="mt-16">
            <h3 className="text-2xl font-bold mb-6">Sản phẩm liên quan</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="group overflow-hidden hover:shadow-lg transition-all">
                  <Link href={`/merchandise/product-${i}`}>
                    <div className="aspect-square bg-muted relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-red-100 to-orange-100 flex items-center justify-center">
                        <Package className="h-16 w-16 text-muted-foreground/20" />
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h4 className="font-medium group-hover:text-primary transition-colors">
                        Sản phẩm liên quan {i}
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {(100000 + i * 50000).toLocaleString('vi-VN')}đ
                      </p>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}



