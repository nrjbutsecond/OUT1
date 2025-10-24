# TON Platform - TEDx Organizer Network

## 🚀 **Hướng Dẫn Chạy Dự Án**

### **Yêu Cầu Hệ Thống**
- Node.js 18+ 
- npm hoặc yarn
- Git

### **Cài Đặt**

1. **Clone repository:**
```bash
git clone https://github.com/TEDx-Organizer-Network/WED_TON.git
cd TON
```

2. **Cài đặt dependencies:**
```bash
npm install
```

3. **Cấu hình environment:**
```bash
cp .env.example .env
```

4. **Cấu hình database:**
```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

5. **Chạy development server:**
```bash
npm run dev
```

6. **Truy cập ứng dụng:**
```
http://localhost:3000
```

## 🔑 **Tài Khoản Test**

### **ADMIN**
```
Email: admin@ton-platform.vn
Password: admin123
```

### **PARTNER** 
```
Email: partner@ton-platform.vn
Password: partner123
```

### **USER**
```
Email: user@ton-platform.vn
Password: user123
```

### **MENTOR**
```
Email: mentor@ton-platform.vn
Password: mentor123
```

## 📋 **Tính Năng Chính**

### **🏠 Trang Chủ**
- Hero section với gradient đỏ-đen
- Services showcase
- Featured events
- Partner organizations
- Statistics

### **🔐 Authentication**
- Email/Password login
- Email verification
- Role-based access control
- Password reset

### **👥 User Roles**

#### **ADMIN Dashboard:**
- Tổng quan platform
- Quản lý người dùng
- Quản lý tổ chức
- Quản lý dịch vụ
- Quản lý sự kiện
- Quản lý sản phẩm
- Quản lý đơn hàng
- Quản lý Mentor

#### **PARTNER Dashboard:**
- Tổng quan
- Thành viên
- Sự kiện
- Sản phẩm
- Đơn hàng

#### **USER Dashboard:**
- Tổng quan
- Hồ sơ cá nhân
- Đơn hàng
- Học tập

#### **MENTOR Dashboard:**
- Tổng quan
- Lịch dạy
- Học viên
- Tài liệu

### **🛍️ Services**
- Browse services
- Service details
- Purchase flow
- Payment integration

### **🎫 Events**
- Event listing
- Event details
- Ticket purchase
- Calendar integration

### **🛒 Merchandise**
- Product catalog
- Shopping cart
- Checkout process
- Order management

### **📅 Calendar**
- Google Calendar-like interface
- Event filtering
- Personal schedule
- Event creation

### **🔔 Notifications**
- Real-time notifications
- Unread count
- Notification management

### **🌐 Multi-language**
- English/Vietnamese toggle
- Dynamic content translation

## 🛠️ **Tech Stack**

- **Frontend:** Next.js 14, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes, Prisma ORM
- **Database:** SQLite (dev), PostgreSQL (prod)
- **Authentication:** NextAuth.js
- **UI Components:** shadcn/ui
- **Styling:** Tailwind CSS + CSS Variables
- **Email:** Resend
- **File Upload:** Uploadthing

## 📁 **Cấu Trúc Dự Án**

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth pages
│   ├── dashboard/         # Dashboard pages
│   ├── services/          # Services pages
│   ├── events/            # Events pages
│   ├── partners/          # Partners pages
│   └── api/               # API routes
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── layout/           # Layout components
│   └── dashboard/        # Dashboard components
├── lib/                  # Utilities
├── contexts/             # React contexts
└── prisma/               # Database schema & seed
```

## 🎨 **Design System**

### **Color Palette**
- **Primary Red:** `#FF2B06`
- **Dark Background:** `#0a0a0a`
- **Card Background:** `#1a1a1a`
- **Text Dark:** `#1a1a1a`
- **Text Light:** `#ffffff`

### **Typography**
- **Font Family:** System fonts (Inter, -apple-system, BlinkMacSystemFont)
- **Headings:** Bold weights
- **Body:** Regular weights

### **Components**
- Glass-morphism effects
- Smooth transitions
- Hover animations
- Modern shadows

## 🚀 **Deployment**

### **Vercel (Recommended)**
1. Connect GitHub repository
2. Set environment variables
3. Deploy automatically

### **Manual Deployment**
1. Build project: `npm run build`
2. Start production: `npm start`

## 🐛 **Troubleshooting**

### **Database Issues**
```bash
npx prisma db push --force-reset
npx prisma db seed
```

### **Build Issues**
```bash
rm -rf .next
npm run build
```

### **Dependencies Issues**
```bash
rm -rf node_modules package-lock.json
npm install
```

## 📞 **Support**

Nếu gặp vấn đề, hãy:
1. Kiểm tra terminal logs
2. Xem browser console
3. Kiểm tra database connection
4. Verify environment variables

## 🎯 **Features Status**

✅ **Completed:**
- Authentication system
- Role-based dashboards
- Services management
- Events management
- Products management
- Calendar integration
- Notification system
- Multi-language support
- Payment flow
- Admin panel

🔄 **In Progress:**
- Advanced analytics
- Email templates
- File upload system

📋 **Planned:**
- Mobile app
- Advanced reporting
- API documentation
- Testing suite

---

**TON Platform** - Connecting and enhancing the quality of TEDx events worldwide.
