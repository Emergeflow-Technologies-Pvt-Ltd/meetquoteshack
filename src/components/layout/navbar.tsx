"use client";

import { Menu, Bell } from "lucide-react";
import React, { useEffect, useState } from "react";
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

import { Prisma, UserRole } from "@prisma/client";
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
import axios from "axios";
import NotificationIcon from "../assets/notification.svg";

export const Navbar = ({ session }: { session: Session | null }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [notifications, setNotifications] = useState<
    Prisma.NotificationGetPayload<{ include: { application: true } }>[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalOpenMobile, setModalOpenMobile] = useState(false);
  const userRole = session?.user?.role;
  const router = useRouter();
  console.log(session?.user.id);

  useEffect(() => {
    const fetchUnreadNotifications = async () => {
      try {
        const { data } = await axios.get("/api/notifications");
        console.log("Raw notifications from API:", data);

        let filteredNotifications = data;

        if (session?.user?.role === "LOANEE") {
          filteredNotifications = data.filter(
            (n: { type: string }) => n.type === "DOCUMENT_REQUEST"
          );
        } else if (session?.user?.role === "LENDER") {
          filteredNotifications = data.filter(
            (n: { type: string }) => n.type === "DOCUMENT_SUBMITTED"
          );
        }

        setNotifications(filteredNotifications);
      } catch (error) {
        console.error("Error fetching unread notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUnreadNotifications();
  }, [session?.user?.role]);

  const unreadCount = notifications.length;

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
                        {/* 🔔 Notification Bell */}
                        {(userRole === UserRole.LOANEE ||
                          userRole === UserRole.LENDER) && (
                          <>
                            <button
                              className="relative flex items-center gap-2 p-2 rounded-md hover:bg-accent text-left"
                              onClick={() => {
                                setIsOpen(false);
                                setModalOpenMobile(true);
                              }}
                            >
                              <Bell className="w-5 h-5" />
                              <span>Notifications</span>
                              {!loading && unreadCount > 0 && (
                                <span className="absolute top-2 left-6 w-2 h-2 bg-red-500 rounded-full"></span>
                              )}
                            </button>
                          </>
                        )}

                        {/* Rest of menu items */}
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
                        {userRole === UserRole.AGENT && (
                          <Button
                            onClick={() => setIsOpen(false)}
                            asChild
                            variant="ghost"
                            className="justify-start text-base"
                          >
                            <Link href="/agent">Agent Dashboard</Link>
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
                        <Dialog open={loginOpen} onOpenChange={setLoginOpen}>
                          <DialogTrigger asChild>
                            <Button
                              variant="default"
                              className="justify-start text-base mt-2"
                              onClick={() => setLoginOpen(true)}
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
                                  setLoginOpen(false);
                                }}
                              >
                                Login as Lender
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => {
                                  router.push("/loanee/login");
                                  setIsOpen(false);
                                  setLoginOpen(false);
                                }}
                              >
                                Login as Loanee
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => {
                                  router.push("/loanee/login");
                                  setIsOpen(false);
                                  setLoginOpen(false);
                                }}
                              >
                                Login as Agent
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Dialog open={registerOpen} onOpenChange={setRegisterOpen}>
                          <DialogTrigger asChild>
                            <Button
                              variant="default"
                              className="justify-start text-base mt-2"
                              onClick={() => setRegisterOpen(true)}
                            >
                              Register
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
                                  setRegisterOpen(false);
                                }}
                              >
                                Register as Lender
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => {
                                  router.push("/loanee/login");
                                  setIsOpen(false);
                                  setRegisterOpen(false);
                                }}
                              >
                                Register as Loanee
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => {
                                  router.push("/loanee/login");
                                  setIsOpen(false);
                                  setRegisterOpen(false);
                                }}
                              >
                                Register as Agent
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </>
                    )}
                  </div>
                </div>

                <SheetFooter className="flex-col sm:flex-col justify-start items-start">
                  <Separator className="mb-2" />
                </SheetFooter>
              </SheetContent>
            </Sheet>

            <Dialog open={modalOpenMobile} onOpenChange={setModalOpenMobile}>
              <DialogContent className="max-w-sm">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5 text-blue-500" />
                    Notifications
                  </DialogTitle>
                </DialogHeader>
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className="flex items-center justify-between p-3 bg-accent/50 rounded-lg hover:bg-accent cursor-pointer transition"
                  >
                    <div
                      onClick={() => {
                        setModalOpenMobile(false);
                        router.push(`/applications/${n.applicationId}`);
                      }}
                      className="flex items-start gap-3"
                    >
                      <Image
                        alt="Notification icon"
                        src={NotificationIcon}
                        className="shrink-0 text-blue-500"
                      />

                      <div className="flex flex-col">
                        <span className="font-medium text-sm">
                          {n.type === "DOCUMENT_REQUEST"
                            ? `Documents requested for Application ${n.applicationId}`
                            : `Documents submitted for Application ${n.applicationId}`}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(n.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {session?.user?.role === "LENDER" && (
                      <button
                        onClick={async (e) => {
                          e.stopPropagation();
                          try {
                            await axios.post(`/api/notifications/markAsRead`, {
                              notificationId: n.id,
                            });
                            setNotifications((prev) =>
                              prev.filter((notif) => notif.id !== n.id)
                            );
                          } catch (error) {
                            console.error("Error marking as read:", error);
                          }
                        }}
                        className="px-3 py-1 text-xs rounded-md bg-green-100 hover:bg-green-200 text-green-800 transition"
                        title="Mark as Read"
                      >
                        Mark as Read
                      </button>
                    )}
                  </div>
                ))}
              </DialogContent>
            </Dialog>
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

          <div className="hidden lg:flex items-center gap-4">
            {/* Show bell only if logged in */}
            {session && userRole !== UserRole.ADMIN && (
              <button
                className="relative p-2 rounded-full hover:bg-accent"
                onClick={() => setModalOpen(true)}
              >
                <Bell className="w-6 h-6" />
                {!loading && unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>
            )}

            <Dialog open={modalOpen} onOpenChange={setModalOpen}>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5 text-blue-500" />
                    Notifications
                  </DialogTitle>
                </DialogHeader>

                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className="flex items-center justify-between p-3 bg-accent/50 rounded-lg hover:bg-accent cursor-pointer transition"
                  >
                    <div
                      onClick={() => {
                        setModalOpen(false);
                        router.push(`/applications/${n.applicationId}`);
                      }}
                      className="flex items-start gap-3"
                    >
                      <Image
                        alt="Notification icon"
                        src={NotificationIcon}
                        className="shrink-0 text-blue-500"
                      />

                      <div className="flex flex-col">
                        <span className="font-medium text-sm">
                          {n.type === "DOCUMENT_REQUEST"
                            ? `Documents requested for Application ${n.applicationId}`
                            : `Documents submitted for Application ${n.applicationId}`}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(n.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {session?.user?.role === "LENDER" && (
                      <button
                        onClick={async (e) => {
                          e.stopPropagation();
                          try {
                            await axios.post(`/api/notifications/markAsRead`, {
                              notificationId: n.id,
                            });
                            setNotifications((prev) =>
                              prev.filter((notif) => notif.id !== n.id)
                            );
                          } catch (error) {
                            console.error("Error marking as read:", error);
                          }
                        }}
                        className="px-3 py-1 text-xs rounded-md bg-green-100 hover:bg-green-200 text-green-800 transition"
                        title="Mark as Read"
                      >
                        Mark as Read
                      </button>
                    )}
                  </div>
                ))}
              </DialogContent>
            </Dialog>

            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Image
                    width={45}
                    src={ProfileIcon}
                    alt="Profile"
                    className="rounded-full cursor-pointer"
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
                  {userRole === UserRole.AGENT && (
                    <DropdownMenuItem asChild>
                      <Link href="/agent/dashboard">Agent Dashboard</Link>
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
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="default">Login</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => router.push("/loanee/login")}>
                      As Loanee
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push("/lender/login")}>
                      As Lender
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push("/agent/login")}>
                      As Agent
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="default">Register</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => router.push("/loanee/login")}>
                      As Loanee
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push("/lender/login")}>
                      As Lender
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push("/agent/login")}>
                      As Agent
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
