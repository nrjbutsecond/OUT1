import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold text-lg">
                TON
              </div>
              <span className="font-bold">TEDx Organizer Network</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Kết nối và nâng cao chất lượng các sự kiện TEDx tại Việt Nam
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Dịch vụ</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/services" className="text-muted-foreground hover:text-foreground transition-colors">
                  Tất cả dịch vụ
                </Link>
              </li>
              <li>
                <Link href="/services?category=consulting" className="text-muted-foreground hover:text-foreground transition-colors">
                  Tư vấn sự kiện
                </Link>
              </li>
              <li>
                <Link href="/services?category=training" className="text-muted-foreground hover:text-foreground transition-colors">
                  Đào tạo
                </Link>
              </li>
              <li>
                <Link href="/services?category=mentoring" className="text-muted-foreground hover:text-foreground transition-colors">
                  Mentor
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Về chúng tôi</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                  Giới thiệu
                </Link>
              </li>
              <li>
                <Link href="/partners" className="text-muted-foreground hover:text-foreground transition-colors">
                  Đối tác
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-muted-foreground hover:text-foreground transition-colors">
                  Sự kiện
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                  Liên hệ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Theo dõi chúng tôi</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Facebook
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  TikTok
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Instagram
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  YouTube
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} TEDx Organizer Network. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}


