"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ShoppingCart, Plus, Minus, Trash2, CreditCard } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
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

export default function CartPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Load cart from localStorage (no authentication required for cart)
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      setCartItems(JSON.parse(savedCart))
    }
  }, [])

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(productId)
      return
    }

    const updatedCart = cartItems.map(item =>
      item.productId === productId
        ? { ...item, quantity: newQuantity }
        : item
    )
    setCartItems(updatedCart)
    localStorage.setItem("cart", JSON.stringify(updatedCart))
  }

  const removeItem = (productId: string) => {
    const updatedCart = cartItems.filter(item => item.productId !== productId)
    setCartItems(updatedCart)
    localStorage.setItem("cart", JSON.stringify(updatedCart))
    toast.success("Đã xóa sản phẩm khỏi giỏ hàng")
  }

  const clearCart = () => {
    setCartItems([])
    localStorage.removeItem("cart")
    toast.success("Đã xóa toàn bộ giỏ hàng")
  }

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  }

  const calculateShipping = () => {
    return cartItems.length > 0 ? 30000 : 0 // 30k shipping
  }

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping()
  }

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error("Giỏ hàng trống")
      return
    }

    // Save cart to localStorage for checkout page
    localStorage.setItem("checkout-cart", JSON.stringify(cartItems))
    router.push("/checkout")
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Allow cart access without authentication

  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      <Header />

      <main className="flex-1">
        <div className="bg-gradient-to-r from-red-600 to-red-800 text-white py-16">
          <div className="container">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Shopping Cart</h1>
            <p className="text-xl text-red-100 max-w-2xl">
              Review and edit the products in your cart
            </p>
          </div>
        </div>

        <div className="container py-12">
          {cartItems.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingCart className="h-24 w-24 text-gray-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2 text-white">Your cart is empty</h2>
              <p className="text-gray-400 mb-6">
                You don&apos;t have any products in your cart yet
              </p>
              <Button asChild className="bg-red-600 hover:bg-red-700">
                <Link href="/merchandise">
                  Continue Shopping
                </Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-white">Products ({cartItems.length})</h2>
                  <Button variant="outline" onClick={clearCart} className="border-gray-600 text-gray-300 hover:bg-gray-700">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear All
                  </Button>
                </div>

                {cartItems.map((item) => (
                  <Card key={item.id} className="bg-gray-800/90 backdrop-blur-sm border border-gray-700/50 shadow-xl">
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        <div className="w-20 h-20 bg-gray-700 rounded-lg flex items-center justify-center">
                          <ShoppingCart className="h-8 w-8 text-gray-400" />
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="font-semibold text-white">{item.name}</h3>
                          {item.organization && (
                            <p className="text-sm text-gray-400">
                              {item.organization}
                            </p>
                          )}
                          <p className="text-lg font-bold text-red-500">
                            ₫{item.price.toLocaleString()}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            className="border-gray-600 text-gray-300 hover:bg-gray-700"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          
                          <span className="w-12 text-center font-medium text-white">
                            {item.quantity}
                          </span>
                          
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            className="border-gray-600 text-gray-300 hover:bg-gray-700"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="text-right">
                          <p className="font-bold text-lg text-white">
                            ₫{(item.price * item.quantity).toLocaleString()}
                          </p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.productId)}
                            className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <Card className="sticky top-8 bg-gray-800/90 backdrop-blur-sm border border-gray-700/50 shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-white">Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between text-gray-300">
                      <span>Subtotal:</span>
                      <span className="text-white">₫{calculateSubtotal().toLocaleString()}</span>
                    </div>
                    
                    <div className="flex justify-between text-gray-300">
                      <span>Shipping:</span>
                      <span className="text-white">₫{calculateShipping().toLocaleString()}</span>
                    </div>
                    
                    <Separator className="bg-gray-700" />
                    
                    <div className="flex justify-between text-lg font-bold">
                      <span className="text-white">Total:</span>
                      <span className="text-red-500">
                        ₫{calculateTotal().toLocaleString()}
                      </span>
                    </div>

                    <Button 
                      className="w-full bg-red-600 hover:bg-red-700 text-white" 
                      size="lg"
                      onClick={handleCheckout}
                    >
                      <CreditCard className="h-5 w-5 mr-2" />
                      Checkout
                    </Button>

                    <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-700" asChild>
                      <Link href="/merchandise">
                        Continue Shopping
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}



