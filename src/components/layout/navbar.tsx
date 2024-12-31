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
import { ToggleTheme } from "./toggle-theme";
import Logo from "./logo";
import { routeList } from "@/data/navbar";
import { Session } from "next-auth";
import { signIn, signOut } from "next-auth/react";

export const Navbar = ({ session }: { session: Session | null }) => {
  const [isOpen, setIsOpen] = React.useState(false);

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
                  </div>
                </div>

                <SheetFooter className="flex-col sm:flex-col justify-start items-start">
                  <Separator className="mb-2" />
                  <ToggleTheme />
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

          <div className="hidden lg:flex">
            <ToggleTheme />
            {session ? (
              <Button onClick={() => signOut()} className="ms-2" aria-label="login">
                Logout
              </Button>
            ) : (
              <Button onClick={() => signIn()} className="ms-2" aria-label="login">
                Login
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
