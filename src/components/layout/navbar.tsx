"use client";

import { Menu } from "lucide-react";
import React from "react";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Separator } from "../ui/separator";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "../ui/navigation-menu";
import { Button } from "../ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
// import { ToggleTheme } from "./toggle-theme";
import Logo from "./logo";
import { routeList } from "@/data/navbar";
import { Session } from "next-auth";
import { signIn, signOut } from "next-auth/react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { UserRole } from "@prisma/client";

export const Navbar = ({ session }: { session: Session | null }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const userRole = session?.user?.role;

  return (
    <header className="sticky top-2 lg:top-5 z-40">
      <div className="container mx-auto">
        <div className="bg-opacity-15 border rounded-2xl flex justify-between items-center p-2 bg-background/70 backdrop-blur-sm">
          <Logo />
          {/* <!-- Mobile --> */}
          <div className="flex items-center lg:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Menu
                  onClick={() => setIsOpen(!isOpen)}
                  className="cursor-pointer lg:hidden"
                />
              </SheetTrigger>

              <SheetContent
                side="left"
                className="flex flex-col justify-between rounded-tr-2xl rounded-br-2xl bg-card border-secondary"
              >
                <div>
                  <SheetHeader className="mb-4 ml-4">
                    <SheetTitle className="flex items-center">
                      <Logo />
                    </SheetTitle>
                  </SheetHeader>

                  <div className="flex flex-col gap-2">
                    {routeList.map(({ href, label }) => (
                      <Button
                        key={href}
                        onClick={() => setIsOpen(false)}
                        asChild
                        variant="ghost"
                        className="justify-start text-base"
                      >
                        <Link href={href}>{label}</Link>
                      </Button>
                    ))}
                    
                    {session ? (
                      <>
                        {userRole === UserRole.LOANEE && (
                          <Button
                            onClick={() => setIsOpen(false)}
                            asChild
                            variant="ghost"
                            className="justify-start text-base"
                          >
                            <Link href="/applications">My Applications</Link>
                          </Button>
                        )}
                        {userRole === UserRole.LENDER && (
                          <Button
                            onClick={() => setIsOpen(false)}
                            asChild
                            variant="ghost"
                            className="justify-start text-base"
                          >
                            <Link href="/lender/dashboard">Lender Dashboard</Link>
                          </Button>
                        )}
                        {userRole === UserRole.ADMIN && (
                          <Button
                            onClick={() => setIsOpen(false)}
                            asChild
                            variant="ghost"
                            className="justify-start text-base"
                          >
                            <Link href="/admin">Admin Dashboard</Link>
                          </Button>
                        )}
                        <Button
                          onClick={() => setIsOpen(false)}
                          asChild
                          variant="ghost"
                          className="justify-start text-base"
                        >
                          <Link href="/profile">Profile</Link>
                        </Button>
                        <Button
                          onClick={() => {
                            signOut();
                            setIsOpen(false);
                          }}
                          variant="ghost"
                          className="justify-start text-base"
                        >
                          Log out
                        </Button>
                      </>
                    ) : (
                      <Button
                        onClick={() => {
                          signIn('google');
                          setIsOpen(false);
                        }}
                        variant="default"
                        className="justify-start text-base mt-2"
                      >
                        Login
                      </Button>
                    )}
                  </div>
                </div>

                <SheetFooter className="flex-col sm:flex-col justify-start items-start">
                  <Separator className="mb-2" />
                  {/* <ToggleTheme /> */}
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
          {/* <!-- Desktop --> */}
          <NavigationMenu className="hidden lg:block mx-auto">
            <NavigationMenuList className="space-x-0">
              <NavigationMenuItem>
                {routeList.map(({ href, label }) => (
                  <NavigationMenuLink
                    key={href}
                    asChild
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "!bg-transparent"
                    )}
                  >
                    <Link href={href}>{label}</Link>
                  </NavigationMenuLink>
                ))}
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <div className="hidden lg:flex items-center gap-2">
            {/* <ToggleTheme /> */}
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full border-2 border-violet-500">
                    <Avatar className="h-8 w-8 rounded-full ring-2 ring-violet-500">
                      <AvatarImage src={session.user?.image ?? ""} alt={session.user?.name ?? ""} className="rounded-full" />
                      <AvatarFallback className="rounded-full">{session.user?.name?.[0]}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{session.user?.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {session.user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {userRole === UserRole.LOANEE && (
                    <DropdownMenuItem asChild>
                      <Link href="/applications">My Applications</Link>
                    </DropdownMenuItem>
                  )}
                  {userRole === UserRole.LENDER && (
                    <DropdownMenuItem asChild>
                      <Link href="/lender/dashboard">Lender Dashboard</Link>
                    </DropdownMenuItem>
                  )}
                  {userRole === UserRole.ADMIN && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin">Admin Dashboard</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => signOut()}>
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={() => signIn('google')} variant="default">
                Login
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
