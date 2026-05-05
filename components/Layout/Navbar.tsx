"use client";

import { Menu, FormIcon, LogOut } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import useAuthStore from "@/store/authStore";
import Image from "next/image";
import { handleAuth, handleLogout } from "@/services/client/auth";
import { useAuth } from "@/hooks/useAuth";
import { Skeleton } from "@/components/ui/skeleton";

// Dummy menu items
const DEFAULT_MENU = [
  { title: "Demo", url: "#demo" },
  { title: "How it Works", url: "#howitworks" },
  { title: "Features", url: "#features" },
];

const AvatarName = ({ url, name }: { url: string | null; name: string }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [hideTimeout, setHideTimeout] = useState<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (hideTimeout) clearTimeout(hideTimeout);
    setShowDropdown(true);
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setShowDropdown(false);
    }, 200);
    setHideTimeout(timeout);
  };

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex items-center gap-2 cursor-pointer">
        <Avatar>
          <AvatarImage src={url || ""} alt={name} />
          <AvatarFallback className="bg-primary text-white font-semibold">
            {name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <p className="hidden sm:inline text-sm font-medium">{name}</p>
      </div>

      {/* Custom Hover Dropdown */}
      {showDropdown && (
        <div className="absolute top-full right-0 mt-1 w-48 bg-background border border-border rounded-lg shadow-lg overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
          <Link
            href="/dashboard"
            className="block px-4 py-3 text-sm font-medium hover:bg-muted transition-colors border-b border-border"
            onClick={() => setShowDropdown(false)}
          >
            Dashboard
          </Link>
          <button
            onClick={() => {
              setShowDropdown(false);
              handleLogout();
            }}
            className="w-full text-left px-4 py-3 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

const Navbar = () => {
  const { user, isAuthenticated, loading } = useAuth();

  return (
    <section className="fixed w-full bg-background border-b border-primary z-50 h-16 flex items-center">
      <div className="mx-auto container">
        {/* Desktop Menu */}
        <nav className="hidden items-center justify-between lg:flex w-full">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <FormIcon className="text-primary bg-primary/20 p-1 size-8 rounded-sm border border-primary/50" />
            <span className="text-lg font-semibold tracking-tighter">
              FastForms
            </span>
          </Link>

          {/* Menu Items */}
          <div className="flex items-center gap-8">
            {DEFAULT_MENU.map((item) => (
              <a
                key={item.title}
                href={item.url}
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                {item.title}
              </a>
            ))}
          </div>

          {/* Auth Section */}
          <div>
            {loading ? (
              <Skeleton className="h-10 w-10 rounded-full" />
            ) : isAuthenticated && user.name ? (
              <AvatarName url={user.avatarUrl} name={user.name} />
            ) : (
              <Button
                size="sm"
                onClick={handleAuth}
                className="cursor-pointer gap-2"
              >
                <Image
                  src="https://cdn.simpleicons.org/google/ffffff"
                  alt="google-icon"
                  className="size-4"
                  height={16}
                  width={16}
                  unoptimized
                />
                Login with Google
              </Button>
            )}
          </div>
        </nav>

        {/* Mobile Menu */}
        <div className="block lg:hidden">
          <div className="flex items-center justify-between w-full">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <FormIcon className="text-primary bg-primary/20 p-1 size-8 rounded-sm border border-primary/50" />
            </Link>

            {/* Mobile Menu Trigger */}
            <div className="flex items-center gap-3">
              {loading ? (
                <Skeleton className="h-10 w-10 rounded-full" />
              ) : (
                isAuthenticated &&
                user.name && (
                  <AvatarName url={user.avatarUrl} name={user.name} />
                )
              )}

              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Menu className="size-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent className="overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>
                      <a href="/" className="flex items-center gap-2">
                        <FormIcon className="text-primary bg-primary/20 p-1 size-8 rounded-sm border border-primary/50" />
                      </a>
                    </SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col gap-6 p-4">
                    {/* Mobile Menu Items */}
                    <div className="flex flex-col gap-4">
                      {DEFAULT_MENU.map((item) => (
                        <a
                          key={item.title}
                          href={item.url}
                          className="text-md font-semibold hover:text-primary transition-colors"
                        >
                          {item.title}
                        </a>
                      ))}
                    </div>

                    {/* Mobile Auth Section */}
                    <div className="flex flex-col gap-3">
                      {!isAuthenticated ? (
                        <Button onClick={handleAuth} className="w-full gap-2">
                          <Image
                            src="https://cdn.simpleicons.org/google/ffffff"
                            alt="google-icon"
                            className="size-4"
                            width={16}
                            height={16}
                          />
                          Login with Google
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={handleLogout}
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          Logout
                        </Button>
                      )}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Navbar };
