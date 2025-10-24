"use client"

export function AnalyticsChart({ type }: { type: "users" | "revenue" }) {
  return (
    <div className="h-[300px] flex items-center justify-center bg-muted/50 rounded-lg">
      <p className="text-muted-foreground text-sm">
        Biểu đồ {type === "users" ? "người dùng" : "doanh thu"} (Recharts sẽ được tích hợp)
      </p>
    </div>
  )
}


