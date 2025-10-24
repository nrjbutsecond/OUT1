import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get("token")

    if (!token) {
      return NextResponse.json(
        { error: "Token không hợp lệ" },
        { status: 400 }
      )
    }

    // Find verification token
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token }
    })

    if (!verificationToken) {
      return NextResponse.json(
        { error: "Token không tồn tại hoặc đã được sử dụng" },
        { status: 400 }
      )
    }

    // Check if token expired
    if (verificationToken.expires < new Date()) {
      await prisma.verificationToken.delete({
        where: { token }
      })
      return NextResponse.json(
        { error: "Token đã hết hạn" },
        { status: 400 }
      )
    }

    // Update user email verification
    await prisma.user.update({
      where: { email: verificationToken.identifier },
      data: { emailVerified: new Date() }
    })

    // Delete used token
    await prisma.verificationToken.delete({
      where: { token }
    })

    return NextResponse.json({
      success: true,
      message: "Email đã được xác thực thành công! Bạn có thể đăng nhập ngay bây giờ.",
    })
  } catch (error) {
    console.error("Email verification error:", error)
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi xác thực email" },
      { status: 500 }
    )
  }
}


