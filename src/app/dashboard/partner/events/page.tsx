import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Calendar, Plus } from "lucide-react"

export default async function PartnerEventsPage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "PARTNER") {
    redirect("/login")
  }

  // Get partner's organization
  const organization = await prisma.organization.findFirst({
    where: {
      OR: [
        { createdBy: session.user.id },
        { 
          members: {
            some: {
              userId: session.user.id,
              approved: true
            }
          }
        }
      ]
    },
    include: {
      events: {
        orderBy: {
          date: "desc"
        }
      }
    }
  })

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Sự kiện của tổ chức</h1>
          <p className="text-muted-foreground">
            Quản lý sự kiện của {organization?.name}
          </p>
        </div>
        <Button asChild>
          <Link href="/events">
            <Plus className="h-4 w-4 mr-2" />
            Tạo sự kiện mới
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Danh sách sự kiện
          </CardTitle>
          <CardDescription>
            Tổng cộng {organization?.events.length || 0} sự kiện
          </CardDescription>
        </CardHeader>
        <CardContent>
          {organization?.events.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Chưa có sự kiện nào</p>
              <Button asChild className="mt-4">
                <Link href="/events">
                  Tạo sự kiện đầu tiên
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {organization?.events.map((event) => (
                <div key={event.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{event.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {event.description}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Ngày: {new Date(event.date).toLocaleDateString('vi-VN')}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Địa điểm: {event.location}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {event.ticketPrice.toLocaleString('vi-VN')}đ
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {event.approved ? "Đã duyệt" : "Chờ duyệt"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
