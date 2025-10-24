"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"

export function ProductFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(searchParams.get("search") || "")
  const [category, setCategory] = useState(searchParams.get("category") || "all")
  const [org, setOrg] = useState(searchParams.get("org") || "all")
  const [eventType, setEventType] = useState(searchParams.get("eventType") || "all")

  // Auto apply filters when they change
  useEffect(() => {
    const params = new URLSearchParams()
    if (search) params.set("search", search)
    if (category !== "all") params.set("category", category)
    if (org !== "all") params.set("org", org)
    if (eventType !== "all") params.set("eventType", eventType)
    
    const newUrl = params.toString() ? `/merchandise?${params.toString()}` : "/merchandise"
    router.push(newUrl)
  }, [search, category, org, eventType, router])

  const handleReset = () => {
    setSearch("")
    setCategory("all")
    setOrg("all")
    router.push("/merchandise")
  }

  return (
    <div className="mb-8 p-6 light-theme bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="md:col-span-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search products..."
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
            <SelectItem value="clothing" className="text-gray-900 hover:bg-gray-100">Clothing</SelectItem>
            <SelectItem value="accessories" className="text-gray-900 hover:bg-gray-100">Accessories</SelectItem>
            <SelectItem value="stationery" className="text-gray-900 hover:bg-gray-100">Stationery</SelectItem>
            <SelectItem value="other" className="text-gray-900 hover:bg-gray-100">Other</SelectItem>
          </SelectContent>
        </Select>

        <Select value={org} onValueChange={setOrg}>
          <SelectTrigger className="bg-white border-gray-300 text-gray-900">
            <SelectValue placeholder="Organization" />
          </SelectTrigger>
          <SelectContent className="z-[100] bg-white border border-gray-200 shadow-xl">
            <SelectItem value="all" className="text-gray-900 hover:bg-gray-100">All Organizations</SelectItem>
            <SelectItem value="TON" className="text-gray-900 hover:bg-gray-100">TON Platform</SelectItem>
            <SelectItem value="TEDxHanoi" className="text-gray-900 hover:bg-gray-100">TEDxHanoi</SelectItem>
            <SelectItem value="TEDxHoChiMinhCity" className="text-gray-900 hover:bg-gray-100">TEDxHoChiMinhCity</SelectItem>
            <SelectItem value="TEDxDaNang" className="text-gray-900 hover:bg-gray-100">TEDxDaNang</SelectItem>
            <SelectItem value="TEDxCanTho" className="text-gray-900 hover:bg-gray-100">TEDxCanTho</SelectItem>
          </SelectContent>
        </Select>

        <Select value={eventType} onValueChange={setEventType}>
          <SelectTrigger className="bg-white border-gray-300 text-gray-900">
            <SelectValue placeholder="Event Type" />
          </SelectTrigger>
          <SelectContent className="z-[100] bg-white border border-gray-200 shadow-xl">
            <SelectItem value="all" className="text-gray-900 hover:bg-gray-100">All Event Types</SelectItem>
            <SelectItem value="TEDX" className="text-gray-900 hover:bg-gray-100">TEDx Events</SelectItem>
            <SelectItem value="WORKSHOP" className="text-gray-900 hover:bg-gray-100">Workshops</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}


