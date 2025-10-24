import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { GraduationCap, BookOpen, Play, Clock, Award, Users, Calendar } from "lucide-react"
import Link from "next/link"

export default async function UserLearningPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  // Get user's learning progress
  const learningProgress = await prisma.learningProgress.findMany({
    where: { userId: session.user.id },
    include: {
      service: true
    },
    orderBy: { lastAccessedAt: "desc" }
  })

  // Get user's mentor sessions
  const mentorSessions = await prisma.mentorSession.findMany({
    where: { studentId: session.user.id },
    include: {
      mentor: true,
      service: true
    },
    orderBy: { date: "desc" }
  })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Học tập của tôi</h1>
        <p className="text-muted-foreground">
          Theo dõi tiến độ học tập và các khóa học đã tham gia
        </p>
      </div>

      {/* Learning Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Khóa học</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{learningProgress.length}</div>
            <p className="text-xs text-muted-foreground">
              Tổng số khóa học
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Phiên mentoring</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mentorSessions.length}</div>
            <p className="text-xs text-muted-foreground">
              Tổng số phiên
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tiến độ TB</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {learningProgress.length > 0 
                ? Math.round(learningProgress.reduce((acc, curr) => acc + (curr.completionPercent || 0), 0) / learningProgress.length)
                : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Hoàn thành trung bình
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Thời gian học</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0h</div>
            <p className="text-xs text-muted-foreground">
              Tổng thời gian
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Learning Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Courses */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Khóa học của tôi
            </CardTitle>
            <CardDescription>
              Tiến độ học tập các khóa học
            </CardDescription>
          </CardHeader>
          <CardContent>
            {learningProgress.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Chưa có khóa học nào</h3>
                <p className="text-muted-foreground mb-4">
                  Bạn chưa đăng ký khóa học nào. Hãy khám phá các dịch vụ học tập!
                </p>
                <Button asChild>
                  <Link href="/services">
                    <Play className="h-4 w-4 mr-2" />
                    Xem dịch vụ
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {learningProgress.map((progress) => (
                  <div key={progress.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium">{progress.service?.name || "Khóa học"}</h4>
                        <p className="text-sm text-muted-foreground">
                          Cập nhật: {new Date(progress.lastAccessedAt || progress.createdAt).toLocaleDateString('vi-VN')}
                        </p>
                      </div>
                      <Badge variant="secondary">
                        {progress.completionPercent || 0}%
                      </Badge>
                    </div>
                    <Progress value={progress.completionPercent || 0} className="mb-3" />
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Play className="h-4 w-4 mr-2" />
                        Tiếp tục học
                      </Button>
                      <Button size="sm" variant="outline">
                        <BookOpen className="h-4 w-4 mr-2" />
                        Xem chi tiết
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Mentor Sessions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Phiên mentoring
            </CardTitle>
            <CardDescription>
              Lịch sử các phiên mentoring
            </CardDescription>
          </CardHeader>
          <CardContent>
            {mentorSessions.length === 0 ? (
              <div className="text-center py-8">
                <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Chưa có phiên mentoring</h3>
                <p className="text-muted-foreground mb-4">
                  Bạn chưa có phiên mentoring nào. Hãy tìm mentor phù hợp!
                </p>
                <Button asChild>
                  <Link href="/services">
                    <Users className="h-4 w-4 mr-2" />
                    Tìm mentor
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {mentorSessions.map((session) => (
                  <div key={session.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium">{session.service?.name || "Mentoring"}</h4>
                        <p className="text-sm text-muted-foreground">
                          Mentor: {session.mentor.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Ngày: {new Date(session.date).toLocaleDateString('vi-VN')}
                        </p>
                      </div>
                      <Badge variant="outline">
                        {session.feedback ? "Hoàn thành" : "Đang chờ"}
                      </Badge>
                    </div>
                    {session.feedback && (
                      <div className="bg-muted p-3 rounded-lg">
                        <p className="text-sm">
                          <strong>Phản hồi:</strong> {session.feedback}
                        </p>
                      </div>
                    )}
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" variant="outline">
                        <BookOpen className="h-4 w-4 mr-2" />
                        Xem chi tiết
                      </Button>
                      {!session.feedback && (
                        <Button size="sm" variant="outline">
                          Đánh giá
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Thao tác nhanh</CardTitle>
          <CardDescription>
            Truy cập nhanh các tính năng học tập
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button asChild variant="outline">
              <Link href="/services">
                <BookOpen className="h-4 w-4 mr-2" />
                Khám phá khóa học
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/calendar">
                <Calendar className="h-4 w-4 mr-2" />
                Xem lịch học
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/workspace">
                <GraduationCap className="h-4 w-4 mr-2" />
                Workspace
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
