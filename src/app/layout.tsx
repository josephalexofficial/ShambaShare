import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { MarketingShell } from "@/components/layout/MarketingShell";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { ShambaAssistant } from "@/components/assistant/ShambaAssistant";
import { SITE } from "@/lib/constants";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${SITE.name} — Climate-smart tools`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="site-shell flex min-h-full flex-col font-sans antialiased">
        <AuthProvider>
          <MarketingShell>{children}</MarketingShell>
          <ShambaAssistant />
        </AuthProvider>
      </body>
    </html>
  );
}
