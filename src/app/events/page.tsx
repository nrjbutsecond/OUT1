import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { prisma } from "@/lib/prisma"
import { EventCard } from "@/components/events/event-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"

export default async function EventsPage() {
  const events = await prisma.event.findMany({
    where: {
      approved: true,
    },
    include: {
      organization: true,
      _count: {
        select: {
          tickets: true,
        },
      },
    },
    orderBy: {
      date: "asc",
    },
  })

  const tedxEvents = events.filter((e) => e.type === "TEDX")
  const workshops = events.filter((e) => e.type === "WORKSHOP")

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="tedx-gradient text-white py-16">
          <div className="container">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Sự kiện</h1>
            <p className="text-xl text-red-50 max-w-2xl">
              Khám phá các sự kiện TEDx và workshop sắp diễn ra
            </p>
          </div>
        </div>

        <div className="container py-12">
          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search events..."
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent className="z-[100] bg-white border border-gray-200 shadow-xl">
                    <SelectItem value="all" className="text-gray-900 hover:bg-gray-100">All Types</SelectItem>
                    <SelectItem value="TEDX" className="text-gray-900 hover:bg-gray-100">TEDx Events</SelectItem>
                    <SelectItem value="WORKSHOP" className="text-gray-900 hover:bg-gray-100">Workshops</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by organization" />
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
              </div>
            </div>
          </div>

          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">Tất cả ({events.length})</TabsTrigger>
              <TabsTrigger value="tedx">TEDx Events ({tedxEvents.length})</TabsTrigger>
              <TabsTrigger value="workshop">Workshops ({workshops.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-8">
              {events.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-lg">
                    Chưa có sự kiện nào sắp diễn ra
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {events.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="tedx" className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tedxEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="workshop" className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {workshops.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  )
}


