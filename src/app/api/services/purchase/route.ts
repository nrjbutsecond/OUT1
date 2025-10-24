import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: "Bạn cần đăng nhập để đăng ký dịch vụ" },
        { status: 401 }
      )
    }

    const { serviceId } = await req.json()

    if (!serviceId) {
      return NextResponse.json(
        { error: "Service ID là bắt buộc" },
        { status: 400 }
      )
    }

    // Check if service exists
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
    })

    if (!service || !service.approved) {
      return NextResponse.json(
        { error: "Dịch vụ không tồn tại" },
        { status: 404 }
      )
    }

    // Check if user already purchased
    const existingPurchase = await prisma.servicePurchase.findFirst({
      where: {
        userId: session.user.id,
        serviceId,
      },
    })

    if (existingPurchase) {
      return NextResponse.json(
        { error: "Bạn đã đăng ký dịch vụ này rồi" },
        { status: 400 }
      )
    }

    // Create workspace for the service
    const workspace = await prisma.workspace.create({
      data: {
        name: `Workspace - ${service.name}`,
        type: "SERVICE",
        ownerId: session.user.id,
      },
    })

    // Create service purchase
    const purchase = await prisma.servicePurchase.create({
      data: {
        userId: session.user.id,
        serviceId,
        workspaceId: workspace.id,
        status: "active",
      },
    })

    // Create notification
    await prisma.notification.create({
      data: {
        userId: session.user.id,
        type: "SYSTEM",
        title: "Đăng ký dịch vụ thành công",
        content: `Bạn đã đăng ký dịch vụ "${service.name}" thành công. Workspace đã được tạo.`,
      },
    })

    return NextResponse.json({
      success: true,
      purchase,
      workspaceId: workspace.id,
    })
  } catch (error) {
    console.error("Service purchase error:", error)
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi đăng ký dịch vụ" },
      { status: 500 }
    )
  }
}


