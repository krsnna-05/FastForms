"use client";

import { Menu, FormIcon } from "lucide-react";
import Link from "next/link";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import useAuthStore from "@/store/AuthStore";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";

interface MenuItem {
  title: string;
  url: string;
  description?: string;
  icon?: React.ReactNode;
  items?: MenuItem[];
}

interface NavbarProps {
  logo?: {
    url: string;
    src: React.ReactNode;
    alt: string;
    title: string;
  };
  menu?: MenuItem[];
  auth?: {
    loginGoogle: {
      title: string;
      url: string;
    };
  };
}

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
        <DropdownMenuItem>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const Navbar = ({
  logo = {
    url: "/",
    src: (
      <FormIcon className=" text-primary bg-primary/20 p-1 size-8 rounded-sm border border-primary/50" />
    ),
    alt: "FastForms Logo",
    title: "FastForms",
  },
  menu = [
    { title: "Demo", url: "#" },
    {
      title: "Features",
      url: "#",
    },
    {
      title: "Pricing",
      url: "#",
    },
  ],
  auth = {
    loginGoogle: { title: "Login with Google", url: "/api/auth/google" },
  },
}: NavbarProps) => {
  const authStore = useAuthStore();

  return (
    <section className="py-4 px-3 fixed w-full bg-background border-b border-primary z-50">
      <div className="mx-auto container">
        {/* Desktop Menu */}
        <nav className="hidden items-center justify-around lg:flex mx-auto w-full ">
          <div className="flex items-center gap-2">
            {/* Logo */}
            <a href={logo.url} className="flex items-center gap-2">
              {logo.src}
              <span className="text-lg font-semibold tracking-tighter">
                {logo.title}
              </span>
            </a>
          </div>
          <div className="flex items-center">
            <NavigationMenu>
              <NavigationMenuList className="">
                {menu.map((item) => renderMenuItem(item))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {authStore.isAuthenticated ? (
            <AvatarName
              url={authStore.userData?.profilePhotoUrl || ""}
              name={authStore.userData?.name || "User"}
            />
          ) : (
            <div className="flex gap-2">
              <Button asChild size="sm">
                <a href={auth.loginGoogle.url}>
                  <img
                    src="https://cdn.simpleicons.org/google/000000"
                    alt="google-icon"
                    className="size-4"
                  />
                  {auth.loginGoogle.title}
                </a>
              </Button>
            </div>
          )}
        </nav>

        {/* Mobile Menu */}
        <div className="block lg:hidden">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <a href={logo.url} className="flex items-center gap-2">
              {logo.src}
            </a>
            <div className="flex items-center gap-3">
              {authStore.isAuthenticated && (
                <AvatarName
                  url={authStore.userData?.profilePhotoUrl || ""}
                  name={authStore.userData?.name || "User"}
                />
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
                      <a href={logo.url} className="flex items-center gap-2">
                        {logo.src}
                      </a>
                    </SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col gap-6 p-4">
                    <Accordion
                      type="single"
                      collapsible
                      className="flex w-full flex-col gap-4"
                    >
                      {menu.map((item) => renderMobileMenuItem(item))}
                    </Accordion>

                    <div className="flex flex-col gap-3">
                      {!authStore.isAuthenticated ? (
                        <Button asChild>
                          <a href={auth.loginGoogle.url}>
                            <img
                              src="https://cdn.simpleicons.org/google/000000"
                              alt="google-icon"
                              className="size-4"
                            />
                            {auth.loginGoogle.title}
                          </a>
                        </Button>
                      ) : (
                        <Button variant="outline" className="w-full">
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

const renderMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <NavigationMenuItem key={item.title}>
        <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
        <NavigationMenuContent className="bg-popover text-popover-foreground">
          {item.items.map((subItem) => (
            <NavigationMenuLink asChild key={subItem.title} className="w-80">
              <SubMenuLink item={subItem} />
            </NavigationMenuLink>
          ))}
        </NavigationMenuContent>
      </NavigationMenuItem>
    );
  }

  return (
    <NavigationMenuItem key={item.title}>
      <NavigationMenuLink
        href={item.url}
        className="bg-background hover:bg-muted hover:text-accent-foreground group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors"
      >
        {item.title}
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
};

const renderMobileMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <AccordionItem key={item.title} value={item.title} className="border-b-0">
        <AccordionTrigger className="text-md py-0 font-semibold hover:no-underline">
          {item.title}
        </AccordionTrigger>
        <AccordionContent className="mt-2">
          {item.items.map((subItem) => (
            <SubMenuLink key={subItem.title} item={subItem} />
          ))}
        </AccordionContent>
      </AccordionItem>
    );
  }

  return (
    <a key={item.title} href={item.url} className="text-md font-semibold">
      {item.title}
    </a>
  );
};

const SubMenuLink = ({ item }: { item: MenuItem }) => {
  return (
    <a
      className="hover:bg-muted hover:text-accent-foreground flex min-w-80 select-none flex-row gap-4 rounded-md p-3 leading-none no-underline outline-none transition-colors"
      href={item.url}
    >
      <div className="text-foreground">{item.icon}</div>
      <div>
        <div className="text-sm font-semibold">{item.title}</div>
        {item.description && (
          <p className="text-muted-foreground text-sm leading-snug">
            {item.description}
          </p>
        )}
      </div>
    </a>
  );
};

export { Navbar };
