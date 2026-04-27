import { Inter, Bricolage_Grotesque } from "next/font/google"
import { Navbar } from "@/components/layout/navbar"
// import { ThemeProvider } from "@/components/layout/theme-provider";
import { cn } from "@/lib/utils"
import "./globals.css"
import { Metadata } from "next"
import { Toaster } from "@/components/ui/toaster"
import Providers from "./providers"
import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import GoogleAds from "./GoogleAds"

const inter = Inter({ subsets: ["latin"] })
const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--bricolage-grotesque",
})

interface LayoutProps {
  children: React.ReactNode
}

export const metadata: Metadata = {
  title:
    "Intelligent Quick Loan Matching for Borrowers and Lenders | QuoteShack",
  description:
    "QuoteShack uses the power of AI to connect borrowers to top-rated lenders and streamline the loan application and approval process.",
}

const Layout: React.FC<LayoutProps> = async ({ children }) => {
  const session = await getServerSession(authOptions)
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "light min-h-screen bg-background",
          inter.className,
          bricolageGrotesque.variable
        )}
      >
        <GoogleAds />
        <Providers>
          {/* <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          > */}
          <Navbar session={session} />
          {children}
          {/* </ThemeProvider> */}
          <Toaster />
          <Analytics />
          <SpeedInsights />
        </Providers>
        {/* <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-18021878462"
          strategy="afterInteractive"
        />
        <Script id="google-ads">
          {`
    console.log("ADS LOADED");

    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'AW-18021878462');
  `}
        </Script> */}
      </body>
    </html>
  )
}

export default Layout
