"use client";

import { Menu, FormIcon, LogOut } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

// Dummy user data
const DUMMY_USER = {
  name: "John Doe",
  avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
};

// Dummy menu items
const DEFAULT_MENU = [
  { title: "Demo", url: "#demo" },
  { title: "How it Works", url: "#howitworks" },
  { title: "Features", url: "#features" },
];

const AvatarName = ({ url, name }: { url: string; name: string }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center gap-2 cursor-pointer">
          <Avatar>
            <AvatarImage src={url} alt={name} />
            <AvatarFallback className="bg-primary text-white font-semibold">
              {name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <p>{name}</p>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href="/dashboard">Dashboard</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const Navbar = () => {
  const isAuthenticated = true; // Dummy: set to true for testing logged-in state

  return (
    <section className="fixed w-full bg-background border-b border-primary z-50 h-16 flex items-center">
      <div className="mx-auto container">
        {/* Desktop Menu */}
        <nav className="hidden items-center justify-between lg:flex w-full">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2">
            <FormIcon className="text-primary bg-primary/20 p-1 size-8 rounded-sm border border-primary/50" />
            <span className="text-lg font-semibold tracking-tighter">
              FastForms
            </span>
          </a>

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
            {isAuthenticated ? (
              <AvatarName url={DUMMY_USER.avatarUrl} name={DUMMY_USER.name} />
            ) : (
              <Button asChild size="sm">
                <a href="/api/auth/google">
                  <img
                    src="https://cdn.simpleicons.org/google/000000"
                    alt="google-icon"
                    className="size-4"
                  />
                  Login with Google
                </a>
              </Button>
            )}
          </div>
        </nav>

        {/* Mobile Menu */}
        <div className="block lg:hidden">
          <div className="flex items-center justify-between w-full">
            {/* Logo */}
            <a href="/" className="flex items-center gap-2">
              <FormIcon className="text-primary bg-primary/20 p-1 size-8 rounded-sm border border-primary/50" />
            </a>

            {/* Mobile Menu Trigger */}
            <div className="flex items-center gap-3">
              {isAuthenticated && (
                <AvatarName url={DUMMY_USER.avatarUrl} name={DUMMY_USER.name} />
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
                        <Button asChild className="w-full">
                          <a href="/api/auth/google">
                            <img
                              src="https://cdn.simpleicons.org/google/000000"
                              alt="google-icon"
                              className="size-4"
                            />
                            Login with Google
                          </a>
                        </Button>
                      ) : (
                        <Button variant="outline" className="w-full">
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
