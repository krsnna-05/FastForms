"use client";

import Link from "next/link";
import { Mail, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormIcon } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const basicLinks = [
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
    { label: "Contact", href: "mailto:contact@fastforms.ai" },
  ];

  const socialLinks = [
    {
      icon: Github,
      href: "#github",
      label: "GitHub",
    },
    {
      icon: Mail,
      href: "mailto:contact@fastforms.ai",
      label: "Email",
    },
  ];

  return (
    <footer className="border-t border-border bg-background mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          {/* Left - Logo */}
          <div className="flex items-center gap-2">
            <FormIcon className="text-primary bg-primary/20 p-1 size-8 rounded-sm border border-primary/50" />
            <span className="text-lg font-semibold tracking-tighter">
              FastForms
            </span>
          </div>

          {/* Center - Basic Links */}
          <div className="flex gap-6">
            {basicLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right - Creator Card */}
          <div className="flex items-center gap-3 px-4 py-2 rounded-lg border border-border bg-muted/50">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-semibold">
              DK
            </div>
            <div className="flex flex-col">
              <p className="text-sm font-semibold text-foreground">
                Dev Krishna
              </p>
              <p className="text-xs text-muted-foreground">Creator</p>
            </div>
            <div className="flex gap-1 ml-2">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <Link key={social.label} href={social.href}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-background"
                    >
                      <Icon className="w-3 h-3" />
                      <span className="sr-only">{social.label}</span>
                    </Button>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border my-6" />

        {/* Bottom - Copyright */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            © {currentYear} FastForms. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
