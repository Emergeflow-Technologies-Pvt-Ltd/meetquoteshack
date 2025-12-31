// src\app\(site)\loanee\start\page.tsx
import PaywallClient from "@/components/shared/PaywallClient";

export default function LoaneeStartPage() {
  return <PaywallClient initialMode="chooser" />;
}
