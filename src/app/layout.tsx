import { Inter, Bricolage_Grotesque } from "next/font/google";
import { Navbar } from "@/components/layout/navbar";
// import { ThemeProvider } from "@/components/layout/theme-provider";
import { cn } from "@/lib/utils";
import "./globals.css";
import { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";
import Providers from "./providers";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"

const inter = Inter({ subsets: ["latin"] });
const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--bricolage-grotesque",
});

interface LayoutProps {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  title: "Quoteshack",
  description:
    "Quick and Easy Loans. Apply for your loan with ease and get quick approvals. Secure and reliable loan application process.",
};

const Layout: React.FC<LayoutProps> = async ({ children }) => {
  const session = await getServerSession(authOptions);
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background light",
          inter.className,
          bricolageGrotesque.variable
        )}
      >
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
      </body>
    </html>
  );
};

export default Layout;
