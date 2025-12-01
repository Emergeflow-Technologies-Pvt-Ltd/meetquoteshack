interface RouteProps {
  href: string;
  label: string;
}

export const routeList: RouteProps[] = [
  {
    href: "/loanee",
    label: "For Loanee",
  },
  {
    href: "/lender",
    label: "For Lenders",
  },
  {
    href: "/agent",
    label: "For Agents",
  },
];
