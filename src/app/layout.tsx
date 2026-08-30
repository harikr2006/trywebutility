import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import AdPanel from "@/components/layout/AdPanel";
import Footer from "@/components/layout/Footer";
import { TooltipProvider } from "@/components/ui/tooltip";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "WebUtility — Free Developer & Tech Tools",
    template: "%s | WebUtility",
  },
  description:
    "65+ free browser-based developer tools. JSON formatter, regex tester, Base64 encoder, color contrast checker, unit converter, and many more. No sign-up required, no data leaves your browser.",
  keywords: [
    "developer tools", "online tools", "JSON formatter", "base64 encoder",
    "regex tester", "URL encoder", "JWT decoder", "CSS formatter",
    "color converter", "unit converter", "free web tools", "web utilities",
  ],
  openGraph: {
    title: "WebUtility — Free Developer & Tech Tools",
    description:
      "65+ free browser-based developer tools. No sign-up, no tracking, no data leaves your browser.",
    type: "website",
    siteName: "WebUtility",
  },
  twitter: {
    card: "summary_large_image",
    title: "WebUtility — Free Developer & Tech Tools",
    description:
      "65+ free browser-based developer tools. No sign-up, no tracking, no data leaves your browser.",
  },
  robots: { index: true, follow: true },
  metadataBase: new URL("https://trywebutility.vercel.app"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Prevent flash of unstyled dark/light mode */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme:dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})();`,
          }}
        />
        {/* Google Tag Manager — replace GTM-WM427DJR with your container ID */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-WM427DJR');`,
          }}
        />
      </head>
      <body className={`${inter.variable} ${jetbrainsMono.variable} antialiased font-sans`}>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-WM427DJR"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* Skip navigation — WCAG 2.4.1 */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:text-sm focus:font-medium focus:shadow-lg"
        >
          Skip to main content
        </a>
        <TooltipProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <div className="flex flex-1">
              <Sidebar />
              <main id="main-content" className="flex-1 min-w-0 overflow-auto" tabIndex={-1}>
                {children}
              </main>
              <AdPanel />
            </div>
            <Footer />
          </div>
        </TooltipProvider>
      </body>
    </html>
  );
}
