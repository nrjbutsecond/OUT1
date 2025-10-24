import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Package, Search, Plus, Edit, Trash2, Eye, CheckCircle, XCircle } from "lucide-react"

export default async function AdminProductsPage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "ADMIN") {
    redirect("/login")
  }

  const products = await prisma.product.findMany({
    include: {
      organization: true,
      cartItems: true,
      orderItems: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  const getStatusBadgeVariant = (approved: boolean) => {
    return approved ? "default" : "secondary"
  }

  const getStockBadgeVariant = (stock: number) => {
    if (stock === 0) return "destructive"
    if (stock < 10) return "secondary"
    return "default"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Products Management</h1>
          <p className="text-muted-foreground">
            Manage all products in the platform
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Package className="h-8 w-8 text-primary" />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tổng quan</CardTitle>
          <CardDescription>
            Thống kê sản phẩm theo trạng thái và tồn kho
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-primary">{products.length}</div>
              <div className="text-sm text-muted-foreground">Tổng sản phẩm</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {products.filter((p: { approved: boolean }) => p.approved).length}
              </div>
              <div className="text-sm text-muted-foreground">Đã duyệt</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {products.filter((p: { approved: boolean }) => !p.approved).length}
              </div>
              <div className="text-sm text-muted-foreground">Chờ duyệt</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {products.filter((p: { stock: number }) => p.stock === 0).length}
              </div>
              <div className="text-sm text-muted-foreground">Hết hàng</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách sản phẩm</CardTitle>
          <CardDescription>
            Tìm kiếm và quản lý sản phẩm
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm theo tên sản phẩm..."
                  className="pl-10"
                />
              </div>
            </div>
            <Button className="bg-red-600 hover:bg-red-700">
              <Plus className="h-4 w-4 mr-2" />
              Thêm sản phẩm
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên sản phẩm</TableHead>
                <TableHead>Tổ chức</TableHead>
                <TableHead>Danh mục</TableHead>
                <TableHead>Giá</TableHead>
                <TableHead>Tồn kho</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Đã bán</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead>Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product: typeof products[number]) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>
                    {product.organization?.name || "TON Platform"}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{product.category || "N/A"}</Badge>
                  </TableCell>
                  <TableCell>
                    ₫{product.price.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStockBadgeVariant(product.stock)}>
                      {product.stock}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(product.approved)}>
                      {product.approved ? (
                        <>
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Đã duyệt
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3 mr-1" />
                          Chờ duyệt
                        </>
                      )}
                    </Badge>
                  </TableCell>
                  <TableCell>{product.orderItems.length}</TableCell>
                  <TableCell>
                    {new Date(product.createdAt).toLocaleDateString("vi-VN")}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      {!product.approved && (
                        <Button variant="ghost" size="sm" className="text-green-600">
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}