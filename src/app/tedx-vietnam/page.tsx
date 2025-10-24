import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin } from "lucide-react"
import { formatDate } from "@/lib/utils"
import Link from "next/link"

export default async function TEDxVietnamPage() {
  const upcomingEvents = await prisma.event.findMany({
    where: {
      approved: true,
      type: "TEDX",
      date: {
        gte: new Date(),
      },
    },
    include: {
      organization: true,
    },
    orderBy: {
      date: "asc",
    },
    take: 6,
  })

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="tedx-gradient text-white py-16">
          <div className="container">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">TEDx tại Việt Nam</h1>
            <p className="text-xl text-red-50 max-w-2xl">
              Ideas worth spreading - Khám phá các sự kiện TEDx và những bài nói truyền cảm hứng
            </p>
          </div>
        </div>

        {/* Featured Talks - Main Content */}
        <section className="py-16">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-3">
                <h2 className="text-3xl font-bold mb-8">Featured TEDx Talks</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2, 3, 4].map((i) => (
                    <Card key={i} className="hover:shadow-lg transition-shadow">
                      <div className="aspect-video bg-gradient-to-br from-red-100 to-orange-100 rounded-t-lg flex items-center justify-center">
                        <p className="text-muted-foreground text-sm">YouTube Video {i}</p>
                      </div>
                      <CardHeader>
                        <CardTitle className="line-clamp-2">
                          TEDx Talk Title {i}
                        </CardTitle>
                        <CardDescription>Speaker Name</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button variant="outline" className="w-full">Watch Video</Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-1">
                <Card className="sticky top-8">
                  <CardHeader>
                    <CardTitle>Upcoming Events</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {upcomingEvents.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">
                          No upcoming TEDx events
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {upcomingEvents.map((event) => (
                          <div key={event.id} className="border rounded-lg p-4">
                            <div className="flex items-start justify-between mb-2">
                              <Badge>TEDx</Badge>
                              <span className="text-xs text-muted-foreground">
                                {event.organization?.name || "TON"}
                              </span>
                            </div>
                            <h4 className="font-semibold text-sm mb-1 line-clamp-2">{event.name}</h4>
                            <p className="text-xs text-muted-foreground mb-2">
                              {formatDate(event.date)}
                            </p>
                            <p className="text-xs text-muted-foreground mb-3 line-clamp-1">
                              {event.location}
                            </p>
                            <Button size="sm" className="w-full" asChild>
                              <Link href={`/events/${event.id}`}>View Details</Link>
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="text-center mt-6">
                      <Button variant="outline" size="sm" asChild>
                        <Link href="/events">View All Events</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}


