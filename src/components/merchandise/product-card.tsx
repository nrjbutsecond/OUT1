"use client"

import { Product, Organization } from "@prisma/client"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"
import Link from "next/link"
import { ShoppingCart } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { useApp } from "@/contexts/app-context"

type ProductWithOrg = Product & { organization: Organization | null }

export function ProductCard({ product }: { product: ProductWithOrg }) {
  const [loading, setLoading] = useState(false)
  const { addNotification, updateCartCount } = useApp()

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    setLoading(true)
    
    try {
      // Get existing cart from localStorage
      const existingCart = localStorage.getItem("cart")
      const cartItems = existingCart ? JSON.parse(existingCart) : []
      
      // Check if product already exists in cart
      const existingItemIndex = cartItems.findIndex((item: any) => item.productId === product.id)
      
      if (existingItemIndex >= 0) {
        // Update quantity if item exists
        cartItems[existingItemIndex].quantity += 1
      } else {
        // Add new item to cart
        const newCartItem = {
          id: `cart-${product.id}-${Date.now()}`,
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          organization: product.organization?.name || "TON Platform"
        }
        cartItems.push(newCartItem)
      }
      
      // Save updated cart to localStorage
      localStorage.setItem("cart", JSON.stringify(cartItems))
      
      // Update cart count
      updateCartCount()
      
      // Add notification
      addNotification({
        title: "Product Added to Cart",
        content: `${product.name} has been added to your cart successfully.`,
        type: "ORDER"
      })
      
      toast.success(`${product.name} added to cart!`)
    } catch (error) {
      console.error("Error adding to cart:", error)
      toast.error("Failed to add product to cart")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="group overflow-hidden bg-gray-800/90 backdrop-blur-sm border border-gray-700/50 shadow-xl hover:shadow-2xl hover:shadow-red-500/10 transition-all duration-300 hover:-translate-y-1 hover:border-red-500/30">
      <Link href={`/merchandise/${product.id}`}>
        <div className="aspect-square bg-gray-700 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center">
            <ShoppingCart className="h-16 w-16 text-gray-500/30" />
          </div>
          {!product.organizationId && (
            <Badge className="absolute top-2 left-2 bg-red-600 text-white">TON</Badge>
          )}
          {product.stock < 10 && (
            <Badge variant="destructive" className="absolute top-2 right-2">
              Only {product.stock} left
            </Badge>
          )}
        </div>
      </Link>
      <CardContent className="p-4">
        <Link href={`/merchandise/${product.id}`}>
          <h3 className="font-semibold line-clamp-2 group-hover:text-red-400 transition-colors mb-2 text-white">
            {product.name}
          </h3>
        </Link>
        {product.organization && (
          <p className="text-xs text-gray-400 mb-2">{product.organization.name}</p>
        )}
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold text-red-500">
            {formatCurrency(product.price)}
          </span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button 
          size="sm" 
          className="w-full bg-red-600 hover:bg-red-700 text-white" 
          onClick={handleAddToCart}
          disabled={loading}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {loading ? "Adding..." : "Add to Cart"}
        </Button>
      </CardFooter>
    </Card>
  )
}

