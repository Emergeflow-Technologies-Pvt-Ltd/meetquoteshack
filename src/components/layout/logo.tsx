import Link from "next/link";
import React from "react";
import QuoteshackLogo from "../assets/quoteshack-logo.svg";
import Image from "next/image";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center font-bold">
      <Image src={QuoteshackLogo} alt="logo" width={150} height={40} />
    </Link>
  );
}
