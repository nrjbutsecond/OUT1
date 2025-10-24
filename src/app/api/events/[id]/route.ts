import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        organization: true
      }
    })

    if (!event) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      )
    }

    // Mock ticket types for now - in real app, this would come from database
    const ticketTypes = [
      { 
        id: "student", 
        name: "Student Pass", 
        price: Math.floor(event.ticketPrice * 0.5), 
        description: "Discounted access for students (valid student ID required at entrance).", 
        available: 200 
      },
      { 
        id: "basic", 
        name: "General Admission", 
        price: event.ticketPrice, 
        description: "Standard access to main event hall with all talks and networking sessions.", 
        available: 150 
      },
      { 
        id: "premium", 
        name: "Premium Experience", 
        price: Math.floor(event.ticketPrice * 1.67), 
        description: "Priority seating, welcome package, and access to exclusive networking area.", 
        available: 75 
      },
      { 
        id: "vip", 
        name: "VIP Experience", 
        price: Math.floor(event.ticketPrice * 2.67), 
        description: "Front row seats, VIP lounge access, meet & greet with speakers, and premium gift bag.", 
        available: 30 
      },
    ]

    const eventWithTicketTypes = {
      ...event,
      ticketTypes
    }

    return NextResponse.json(eventWithTicketTypes)
  } catch (error) {
    console.error("Error fetching event:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
