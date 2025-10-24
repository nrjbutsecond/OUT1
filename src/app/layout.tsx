import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "@/components/providers";
import { AppProvider } from "@/contexts/app-context";

export const metadata: Metadata = {
  title: "TON - TEDx Organizer Network",
  description: "Connecting and enhancing the quality of TEDx events",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <Providers>
          <AppProvider>
            {children}
            <Toaster />
          </AppProvider>
        </Providers>
      </body>
    </html>
  );
}
