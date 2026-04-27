"use client"

import Script from "next/script"

const GA_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID

export default function GoogleAds() {
  if (!GA_ID) return null

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-ads">
        {`
          console.log("ADS Loadinggg");

          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
        `}
      </Script>
    </>
  )
}
