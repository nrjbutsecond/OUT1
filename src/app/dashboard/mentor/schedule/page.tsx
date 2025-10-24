import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Calendar, Clock, User, Plus } from "lucide-react"

export default async function MentorSchedulePage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "MENTOR") {
    redirect("/login")
  }

  // Get mentor's sessions
  const sessions = await prisma.mentorSession.findMany({
    where: {
      mentorId: session.user.id
    },
    include: {
      student: true,
      service: true
    },
    orderBy: {
      date: "desc"
    },
    take: 10
  })

  // Get mentor's schedules
  const schedules = await prisma.mentorSchedule.findMany({
    where: {
      mentorId: session.user.id
    },
    orderBy: {
      createdAt: "asc"
    }
  })

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Lịch dạy</h1>
          <p className="text-muted-foreground">
            Quản lý lịch dạy và phiên mentoring
          </p>
        </div>
        <Button asChild>
          <Link href="/calendar">
            <Plus className="h-4 w-4 mr-2" />
            Thêm lịch mới
          </Link>
        </Button>
      </div>

      {/* Upcoming Sessions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Phiên mentoring sắp tới
          </CardTitle>
          <CardDescription>
            Tổng cộng {sessions.length} phiên
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sessions.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Chưa có phiên mentoring nào</p>
              <Button asChild className="mt-4">
                <Link href="/calendar">
                  Tạo phiên đầu tiên
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {sessions.map((session) => (
                <div key={session.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{session.service?.name || "Mentoring Session"}</p>
                      <p className="text-sm text-muted-foreground">
                        Học viên: {session.student.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Email: {session.student.email}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Ngày: {new Date(session.date).toLocaleDateString('vi-VN')}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Thời gian: {new Date(session.date).toLocaleTimeString('vi-VN')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {session.duration} phút
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {session.status}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Weekly Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Lịch tuần
          </CardTitle>
          <CardDescription>
            Thời gian có sẵn trong tuần
          </CardDescription>
        </CardHeader>
        <CardContent>
          {schedules.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Chưa có lịch tuần nào</p>
              <Button asChild className="mt-4">
                <Link href="/calendar">
                  Thiết lập lịch tuần
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {schedules.map((schedule) => (
                <div key={schedule.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">
                        Ngày: {new Date(schedule.date).toLocaleDateString('vi-VN')}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {schedule.startTime} - {schedule.endTime}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {schedule.available ? "Có sẵn" : "Không có sẵn"}
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
