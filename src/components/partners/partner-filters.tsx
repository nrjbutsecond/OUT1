"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

export function PartnerFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(searchParams.get("search") || "")

  const handleFilter = () => {
    const params = new URLSearchParams()
    if (search) params.set("search", search)
    router.push(`/partners?${params.toString()}`)
  }

  return (
    <div className="p-6 bg-muted/50 rounded-lg">
      <div className="flex gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm tổ chức..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleFilter()}
              className="pl-10"
            />
          </div>
        </div>
        <Button onClick={handleFilter}>Tìm kiếm</Button>
      </div>
    </div>
  )
}


