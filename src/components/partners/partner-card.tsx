"use client"

import { Organization } from "@prisma/client"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Building2, Users, Calendar } from "lucide-react"

type OrganizationWithCounts = Organization & {
  _count: {
    members: number
    events: number
    products: number
  }
}

export function PartnerCard({ organization }: { organization: OrganizationWithCounts }) {
  const typeColors = {
    VIP: "default",
    STANDARD: "secondary",
    SPONSOR: "outline",
  } as const

  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center justify-center w-16 h-16 rounded-lg bg-primary/10 text-primary">
            <Building2 className="h-8 w-8" />
          </div>
          <Badge variant={typeColors[organization.type]}>
            {organization.type}
          </Badge>
        </div>
        <h3 className="font-bold text-xl line-clamp-2">{organization.name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-3">
          {organization.description || "Tổ chức TEDx"}
        </p>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>{organization._count.members} thành viên</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{organization._count.events} sự kiện</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" asChild>
          <Link href={`/partners/${organization.id}`}>Xem chi tiết</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}


