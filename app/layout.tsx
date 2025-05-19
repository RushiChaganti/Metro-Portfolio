import type React from "react"
import type { Metadata } from "next"
import { getImagePath } from "@/lib/utils";
import "./globals.css"

export const metadata: Metadata = {
  title: "Rushi Chaganti - Portfolio",
  description: "Created with ❤️ by Rushi Chaganti",
  icons: {
    icon: getImagePath('/logo.png')
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}
