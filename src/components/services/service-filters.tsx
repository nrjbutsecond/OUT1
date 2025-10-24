"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"

export function ServiceFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(searchParams.get("search") || "")
  const [category, setCategory] = useState(searchParams.get("category") || "all")

  // Auto apply filters when they change
  useEffect(() => {
    const params = new URLSearchParams()
    if (search) params.set("search", search)
    if (category !== "all") params.set("category", category)
    
    const newUrl = params.toString() ? `/services?${params.toString()}` : "/services"
    router.push(newUrl)
  }, [search, category, router])

  const handleReset = () => {
    setSearch("")
    setCategory("all")
    router.push("/services")
  }

  return (
    <div className="mb-8 p-6 light-theme bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search services..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-red-500 focus:ring-red-500/20"
            />
          </div>
        </div>

        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="bg-white border-gray-300 text-gray-900">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent className="z-[100] bg-white border border-gray-200 shadow-xl">
            <SelectItem value="all" className="text-gray-900 hover:bg-gray-100">All Categories</SelectItem>
            <SelectItem value="optional" className="text-gray-900 hover:bg-gray-100">Optional Add-ons</SelectItem>
            <SelectItem value="post_onsite" className="text-gray-900 hover:bg-gray-100">Post Onsite Support</SelectItem>
            <SelectItem value="onsite" className="text-gray-900 hover:bg-gray-100">Onsite Support</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}


