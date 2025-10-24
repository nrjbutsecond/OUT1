"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, Menu, ShoppingCart, Calendar, Settings, LayoutDashboard } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { LanguageToggle } from "@/components/ui/language-toggle"
import { NotificationDropdown } from "@/components/ui/notification-dropdown"

export function Header() {
  const { data: session, status } = useSession()
  const router = useRouter()

  // Mock notifications data
  const notifications = [
    {
      id: "1",
      title: "Welcome to TON Platform",
      content: "Welcome to **TON Platform**. Explore these services curated by your organization.",
      time: "18 days ago",
      read: false,
    },
    {
      id: "2", 
      title: "New Event Available",
      content: "TEDxHanoi 2024: Innovation & Technology is now available for registration.",
      time: "2 days ago",
      read: false,
    },
    {
      id: "3",
      title: "Service Purchase Confirmed",
      content: "Your Event Planning Consultation service has been activated successfully.",
      time: "1 week ago",
      read: true,
    }
  ]

  const unreadCount = notifications.filter(n => !n.read).length

  const handleMarkAllRead = () => {
    // In real app, this would update the database
    console.log("Mark all notifications as read")
  }

  const getDashboardPath = () => {
    if (!session?.user) return "/dashboard/user"
    
    switch (session.user.role) {
      case "ADMIN":
        return "/dashboard/admin"
      case "PARTNER":
        return "/dashboard/partner"
      case "MENTOR":
        return "/dashboard/mentor"
      default:
        return "/dashboard/user"
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-gray-900/60 border-gray-700">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-600 text-white font-bold text-lg">
              TON
            </div>
            <span className="hidden md:inline-block font-bold text-lg text-white">
              Platform
            </span>
          </Link>
        </div>

        <nav className="hidden md:flex gap-6">
          <Link href="/services" className="text-sm font-medium text-white hover:text-red-400 transition-colors">
            Services
          </Link>
          <Link href="/partners" className="text-sm font-medium text-white hover:text-red-400 transition-colors">
            Partners
          </Link>
          <Link href="/tedx-vietnam" className="text-sm font-medium text-white hover:text-red-400 transition-colors">
            TEDx Vietnam
          </Link>
          <Link href="/events" className="text-sm font-medium text-white hover:text-red-400 transition-colors">
            Events
          </Link>
          <Link href="/merchandise" className="text-sm font-medium text-white hover:text-red-400 transition-colors">
            Merchandise
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          {status === "authenticated" ? (
            <>
              <LanguageToggle />

              <Button variant="ghost" size="icon" asChild className="text-white hover:text-red-400">
                <Link href="/calendar">
                  <Calendar className="h-5 w-5" />
                </Link>
              </Button>

              <Button variant="ghost" size="icon" className="relative text-white hover:text-red-400" asChild>
                <Link href="/cart">
                  <ShoppingCart className="h-5 w-5" />
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-600 text-white">
                    0
                  </Badge>
                </Link>
              </Button>

              <NotificationDropdown 
                notifications={notifications}
                unreadCount={unreadCount}
                onMarkAllRead={handleMarkAllRead}
              />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar>
                      <AvatarImage src={session.user.image || ""} alt={session.user.name} />
                      <AvatarFallback>
                        {session.user.name?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 z-[100] bg-white border border-gray-200 shadow-xl backdrop-blur-none">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium text-gray-900">{session.user.name}</p>
                      <p className="text-xs text-gray-600">{session.user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push(getDashboardPath())} className="text-gray-900 hover:bg-gray-100">
                    <LayoutDashboard className="h-4 w-4 mr-2" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/settings")} className="text-gray-900 hover:bg-gray-100">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-red-600 hover:bg-red-50"
                    onClick={() => signOut({ callbackUrl: "/" })}
                  >
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <LanguageToggle />
              
              <Button variant="ghost" asChild className="text-white hover:text-red-400">
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild className="bg-red-600 hover:bg-red-700 text-white">
                <Link href="/register">Sign Up</Link>
              </Button>
            </div>
          )}

          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}

