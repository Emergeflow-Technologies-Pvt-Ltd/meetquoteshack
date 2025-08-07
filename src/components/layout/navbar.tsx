"use client";

import { Menu } from "lucide-react";
import React, { useState } from "react";
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
import { signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

import { UserRole } from "@prisma/client";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import ProfileIcon from "../assets/profile_icon.svg";
import Image from "next/image";

export const Navbar = ({ session }: { session: Session | null }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [open, setOpen] = useState(false);
  const userRole = session?.user?.role;
  const router = useRouter();

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
                            <Link href="/lender/dashboard">
                              Lender Dashboard
                            </Link>
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
                            signOut({ callbackUrl: "/" });
                            setIsOpen(false);
                          }}
                          variant="ghost"
                          className="justify-start text-base"
                        >
                          Log out
                        </Button>
                      </>
                    ) : (
                      <>
                        <Dialog open={open} onOpenChange={setOpen}>
                          <DialogTrigger asChild>
                            <Button
                              variant="default"
                              className="justify-start text-base mt-2"
                              onClick={() => setOpen(true)}
                            >
                              Login
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-sm">
                            <DialogHeader>
                              <DialogTitle>Select your role</DialogTitle>
                            </DialogHeader>
                            <div className="flex flex-col gap-4 mt-2">
                              <Button
                                variant="secondary"
                                onClick={() => {
                                  router.push("/lender/login");
                                  setIsOpen(false);
                                  setOpen(false);
                                }}
                              >
                                Login as Lender
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => {
                                  router.push("/loanee/login");
                                  setIsOpen(false);
                                  setOpen(false);
                                }}
                              >
                                Login as Loanee
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="outline"
                          className="justify-start text-base"
                          onClick={() => {
                            router.push("/lender/register");
                            setIsOpen(false);
                            setOpen(false);
                          }}
                        >
                          Sign up as Lender
                        </Button>
                      </>
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
                  <Image
                    width={45}
                    src={ProfileIcon}
                    alt={ProfileIcon}
                    className="rounded-full"
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {session.user?.name}
                      </p>
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
                  <DropdownMenuItem
                    onClick={() => signOut({ callbackUrl: "/" })}
                  >
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="default">Login</Button>
                </DropdownMenuTrigger>
                <Button
                  variant="outline"
                  onClick={() => router.push("/lender/register")}
                >
                  Sign up as Lender
                </Button>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => router.push("/loanee/login")}
                  >
                    As Loanee
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      router.push("/lender/login");
                    }}
                  >
                    As Lender
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
