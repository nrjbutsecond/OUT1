import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Users, Mail, Phone, Calendar, GraduationCap } from "lucide-react"

export default async function MentorStudentsPage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "MENTOR") {
    redirect("/login")
  }

  // Get mentor's students
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
    }
  })

  // Get unique students
  const uniqueStudents = sessions.reduce((acc, session) => {
    const studentId = session.student.id
    if (!acc.find(s => s.id === studentId)) {
      acc.push(session.student)
    }
    return acc
  }, [] as typeof sessions[0]['student'][])

  // Get learning progress for each student
  const studentProgress = await Promise.all(
    uniqueStudents.map(async (student) => {
      const progress = await prisma.learningProgress.findMany({
        where: {
          userId: student.id
        },
        orderBy: {
          createdAt: "desc"
        },
        take: 1
      })
      return {
        student,
        progress: progress[0] || null
      }
    })
  )

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Học viên</h1>
        <p className="text-muted-foreground">
          Quản lý học viên và theo dõi tiến độ học tập
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Danh sách học viên
          </CardTitle>
          <CardDescription>
            Tổng cộng {uniqueStudents.length} học viên
          </CardDescription>
        </CardHeader>
        <CardContent>
          {uniqueStudents.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Chưa có học viên nào</p>
              <Button asChild className="mt-4">
                <Link href="/dashboard/mentor">
                  Quay về Dashboard
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {studentProgress.map(({ student, progress }) => {
                const studentSessions = sessions.filter(s => s.student.id === student.id)
                const completedSessions = studentSessions.filter(s => s.status === 'COMPLETED').length
                
                return (
                  <div key={student.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                            <span className="text-red-600 font-medium">
                              {student.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">{student.name}</p>
                            <p className="text-sm text-muted-foreground">{student.email}</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mt-4">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{student.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{student.phone || "Chưa cập nhật"}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{studentSessions.length} phiên</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <GraduationCap className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{completedSessions} hoàn thành</span>
                          </div>
                        </div>

                        {progress && (
                          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm font-medium">Tiến độ học tập:</p>
                            <p className="text-sm text-muted-foreground">
                              {progress.description}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Cập nhật: {new Date(progress.createdAt).toLocaleDateString('vi-VN')}
                            </p>
                          </div>
                        )}
                      </div>
                      
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {Math.round((completedSessions / studentSessions.length) * 100)}% hoàn thành
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {studentSessions.length - completedSessions} phiên còn lại
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
