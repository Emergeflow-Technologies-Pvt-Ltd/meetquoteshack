"use client"

import { Menu, Bell } from "lucide-react"
import React, { useEffect, useState } from "react"
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet"
import { Separator } from "../ui/separator"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "../ui/navigation-menu"
import { Button } from "../ui/button"
import Link from "next/link"
import { cn } from "@/lib/utils"
// import { ToggleTheme } from "./toggle-theme";
import Logo from "./logo"
import { routeList } from "@/data/navbar"
import { Session } from "next-auth"
import { signOut } from "next-auth/react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"

import { Prisma, UserRole } from "@prisma/client"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog"
import ProfileIcon from "../assets/profile_icon.svg"
import Image from "next/image"
import axios from "axios"
import NotificationIcon from "../assets/notification.svg"

export const Navbar = ({ session }: { session: Session | null }) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const [loginOpen, setLoginOpen] = useState(false)
  const [registerOpen, setRegisterOpen] = useState(false)
  const [notifications, setNotifications] = useState<
    Prisma.NotificationGetPayload<{ include: { application: true } }>[]
  >([])

  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalOpenMobile, setModalOpenMobile] = useState(false)
  const userRole = session?.user?.role
  const router = useRouter()

  useEffect(() => {
    const fetchUnreadNotifications = async () => {
      try {
        const { data } = await axios.get("/api/notifications")
        let filteredNotifications = data

        if (session?.user?.role === "LOANEE") {
          filteredNotifications = data.filter(
            (n: { type: string }) => n.type === "DOCUMENT_REQUEST"
          )
        } else if (session?.user?.role === "LENDER") {
          filteredNotifications = data.filter(
            (n: { type: string }) => n.type === "DOCUMENT_SUBMITTED"
          )
        }

        setNotifications(filteredNotifications)
      } catch (error) {
        console.error("Error fetching unread notifications:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUnreadNotifications()
  }, [session?.user?.role])

  const unreadCount = notifications.length

  const visibleRoutes = routeList.filter((route) => {
    if (!session) return true // Show all routes if not logged in

    const { role } = session.user

    // Only hide Lender and Agent routes for Loanee
    if (role === "LOANEE") {
      return !route.href.includes("/lender") && !route.href.includes("/agent")
    }

    return true // Show all routes for Lenders, Agents, Admins, etc.
  })

  return (
    <header className="sticky top-2 z-40 lg:top-5">
      <div className="container mx-auto">
        <div className="flex items-center justify-between rounded-2xl border bg-background/70 bg-opacity-15 p-2 backdrop-blur-sm">
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
                className="flex flex-col justify-between rounded-br-2xl rounded-tr-2xl border-secondary bg-card"
              >
                <div>
                  <SheetHeader className="mb-4 ml-4">
                    <SheetTitle className="flex items-center">
                      <Logo />
                    </SheetTitle>
                  </SheetHeader>

                  <div className="flex flex-col gap-2">
                    {visibleRoutes.map(({ href, label }) => (
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
                              className="relative flex items-center gap-2 rounded-md p-2 text-left hover:bg-accent"
                              onClick={() => {
                                setIsOpen(false)
                                setModalOpenMobile(true)
                              }}
                            >
                              <Bell className="h-5 w-5" />
                              <span>Notifications</span>
                              {!loading && unreadCount > 0 && (
                                <span className="absolute left-6 top-2 h-2 w-2 rounded-full bg-red-500"></span>
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
                          <>
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
                            <Button
                              onClick={() => setIsOpen(false)}
                              asChild
                              variant="ghost"
                              className="justify-start text-base"
                            >
                              <Link href="/verified-documents">
                                Verified Documents
                              </Link>
                            </Button>
                          </>
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
                          <>
                            <Button
                              onClick={() => setIsOpen(false)}
                              asChild
                              variant="ghost"
                              className="justify-start text-base"
                            >
                              <Link href="/agent">Agent Dashboard</Link>
                            </Button>
                            <Button
                              onClick={() => setIsOpen(false)}
                              asChild
                              variant="ghost"
                              className="justify-start text-base"
                            >
                              <Link href="/verified-documents">
                                Verified Documents
                              </Link>
                            </Button>
                            <Button
                              onClick={() => setIsOpen(false)}
                              asChild
                              variant="ghost"
                              className="justify-start text-base"
                            >
                              <Link href="/agentchat">Chat</Link>
                            </Button>
                          </>
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
                            signOut({ callbackUrl: "/" })
                            setIsOpen(false)
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
                              className="mt-2 justify-start text-base"
                              onClick={() => setLoginOpen(true)}
                            >
                              Login
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-sm">
                            <DialogHeader>
                              <DialogTitle>Select your role</DialogTitle>
                            </DialogHeader>
                            <div className="mt-2 flex flex-col gap-4">
                              <Button
                                variant="secondary"
                                onClick={() => {
                                  router.push("/lender/login")
                                  setIsOpen(false)
                                  setLoginOpen(false)
                                }}
                              >
                                Login as Lender
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => {
                                  router.push("/loanee/login")
                                  setIsOpen(false)
                                  setLoginOpen(false)
                                }}
                              >
                                Login as Loanee
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => {
                                  router.push("/loanee/login")
                                  setIsOpen(false)
                                  setLoginOpen(false)
                                }}
                              >
                                Login as Agent
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Dialog
                          open={registerOpen}
                          onOpenChange={setRegisterOpen}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="default"
                              className="mt-2 justify-start text-base"
                              onClick={() => setRegisterOpen(true)}
                            >
                              Register
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-sm">
                            <DialogHeader>
                              <DialogTitle>Select your role</DialogTitle>
                            </DialogHeader>
                            <div className="mt-2 flex flex-col gap-4">
                              <Button
                                variant="secondary"
                                onClick={() => {
                                  router.push("/lender/login")
                                  setIsOpen(false)
                                  setRegisterOpen(false)
                                }}
                              >
                                Register as Lender
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => {
                                  router.push("/loanee/login")
                                  setIsOpen(false)
                                  setRegisterOpen(false)
                                }}
                              >
                                Register as Loanee
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => {
                                  router.push("/loanee/login")
                                  setIsOpen(false)
                                  setRegisterOpen(false)
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

                <SheetFooter className="flex-col items-start justify-start sm:flex-col">
                  <Separator className="mb-2" />
                </SheetFooter>
              </SheetContent>
            </Sheet>

            <Dialog open={modalOpenMobile} onOpenChange={setModalOpenMobile}>
              <DialogContent className="max-w-sm">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-blue-500" />
                    Notifications
                  </DialogTitle>
                </DialogHeader>
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className="flex cursor-pointer items-center justify-between rounded-lg bg-accent/50 p-3 transition hover:bg-accent"
                  >
                    <div
                      onClick={() => {
                        setModalOpenMobile(false)
                        router.push(`/applications/${n.applicationId}`)
                      }}
                      className="flex items-start gap-3"
                    >
                      <Image
                        alt="Notification icon"
                        src={NotificationIcon}
                        className="shrink-0 text-blue-500"
                      />

                      <div className="flex flex-col">
                        <span className="text-sm font-medium">
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
                          e.stopPropagation()
                          try {
                            await axios.post(`/api/notifications/markAsRead`, {
                              notificationId: n.id,
                            })
                            setNotifications((prev) =>
                              prev.filter((notif) => notif.id !== n.id)
                            )
                          } catch (error) {
                            console.error("Error marking as read:", error)
                          }
                        }}
                        className="rounded-md bg-green-100 px-3 py-1 text-xs text-green-800 transition hover:bg-green-200"
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
          <NavigationMenu className="mx-auto hidden lg:block">
            <NavigationMenuList className="space-x-0">
              <NavigationMenuItem>
                {visibleRoutes.map(({ href, label }) => (
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

          <div className="hidden items-center gap-4 lg:flex">
            {/* Show bell only if logged in */}
            {session && userRole !== UserRole.ADMIN && (
              <button
                className="relative rounded-full p-2 hover:bg-accent"
                onClick={() => setModalOpen(true)}
              >
                <Bell className="h-6 w-6" />
                {!loading && unreadCount > 0 && (
                  <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500"></span>
                )}
              </button>
            )}

            <Dialog open={modalOpen} onOpenChange={setModalOpen}>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-blue-500" />
                    Notifications
                  </DialogTitle>
                </DialogHeader>

                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className="flex cursor-pointer items-center justify-between rounded-lg bg-accent/50 p-3 transition hover:bg-accent"
                  >
                    <div
                      onClick={() => {
                        setModalOpen(false)
                        router.push(`/applications/${n.applicationId}`)
                      }}
                      className="flex items-start gap-3"
                    >
                      <Image
                        alt="Notification icon"
                        src={NotificationIcon}
                        className="shrink-0 text-blue-500"
                      />

                      <div className="flex flex-col">
                        <span className="text-sm font-medium">
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
                          e.stopPropagation()
                          try {
                            await axios.post(`/api/notifications/markAsRead`, {
                              notificationId: n.id,
                            })
                            setNotifications((prev) =>
                              prev.filter((notif) => notif.id !== n.id)
                            )
                          } catch (error) {
                            console.error("Error marking as read:", error)
                          }
                        }}
                        className="rounded-md bg-green-100 px-3 py-1 text-xs text-green-800 transition hover:bg-green-200"
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
                    className="cursor-pointer rounded-full"
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
                    <>
                      <DropdownMenuItem asChild>
                        <Link href="/lender/dashboard">Lender Dashboard</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/verified-documents">
                          Verified Documents
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  {userRole === UserRole.AGENT && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link href="/agent/dashboard">Agent Dashboard</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/verified-documents">
                          Verified Documents
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/agentchat">Chat</Link>
                      </DropdownMenuItem>
                    </>
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
                    <DropdownMenuItem
                      onClick={() => router.push("/loanee/login")}
                    >
                      As Loanee
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => router.push("/lender/login")}
                    >
                      As Lender
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => router.push("/agent/login")}
                    >
                      As Agent
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="default">Register</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => router.push("/loanee/login")}
                    >
                      As Loanee
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => router.push("/lender/register")}
                    >
                      As Lender
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => router.push("/agent/register")}
                    >
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
  )
}
