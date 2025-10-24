"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export function ServicePurchaseButton({ serviceId }: { serviceId: string }) {
  const { status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handlePurchase = async () => {
    if (status === "unauthenticated") {
      router.push("/login")
      return
    }

    setLoading(true)
    // Redirect directly to checkout page
    router.push(`/services/${serviceId}/checkout`)
  }

  return (
    <Button
      onClick={handlePurchase}
      disabled={loading}
      size="sm"
      className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
    >
      {loading ? "Processing..." : "Buy Service"}
    </Button>
  )
}

