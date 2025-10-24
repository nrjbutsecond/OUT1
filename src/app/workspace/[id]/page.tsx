"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useParams, useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  FileText, 
  CheckSquare, 
  Calendar, 
  Users, 
  MessageSquare, 
  Plus, 
  Save, 
  Download,
  Upload,
  ArrowLeft,
  Folder,
  Clock,
  Target
} from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

interface Workspace {
  id: string
  name: string
  description: string
  serviceId: string
  serviceName: string
  progress: number
  status: 'active' | 'completed' | 'paused'
  createdAt: string
  updatedAt: string
}

interface Document {
  id: string
  title: string
  content: string
  type: 'document' | 'note' | 'task'
  createdAt: string
  updatedAt: string
}

interface Task {
  id: string
  title: string
  description: string
  completed: boolean
  dueDate?: string
  priority: 'low' | 'medium' | 'high'
  createdAt: string
}

export default function WorkspacePage() {
  const { data: session, status } = useSession()
  const params = useParams()
  const router = useRouter()
  const [workspace, setWorkspace] = useState<Workspace | null>(null)
  const [documents, setDocuments] = useState<Document[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [currentDocument, setCurrentDocument] = useState<Document | null>(null)
  const [documentContent, setDocumentContent] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
      return
    }

    // Load workspace data
    const loadWorkspace = async () => {
      try {
        // Mock workspace data
        const mockWorkspace: Workspace = {
          id: params.id as string,
          name: "Workspace: Tư vấn tổ chức sự kiện TEDx",
          description: "Workspace cho dịch vụ tư vấn tổ chức sự kiện TEDx",
          serviceId: "service-123",
          serviceName: "Tư vấn tổ chức sự kiện TEDx",
          progress: 65,
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }

        const mockDocuments: Document[] = [
          {
            id: "doc-1",
            title: "Kế hoạch tổng thể",
            content: "# Kế hoạch tổng thể\n\n## Mục tiêu\n- Tổ chức sự kiện TEDx thành công\n- Thu hút 200+ người tham dự\n- Tạo ra tác động tích cực cho cộng đồng\n\n## Timeline\n- Tháng 1: Lập kế hoạch\n- Tháng 2: Tìm speakers\n- Tháng 3: Marketing\n- Tháng 4: Tổ chức sự kiện",
            type: 'document',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: "doc-2",
            title: "Danh sách speakers",
            content: "# Danh sách speakers\n\n## Speakers đã xác nhận\n1. Nguyễn Văn A - CEO Tech Startup\n2. Trần Thị B - Nhà khoa học\n3. Lê Văn C - Nghệ sĩ\n\n## Speakers đang liên hệ\n- Phạm Thị D - Nhà hoạt động xã hội\n- Hoàng Văn E - Giáo sư đại học",
            type: 'document',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: "doc-3",
            title: "Ghi chú meeting",
            content: "# Ghi chú meeting ngày 15/01/2025\n\n## Thành viên tham dự\n- Mentor: Trần Thị Mentor\n- Student: Nguyễn Văn Student\n\n## Nội dung thảo luận\n- Review kế hoạch tổng thể\n- Thảo luận về speakers\n- Timeline chi tiết\n\n## Action items\n- [ ] Liên hệ thêm 2 speakers\n- [ ] Chuẩn bị proposal cho sponsors\n- [ ] Tạo landing page cho sự kiện",
            type: 'note',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ]

        const mockTasks: Task[] = [
          {
            id: "task-1",
            title: "Liên hệ speakers",
            description: "Gửi email mời speakers tham gia sự kiện",
            completed: true,
            dueDate: "2025-01-20",
            priority: 'high',
            createdAt: new Date().toISOString()
          },
          {
            id: "task-2",
            title: "Tìm venue",
            description: "Tìm và đặt chỗ cho sự kiện",
            completed: false,
            dueDate: "2025-01-25",
            priority: 'high',
            createdAt: new Date().toISOString()
          },
          {
            id: "task-3",
            title: "Thiết kế poster",
            description: "Thiết kế poster quảng bá sự kiện",
            completed: false,
            dueDate: "2025-02-01",
            priority: 'medium',
            createdAt: new Date().toISOString()
          },
          {
            id: "task-4",
            title: "Chuẩn bị tài liệu",
            description: "Chuẩn bị tài liệu cho speakers",
            completed: false,
            dueDate: "2025-02-05",
            priority: 'low',
            createdAt: new Date().toISOString()
          }
        ]

        setWorkspace(mockWorkspace)
        setDocuments(mockDocuments)
        setTasks(mockTasks)
        
        if (mockDocuments.length > 0) {
          setCurrentDocument(mockDocuments[0])
          setDocumentContent(mockDocuments[0].content)
        }
      } catch (error) {
        toast.error("Lỗi khi tải workspace")
        router.push("/dashboard")
      } finally {
        setLoading(false)
      }
    }

    loadWorkspace()
  }, [params.id, status, router])

  const saveDocument = async () => {
    if (!currentDocument) return

    setSaving(true)
    try {
      // Mock save
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setDocuments(prev => 
        prev.map(doc => 
          doc.id === currentDocument.id 
            ? { ...doc, content: documentContent, updatedAt: new Date().toISOString() }
            : doc
        )
      )
      
      toast.success("Đã lưu tài liệu")
    } catch (error) {
      toast.error("Lỗi khi lưu tài liệu")
    } finally {
      setSaving(false)
    }
  }

  const toggleTask = (taskId: string) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === taskId 
          ? { ...task, completed: !task.completed }
          : task
      )
    )
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'low':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'Cao'
      case 'medium':
        return 'Trung bình'
      case 'low':
        return 'Thấp'
      default:
        return priority
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN')
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (status === "unauthenticated" || !workspace) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="tedx-gradient text-white py-16">
          <div className="container">
            <div className="flex items-center gap-4 mb-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Quay lại Dashboard
                </Link>
              </Button>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{workspace.name}</h1>
            <p className="text-xl text-red-50 max-w-2xl">
              {workspace.description}
            </p>
          </div>
        </div>

        <div className="container py-12">
          {/* Workspace Info */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <Target className="h-8 w-8 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Tiến độ</p>
                    <p className="text-2xl font-bold">{workspace.progress}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Tài liệu</p>
                    <p className="text-2xl font-bold">{documents.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <CheckSquare className="h-8 w-8 text-green-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Nhiệm vụ</p>
                    <p className="text-2xl font-bold">{tasks.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <Clock className="h-8 w-8 text-orange-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Cập nhật</p>
                    <p className="text-sm font-bold">{formatDate(workspace.updatedAt)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="documents" className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="documents">Tài liệu</TabsTrigger>
              <TabsTrigger value="tasks">Nhiệm vụ</TabsTrigger>
              <TabsTrigger value="progress">Tiến độ</TabsTrigger>
            </TabsList>

            <TabsContent value="documents" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Document List */}
                <div className="lg:col-span-1">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Folder className="h-5 w-5" />
                        Tài liệu
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {documents.map(doc => (
                        <div
                          key={doc.id}
                          className={`p-3 border rounded-lg cursor-pointer hover:bg-muted transition-colors ${
                            currentDocument?.id === doc.id ? 'bg-primary/5 border-primary' : ''
                          }`}
                          onClick={() => {
                            setCurrentDocument(doc)
                            setDocumentContent(doc.content)
                          }}
                        >
                          <h4 className="font-medium">{doc.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {doc.type === 'document' ? 'Tài liệu' : 'Ghi chú'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(doc.updatedAt)}
                          </p>
                        </div>
                      ))}
                      
                      <Button variant="outline" className="w-full mt-4">
                        <Plus className="h-4 w-4 mr-2" />
                        Tạo tài liệu mới
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {/* Document Editor */}
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>{currentDocument?.title || 'Chọn tài liệu'}</CardTitle>
                          <CardDescription>
                            {currentDocument ? 'Chỉnh sửa nội dung tài liệu' : 'Chọn một tài liệu để chỉnh sửa'}
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Upload className="h-4 w-4 mr-2" />
                            Import
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Export
                          </Button>
                          <Button 
                            size="sm" 
                            onClick={saveDocument}
                            disabled={saving || !currentDocument}
                          >
                            <Save className="h-4 w-4 mr-2" />
                            {saving ? 'Đang lưu...' : 'Lưu'}
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {currentDocument ? (
                        <div className="space-y-4">
                          <Input
                            value={currentDocument.title}
                            onChange={(e) => setCurrentDocument(prev => 
                              prev ? { ...prev, title: e.target.value } : null
                            )}
                            className="text-lg font-medium"
                          />
                          <textarea
                            value={documentContent}
                            onChange={(e) => setDocumentContent(e.target.value)}
                            className="w-full h-96 p-4 border rounded-lg font-mono text-sm"
                            placeholder="Nhập nội dung tài liệu..."
                          />
                        </div>
                      ) : (
                        <div className="h-96 flex items-center justify-center border rounded-lg bg-muted/50">
                          <div className="text-center">
                            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground">Chọn một tài liệu để bắt đầu chỉnh sửa</p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="tasks" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckSquare className="h-5 w-5" />
                    Nhiệm vụ
                  </CardTitle>
                  <CardDescription>
                    Quản lý các nhiệm vụ trong dự án
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {tasks.map(task => (
                      <div key={task.id} className="flex items-center gap-4 p-4 border rounded-lg">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => toggleTask(task.id)}
                          className="h-5 w-5"
                        />
                        <div className="flex-1">
                          <h4 className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                            {task.title}
                          </h4>
                          <p className="text-sm text-muted-foreground">{task.description}</p>
                          {task.dueDate && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Hạn: {formatDate(task.dueDate)}
                            </p>
                          )}
                        </div>
                        <Badge className={getPriorityColor(task.priority)}>
                          {getPriorityText(task.priority)}
                        </Badge>
                      </div>
                    ))}
                    
                    <Button variant="outline" className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Thêm nhiệm vụ mới
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="progress" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Tiến độ dự án
                  </CardTitle>
                  <CardDescription>
                    Theo dõi tiến độ hoàn thành dự án
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Tiến độ tổng thể</span>
                        <span className="text-sm text-muted-foreground">{workspace.progress}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-3">
                        <div 
                          className="bg-primary h-3 rounded-full transition-all duration-300"
                          style={{ width: `${workspace.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <h4 className="font-medium">Nhiệm vụ đã hoàn thành</h4>
                        <div className="text-3xl font-bold text-green-600">
                          {tasks.filter(t => t.completed).length}/{tasks.length}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {tasks.length > 0 ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100) : 0}% hoàn thành
                        </p>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-medium">Tài liệu đã tạo</h4>
                        <div className="text-3xl font-bold text-blue-600">
                          {documents.length}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Tài liệu và ghi chú
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-medium">Các mốc quan trọng</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <div>
                            <p className="font-medium text-green-800">Lập kế hoạch tổng thể</p>
                            <p className="text-sm text-green-600">Hoàn thành ngày 10/01/2025</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <div>
                            <p className="font-medium text-blue-800">Tìm speakers</p>
                            <p className="text-sm text-blue-600">Đang thực hiện - 70% hoàn thành</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                          <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                          <div>
                            <p className="font-medium text-gray-600">Marketing campaign</p>
                            <p className="text-sm text-gray-500">Chưa bắt đầu</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  )
}



