import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { GraduationCap, Users, Calendar, BookOpen, MessageSquare, TrendingUp } from "lucide-react"

export default async function MentorDashboard() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "MENTOR") {
    redirect("/login")
  }

  // Get mentor's service purchases
  const servicePurchases = await prisma.servicePurchase.findMany({
    where: {
      userId: session.user.id
    },
    include: {
      service: true,
      workspace: true
    }
  })

  // Get mentor sessions
  const mentorSessions = await prisma.mentorSession.findMany({
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
    take: 5
  })

  // Get upcoming sessions
  const upcomingSessions = await prisma.mentorSession.findMany({
    where: {
      mentorId: session.user.id,
      date: {
        gte: new Date()
      }
    },
    include: {
      student: true,
      service: true
    },
    orderBy: {
      date: "asc"
    },
    take: 3
  })

  const totalStudents = new Set(mentorSessions.map((session: { studentId: string }) => session.studentId)).size

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard Mentor</h1>
        <p className="text-muted-foreground">
          Chào mừng trở lại, {session.user.name}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Học viên</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents}</div>
            <p className="text-xs text-muted-foreground">
              Tổng số học viên
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Buổi học</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mentorSessions.length}</div>
            <p className="text-xs text-muted-foreground">
              Buổi học đã hoàn thành
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dịch vụ</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{servicePurchases.length}</div>
            <p className="text-xs text-muted-foreground">
              Dịch vụ đang tham gia
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đánh giá</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0⭐</div>
            <p className="text-xs text-muted-foreground">
              Average rating
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Sessions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Buổi học sắp tới
          </CardTitle>
          <CardDescription>
            Các buổi học được lên lịch trong thời gian tới
          </CardDescription>
        </CardHeader>
        <CardContent>
          {upcomingSessions.length === 0 ? (
            <p className="text-muted-foreground">Không có buổi học nào sắp tới</p>
          ) : (
            <div className="space-y-4">
              {upcomingSessions.map((session) => (
                <div key={session.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{session.service.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Student: {session.student.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Ngày: {new Date(session.date).toLocaleDateString('vi-VN')} lúc {new Date(session.date).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">
                        Scheduled
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Feedback */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Đánh giá gần đây
          </CardTitle>
          <CardDescription>
            Phản hồi từ học viên về buổi học
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No feedback yet</p>
        </CardContent>
      </Card>

      {/* Workspaces */}
      <Card>
        <CardHeader>
          <CardTitle>Workspace của bạn</CardTitle>
          <CardDescription>
            Truy cập workspace để theo dõi tiến độ dự án
          </CardDescription>
        </CardHeader>
        <CardContent>
          {servicePurchases.length === 0 ? (
            <p className="text-muted-foreground">Bạn chưa tham gia dịch vụ nào</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {servicePurchases.map((purchase) => (
                <div key={purchase.id} className="border rounded-lg p-4">
                  <h3 className="font-medium">{purchase.service.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Tiến độ: {purchase.progress}%
                  </p>
                  {purchase.workspace && (
                    <Button asChild size="sm">
                      <Link href={`/workspace/${purchase.workspace.id}`}>
                        Mở Workspace
                      </Link>
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Thao tác nhanh</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button asChild variant="outline">
              <Link href="/calendar">
                Xem lịch
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/notifications">
                Thông báo
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/profile">
                Chỉnh sửa hồ sơ
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


