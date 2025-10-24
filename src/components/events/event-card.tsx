"use client"

import { Event, Organization } from "@prisma/client"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatCurrency, formatDate } from "@/lib/utils"
import Link from "next/link"
import { Calendar, MapPin, Users } from "lucide-react"

type EventWithOrg = Event & {
  organization: Organization | null
  _count: { tickets: number }
}

export function EventCard({ event }: { event: EventWithOrg }) {
  return (
    <Card className="flex flex-col h-full bg-gray-800/90 backdrop-blur-sm border border-gray-700/50 shadow-xl hover:shadow-2xl hover:shadow-red-500/10 transition-all duration-300 hover:-translate-y-1 hover:border-red-500/30">
      <CardHeader>
        <div className="flex items-start justify-between mb-2">
          <Badge variant={event.type === "TEDX" ? "default" : "secondary"} className="bg-red-600 text-white">
            {event.type}
          </Badge>
          <Badge variant="outline" className="border-gray-600 text-gray-300">
            {event.organizationId ? event.organization?.name : "TON"}
          </Badge>
        </div>
        <CardTitle className="line-clamp-2 text-white">{event.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 space-y-3">
        <p className="text-sm text-gray-300 line-clamp-3">{event.description}</p>
        
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-gray-400">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(event.date)}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <MapPin className="h-4 w-4" />
            <span className="line-clamp-1">{event.location}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <Users className="h-4 w-4" />
            <span>{event._count.tickets} people registered</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between gap-2">
        <div className="text-xl font-bold text-red-500">
          {formatCurrency(event.ticketPrice)}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild className="border-gray-600 text-gray-300 hover:bg-gray-700">
            <Link href={`/events/${event.id}`}>View Details</Link>
          </Button>
          <Button className="bg-red-600 hover:bg-red-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300" asChild>
            <Link href={`/events/${event.id}/purchase`}>Buy Tickets</Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}


