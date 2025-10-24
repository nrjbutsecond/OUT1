import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { FileText, Plus, Users, Calendar } from "lucide-react"

export default async function WorkspacePage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  // Get user's workspaces
  const workspaces = await prisma.workspace.findMany({
    where: {
      OR: [
        { ownerId: session.user.id },
        {
          workspaceMembers: {
            some: {
              userId: session.user.id
            }
          }
        }
      ]
    },
    include: {
      owner: true,
      _count: {
        select: {
          workspaceMembers: true,
          files: true,
          pages: true,
          tasks: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Workspace</h1>
            <p className="text-muted-foreground">
              Quản lý workspace và tài liệu của bạn
            </p>
          </div>
          <Button asChild>
            <Link href="/dashboard">
              <Plus className="h-4 w-4 mr-2" />
              Tạo workspace mới
            </Link>
          </Button>
        </div>

        {workspaces.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Chưa có workspace nào</h3>
              <p className="text-muted-foreground mb-6">
                Tạo workspace đầu tiên để bắt đầu quản lý tài liệu và dự án
              </p>
              <Button asChild>
                <Link href="/dashboard">
                  <Plus className="h-4 w-4 mr-2" />
                  Tạo workspace đầu tiên
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workspaces.map((workspace) => (
              <Card key={workspace.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    {workspace.name}
                  </CardTitle>
                  <CardDescription>
                    {workspace.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      {workspace._count.workspaceMembers} thành viên
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <FileText className="h-4 w-4" />
                      {workspace._count.files} files
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <FileText className="h-4 w-4" />
                      {workspace._count.pages} pages
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {workspace._count.tasks} tasks
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className={`text-xs px-2 py-1 rounded ${
                      workspace.isPublic 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {workspace.isPublic ? 'Công khai' : 'Riêng tư'}
                    </span>
                    <Button asChild size="sm">
                      <Link href={`/workspace/${workspace.id}`}>
                        Mở workspace
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
