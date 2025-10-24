import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { FileText, Upload, Download, Plus } from "lucide-react"

export default async function MentorMaterialsPage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "MENTOR") {
    redirect("/login")
  }

  // Get mentor's uploaded files
  const files = await prisma.workspaceFile.findMany({
    where: {
      uploadedBy: session.user.id
    },
    include: {
      workspace: true
    },
    orderBy: {
      uploadedAt: "desc"
    },
    take: 20
  })

  // Get mentor's workspaces
  const workspaces = await prisma.workspace.findMany({
    where: {
      ownerId: session.user.id
    },
    include: {
      _count: {
        select: {
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
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Tài liệu</h1>
          <p className="text-muted-foreground">
            Quản lý tài liệu và workspace của mentor
          </p>
        </div>
        <Button asChild>
          <Link href="/workspace">
            <Plus className="h-4 w-4 mr-2" />
            Tạo workspace mới
          </Link>
        </Button>
      </div>

      {/* Workspaces */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Workspace của tôi
          </CardTitle>
          <CardDescription>
            Tổng cộng {workspaces.length} workspace
          </CardDescription>
        </CardHeader>
        <CardContent>
          {workspaces.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Chưa có workspace nào</p>
              <Button asChild className="mt-4">
                <Link href="/workspace">
                  Tạo workspace đầu tiên
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {workspaces.map((workspace) => (
                <div key={workspace.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-medium">{workspace.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {workspace.description}
                      </p>
                      <div className="flex gap-4 mt-2">
                        <div className="flex items-center gap-1">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{workspace._count.files} files</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{workspace._count.pages} pages</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{workspace._count.tasks} tasks</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">
                        {workspace.isPublic ? "Công khai" : "Riêng tư"}
                      </p>
                      <Button asChild size="sm" className="mt-2">
                        <Link href={`/workspace/${workspace.id}`}>
                          Mở workspace
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Files */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Tài liệu gần đây
          </CardTitle>
          <CardDescription>
            Tổng cộng {files.length} file
          </CardDescription>
        </CardHeader>
        <CardContent>
          {files.length === 0 ? (
            <div className="text-center py-8">
              <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Chưa có tài liệu nào</p>
              <Button asChild className="mt-4">
                <Link href="/workspace">
                  Upload tài liệu đầu tiên
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {files.map((file) => (
                <div key={file.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-medium">{file.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Workspace: {file.workspace.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Loại: {file.type}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Upload: {new Date(file.uploadedAt).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {(file.size / 1024).toFixed(1)} KB
                      </p>
                      <Button asChild size="sm" className="mt-2">
                        <Link href={`/workspace/${file.workspaceId}`}>
                          <Download className="h-4 w-4 mr-1" />
                          Xem
                        </Link>
                      </Button>
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
