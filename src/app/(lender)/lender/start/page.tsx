// src/app/lender/start/page.tsx
import PaywallClient from "@/components/shared/PaywallClient";

export default function LenderStartPage() {
  return <PaywallClient initialMode="chooser" />;
}
