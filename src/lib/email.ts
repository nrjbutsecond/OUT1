import { Resend } from 'resend'

// Initialize Resend with API key from environment (optional in dev)
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export async function sendVerificationEmail(email: string, token: string) {
  const verificationUrl = `${process.env.NEXTAUTH_URL}/verify-email?token=${token}`
  
  try {
    // If no API key, log to console (development mode)
    if (!resend) {
      console.log('📧 Verification email (mock):', {
        to: email,
        subject: 'Xác thực email - TON Platform',
        verificationUrl
      })
      return { success: true, mock: true }
    }

    const data = await resend.emails.send({
      from: 'TON Platform <onboarding@resend.dev>', // Update with your domain
      to: email,
      subject: 'Xác thực email - TON Platform',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Chào mừng đến với TEDx Organizer Network!</h2>
          <p>Vui lòng xác thực email của bạn bằng cách nhấn vào nút bên dưới:</p>
          <a href="${verificationUrl}" style="display: inline-block; background-color: #FF2B06; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0;">
            Xác thực Email
          </a>
          <p>Hoặc sao chép link sau vào trình duyệt:</p>
          <p style="color: #666; word-break: break-all;">${verificationUrl}</p>
          <p style="color: #999; font-size: 12px; margin-top: 30px;">
            Nếu bạn không tạo tài khoản này, vui lòng bỏ qua email này.
          </p>
        </div>
      `
    })

    return { success: true, data }
  } catch (error) {
    console.error('Failed to send verification email:', error)
    return { success: false, error }
  }
}

export async function sendOrderConfirmation(
  email: string,
  orderDetails: {
    orderId: string
    items: Array<{ name: string; quantity: number; price: number }>
    total: number
    qrCode?: string
  }
) {
  try {
    if (!resend) {
      console.log('📧 Order confirmation email (mock):', {
        to: email,
        orderDetails
      })
      return { success: true, mock: true }
    }

    const itemsHtml = orderDetails.items.map(item => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.name}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}</td>
      </tr>
    `).join('')

    const data = await resend.emails.send({
      from: 'TON Platform <orders@resend.dev>',
      to: email,
      subject: `Xác nhận đơn hàng #${orderDetails.orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Cảm ơn bạn đã đặt hàng!</h2>
          <p>Mã đơn hàng: <strong>#${orderDetails.orderId}</strong></p>
          
          <table style="width: 100%; margin: 20px 0; border-collapse: collapse;">
            <thead>
              <tr style="background-color: #f5f5f5;">
                <th style="padding: 12px; text-align: left;">Sản phẩm</th>
                <th style="padding: 12px; text-align: center;">Số lượng</th>
                <th style="padding: 12px; text-align: right;">Giá</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2" style="padding: 12px; text-align: right; font-weight: bold;">Tổng cộng:</td>
                <td style="padding: 12px; text-align: right; font-weight: bold; color: #FF2B06;">
                  ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(orderDetails.total)}
                </td>
              </tr>
            </tfoot>
          </table>

          ${orderDetails.qrCode ? `
            <div style="margin: 30px 0; text-align: center;">
              <p><strong>Mã QR vé của bạn:</strong></p>
              <img src="${orderDetails.qrCode}" alt="QR Code" style="max-width: 200px;" />
            </div>
          ` : ''}

          <p style="color: #999; font-size: 12px; margin-top: 30px;">
            Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi.
          </p>
        </div>
      `
    })

    return { success: true, data }
  } catch (error) {
    console.error('Failed to send order confirmation:', error)
    return { success: false, error }
  }
}

export async function sendNotificationEmail(
  email: string,
  notification: {
    title: string
    content: string
  }
) {
  try {
    if (!resend) {
      console.log('📧 Notification email (mock):', {
        to: email,
        notification
      })
      return { success: true, mock: true }
    }

    const data = await resend.emails.send({
      from: 'TON Platform <notifications@resend.dev>',
      to: email,
      subject: notification.title,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>${notification.title}</h2>
          <p>${notification.content}</p>
        </div>
      `
    })

    return { success: true, data }
  } catch (error) {
    console.error('Failed to send notification email:', error)
    return { success: false, error }
  }
}

