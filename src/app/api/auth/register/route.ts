import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { sendVerificationEmail } from "@/lib/email"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      email,
      password,
      name,
      phone,
      currentRole,
      organization,
      roleAtOrg,
    } = body

    // Validate required fields
    if (!email || !password || !name || !phone || !currentRole || !organization || !roleAtOrg) {
      return NextResponse.json(
        { error: "Tất cả các trường đều bắt buộc" },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "Email đã được sử dụng" },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        phone,
        currentRole: currentRole as "STUDENT" | "UNIVERSITY_STUDENT" | "TEACHER" | "EMPLOYEE",
        organization,
        roleAtOrg,
        emailVerified: null, // Will be set after email verification
      }
    })

    // Create verification token
    const token = crypto.randomUUID()
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires,
      }
    })

    // Send verification email
    await sendVerificationEmail(email, token)

    return NextResponse.json({
      success: true,
      message: "Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.",
      userId: user.id,
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi đăng ký" },
      { status: 500 }
    )
  }
}


