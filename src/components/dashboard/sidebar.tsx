"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { UserRole } from "@prisma/client"
import {
  LayoutDashboard,
  Users,
  Building2,
  Package,
  Calendar,
  ShoppingBag,
  FileText,
  GraduationCap,
  Briefcase,
} from "lucide-react"

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  roles: UserRole[]
}

const navItems: NavItem[] = [
  {
    title: "Tổng quan",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ["ADMIN", "PARTNER", "USER", "MENTOR"],
  },
  {
    title: "Quản lý người dùng",
    href: "/dashboard/admin/users",
    icon: Users,
    roles: ["ADMIN"],
  },
  {
    title: "Quản lý tổ chức",
    href: "/dashboard/admin/organizations",
    icon: Building2,
    roles: ["ADMIN"],
  },
  {
    title: "Quản lý dịch vụ",
    href: "/dashboard/admin/services",
    icon: Briefcase,
    roles: ["ADMIN"],
  },
  {
    title: "Quản lý sự kiện",
    href: "/dashboard/admin/events",
    icon: Calendar,
    roles: ["ADMIN"],
  },
  {
    title: "Quản lý sản phẩm",
    href: "/dashboard/admin/products",
    icon: Package,
    roles: ["ADMIN"],
  },
  {
    title: "Quản lý đơn hàng",
    href: "/dashboard/admin/orders",
    icon: ShoppingBag,
    roles: ["ADMIN"],
  },
  {
    title: "Quản lý Mentor",
    href: "/dashboard/admin/mentors",
    icon: GraduationCap,
    roles: ["ADMIN"],
  },
  {
    title: "Thành viên",
    href: "/dashboard/partner/members",
    icon: Users,
    roles: ["PARTNER"],
  },
  {
    title: "Sự kiện",
    href: "/dashboard/partner/events",
    icon: Calendar,
    roles: ["PARTNER"],
  },
  {
    title: "Sản phẩm",
    href: "/dashboard/partner/products",
    icon: Package,
    roles: ["PARTNER"],
  },
  {
    title: "Đơn hàng",
    href: "/dashboard/partner/orders",
    icon: ShoppingBag,
    roles: ["PARTNER"],
  },
  {
    title: "Hồ sơ",
    href: "/dashboard/user/profile",
    icon: FileText,
    roles: ["USER"],
  },
  {
    title: "Đơn hàng",
    href: "/dashboard/user/orders",
    icon: ShoppingBag,
    roles: ["USER"],
  },
  {
    title: "Học tập",
    href: "/dashboard/user/learning",
    icon: GraduationCap,
    roles: ["USER"],
  },
  {
    title: "Lịch dạy",
    href: "/dashboard/mentor/schedule",
    icon: Calendar,
    roles: ["MENTOR"],
  },
  {
    title: "Học viên",
    href: "/dashboard/mentor/students",
    icon: Users,
    roles: ["MENTOR"],
  },
  {
    title: "Tài liệu",
    href: "/dashboard/mentor/materials",
    icon: FileText,
    roles: ["MENTOR"],
  },
]

export function DashboardSidebar({ role }: { role: UserRole }) {
  const pathname = usePathname()
  const filteredItems = navItems.filter((item) => item.roles.includes(role))

  return (
    <div className="hidden md:flex w-64 flex-col border-r bg-background">
      <nav className="flex-1 space-y-1 p-4">
        {filteredItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.title}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

