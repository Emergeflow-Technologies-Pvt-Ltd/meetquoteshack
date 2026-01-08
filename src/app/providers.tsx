"use client";

import { SessionProvider } from "next-auth/react";
import Script from "next/script";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <>
        {children}
        <Script
          id="tawkto"
          strategy="afterInteractive"
          src="https://embed.tawk.to/681984ce5510d619105dcd59/1iqhqthvs"
        />
      </>
    </SessionProvider>
  );
}
