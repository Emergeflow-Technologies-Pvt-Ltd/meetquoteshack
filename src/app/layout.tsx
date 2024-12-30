import { Inter, Bricolage_Grotesque } from "next/font/google";
import { Navbar } from "@/components/layout/navbar";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { cn } from "@/lib/utils";
import "./globals.css";
import { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";

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

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background",
          inter.className,
          bricolageGrotesque.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          {children}
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
};

export default Layout;
