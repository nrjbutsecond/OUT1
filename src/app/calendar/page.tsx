"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, ChevronLeft, ChevronRight, Plus, Search, Settings, X } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

interface Event {
  id: string
  name: string
  description: string
  date: string
  location: string
  type: string
  ticketPrice: number
  organization?: {
    name: string
  }
}

export default function CalendarPage() {
  const { data: session } = useSession()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<'month' | 'week' | 'day'>('month')
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCalendars, setSelectedCalendars] = useState<string[]>(['tedx', 'workshops', 'mentoring', 'personal'])
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [newEvent, setNewEvent] = useState({
    name: '',
    description: '',
    date: '',
    time: '',
    location: '',
    type: 'PERSONAL'
  })

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const response = await fetch('/api/events')
        if (response.ok) {
          const data = await response.json()
          setEvents(data)
        }
      } catch (error) {
        console.error('Failed to load events:', error)
      } finally {
        setLoading(false)
      }
    }

    loadEvents()
  }, [])

  // Mock data for personal schedule (only for logged-in users)
  const personalSchedule = session ? [
    {
      id: "p1",
      name: "Mentoring Session - Event Planning",
      date: "2025-01-15",
      time: "15:00",
      type: "MENTORING",
      service: "Mentoring Full Package",
    },
    {
      id: "p2",
      name: "Workshop: Speaker Coaching",
      date: "2025-01-20",
      time: "09:00",
      type: "WORKSHOP",
      service: "Workshop Ticket",
    },
    {
      id: "m1",
      name: "Mentoring Session with Dr. Smith",
      date: "2025-01-25",
      time: "10:00",
      type: "MENTORING",
      service: "Leadership Development",
    },
    {
      id: "m2",
      name: "Mentoring Session with Sarah Johnson",
      date: "2025-02-01",
      time: "15:00",
      type: "MENTORING",
      service: "Public Speaking",
    },
  ] : []

  const toggleCalendar = (calendarId: string) => {
    setSelectedCalendars(prev => 
      prev.includes(calendarId) 
        ? prev.filter(id => id !== calendarId)
        : [...prev, calendarId]
    )
  }

  const handleCreateEvent = () => {
    if (!newEvent.name || !newEvent.date || !newEvent.time) {
      toast.error("Please fill in all required fields")
      return
    }

    // In a real app, this would save to database
    toast.success("Event created successfully!")
    setCreateDialogOpen(false)
    setNewEvent({
      name: '',
      description: '',
      date: '',
      time: '',
      location: '',
      type: 'PERSONAL'
    })
  }

  const getEventsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    
    // Filter events by date and selected calendars
    const dayEvents = events.filter(event => {
      const eventDate = new Date(event.date).toISOString().split('T')[0]
      const calendarType = event.type === 'TEDX' ? 'tedx' : 
                          event.type === 'WORKSHOP' ? 'workshops' : 'mentoring'
      return eventDate === dateStr && selectedCalendars.includes(calendarType)
    })
    
    // Add personal schedule if user is logged in and personal is selected
    const personalEvents = session && selectedCalendars.includes('personal') 
      ? personalSchedule.filter(event => event.date === dateStr)
      : []
    
    return [...dayEvents, ...personalEvents]
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate)
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1)
    } else {
      newDate.setMonth(newDate.getMonth() + 1)
    }
    setCurrentDate(newDate)
  }

  // Calendar grid generation
  const generateCalendarGrid = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())
    
    const days = []
    const currentDateCopy = new Date(startDate)
    
    for (let i = 0; i < 42; i++) {
      days.push(new Date(currentDateCopy))
      currentDateCopy.setDate(currentDateCopy.getDate() + 1)
    }
    
    return days
  }

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'TEDX':
        return 'bg-red-500 text-white'
      case 'WORKSHOP':
        return 'bg-blue-500 text-white'
      case 'MENTORING':
        return 'bg-green-500 text-white'
      case 'PERSONAL':
        return 'bg-purple-500 text-white'
      default:
        return 'bg-gray-500 text-white'
    }
  }

  const calendarDays = generateCalendarGrid()

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gray-50">
        <div className="flex h-full">
          {/* Left Sidebar - Google Calendar Style */}
          <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
            {/* Create Button */}
            <div className="p-4 border-b border-gray-200">
              <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full bg-red-600 hover:bg-red-700 text-white font-medium">
                    <Plus className="h-4 w-4 mr-2" />
                    Create
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px] bg-white">
                  <DialogHeader>
                    <DialogTitle className="text-gray-900 text-xl font-semibold">Create New Event</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="event-name" className="text-gray-700 font-medium">Event Name *</Label>
                      <Input
                        id="event-name"
                        placeholder="Event name"
                        value={newEvent.name}
                        onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
                        className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="event-date" className="text-gray-700 font-medium">Date *</Label>
                        <Input
                          id="event-date"
                          type="date"
                          value={newEvent.date}
                          onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                          className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="event-time" className="text-gray-700 font-medium">Time *</Label>
                        <Input
                          id="event-time"
                          type="time"
                          value={newEvent.time}
                          onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                          className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="event-location" className="text-gray-700 font-medium">Location</Label>
                      <Input
                        id="event-location"
                        placeholder="Event location"
                        value={newEvent.location}
                        onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                        className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="event-description" className="text-gray-700 font-medium">Description</Label>
                      <Textarea
                        id="event-description"
                        placeholder="Event description"
                        value={newEvent.description}
                        onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                        className="border-gray-300 focus:border-red-500 focus:ring-red-500 min-h-[100px]"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={handleCreateEvent}>
                      Save Event
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Mini Calendar */}
            <div className="p-4 border-b border-gray-200">
              <div className="text-sm font-medium text-gray-900 mb-3">
                {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </div>
              <div className="grid grid-cols-7 gap-1 text-xs">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                  <div key={day} className="text-center text-gray-500 py-1 font-medium">
                    {day}
                  </div>
                ))}
                {calendarDays.slice(0, 35).map((day, index) => {
                  const isCurrentMonth = day.getMonth() === currentDate.getMonth()
                  const isToday = day.toDateString() === new Date().toDateString()
                  
                  return (
                    <button
                      key={index}
                      className={`text-center py-1 rounded hover:bg-gray-100 ${
                        isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                      } ${isToday ? 'bg-red-600 text-white hover:bg-red-700' : ''}`}
                      onClick={() => setCurrentDate(day)}
                    >
                      {day.getDate()}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Search */}
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Calendar List */}
            <div className="flex-1 p-4">
              <div className="space-y-1">
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                  My Calendars
                </div>
                
                {[
                  { id: 'tedx', name: 'TEDx Events', color: 'bg-red-500' },
                  { id: 'workshops', name: 'Workshops', color: 'bg-blue-500' },
                  { id: 'mentoring', name: 'Mentoring', color: 'bg-green-500' },
                  { id: 'personal', name: 'Personal Schedule', color: 'bg-purple-500' }
                ].map(({ id, name, color }) => (
                  <div key={id} className="flex items-center space-x-3 py-1">
                    <div className={`w-3 h-3 rounded-full ${color} ${selectedCalendars.includes(id) ? 'opacity-100' : 'opacity-30'}`}></div>
                    <button
                      onClick={() => toggleCalendar(id)}
                      className={`text-sm ${selectedCalendars.includes(id) ? 'font-medium text-gray-900' : 'text-gray-600'}`}
                    >
                      {name}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Calendar */}
          <div className="flex-1 flex flex-col">
            {/* Calendar Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <h1 className="text-2xl font-normal text-gray-900">
                    {currentDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                  </h1>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button 
                    variant={view === 'month' ? 'default' : 'outline'} 
                    size="sm" 
                    onClick={() => setView('month')}
                    className="text-sm"
                  >
                    Month
                  </Button>
                  <Button 
                    variant={view === 'week' ? 'default' : 'outline'} 
                    size="sm" 
                    onClick={() => setView('week')}
                    className="text-sm"
                  >
                    Week
                  </Button>
                  <Button 
                    variant={view === 'day' ? 'default' : 'outline'} 
                    size="sm" 
                    onClick={() => setView('day')}
                    className="text-sm"
                  >
                    Day
                  </Button>
                </div>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="flex-1 bg-white">
              {/* Day Headers */}
              <div className="grid grid-cols-7 border-b border-gray-200">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="p-4 text-center text-sm font-medium text-gray-600 border-r border-gray-200 last:border-r-0">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7">
                {calendarDays.map((day, index) => {
                  const isCurrentMonth = day.getMonth() === currentDate.getMonth()
                  const isToday = day.toDateString() === new Date().toDateString()
                  const dayEvents = getEventsForDate(day)
                  
                  return (
                    <div 
                      key={index} 
                      className={`min-h-[120px] border-r border-b border-gray-200 last:border-r-0 p-2 ${
                        isCurrentMonth ? 'bg-white' : 'bg-gray-50'
                      } ${isToday ? 'bg-red-50' : ''}`}
                    >
                      <div className={`text-sm font-medium mb-1 ${
                        isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                      } ${isToday ? 'text-red-600 font-bold' : ''}`}>
                        {day.getDate()}
                      </div>
                      
                      <div className="space-y-1">
                        {dayEvents.slice(0, 3).map(event => {
                          const isPersonal = personalSchedule.some(e => e.id === event.id)
                          
                          return (
                            <div 
                              key={event.id}
                              className={`text-xs p-1 rounded cursor-pointer hover:shadow-sm ${getEventTypeColor(event.type)}`}
                              title={event.name}
                            >
                              <div className="truncate">{event.name}</div>
                              <div className="text-xs opacity-75">
                                {new Date(event.date).toLocaleTimeString('en-US', { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                                {isPersonal && ' 👤'}
                              </div>
                            </div>
                          )
                        })}
                        {dayEvents.length > 3 && (
                          <div className="text-xs text-gray-500">
                            +{dayEvents.length - 3} more
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}