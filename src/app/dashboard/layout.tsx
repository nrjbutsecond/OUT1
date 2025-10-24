import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen">
      <DashboardHeader user={session.user} />
      <div className="flex">
        <DashboardSidebar role={session.user.role} />
        <main className="flex-1 p-8 bg-muted/50">
          {children}
        </main>
      </div>
    </div>
  )
}


