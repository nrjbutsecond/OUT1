import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Users, Calendar, Package, ShoppingBag } from "lucide-react"

export default async function PartnerMembersPage() {
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
      members: {
        include: {
          user: true
        }
      }
    }
  })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Thành viên tổ chức</h1>
        <p className="text-muted-foreground">
          Quản lý thành viên của tổ chức {organization?.name}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Danh sách thành viên
          </CardTitle>
          <CardDescription>
            Tổng cộng {organization?.members.length || 0} thành viên
          </CardDescription>
        </CardHeader>
        <CardContent>
          {organization?.members.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Chưa có thành viên nào</p>
              <Button asChild className="mt-4">
                <Link href="/dashboard/partner">
                  Quay về Dashboard
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {organization?.members.map((member) => (
                <div key={member.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{member.user.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {member.user.email}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Vai trò: {member.role}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">
                        {member.approved ? "Đã duyệt" : "Chờ duyệt"}
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
