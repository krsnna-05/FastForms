"use client";

import { FormIcon, Wifi, Zap, Chrome } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

interface HeroProps {
  icon?: React.ReactNode;
  heading?: string;
  description?: string;
  button?: {
    text: string;
    icon?: React.ReactNode;
    url: string;
  };
  trustText?: string;
  imageSrc?: string | null;
  imageAlt?: string | null;
}

const Hero = ({
  icon = (
    <FormIcon className=" text-primary bg-primary/20 p-1 size-8 rounded-sm border border-primary/50" />
  ),
  heading = "Lovable For Google Forms",
  description = "Create Google Forms by chatting. Transform your ideas into fully functional forms in seconds with our AI-powered form builder.",
  button,
  trustText = "Trusted by 250+ Users Worldwide",
  imageSrc = null,
  imageAlt = null,
}: HeroProps) => {
  const { isAuthenticated } = useAuth();

  return (
    <section id="demo" className="overflow-hidden py-32">
      <div className="container mx-auto">
        <div className="flex flex-col gap-5">
          <div className="relative flex flex-col gap-5">
            <div
              style={{
                transform: "translate(-50%, -50%)",
              }}
              className="absolute left-1/2 top-1/2 -z-10 mx-auto size-[800px] rounded-full border p-16 [mask-image:linear-gradient(to_top,transparent,transparent,white,white,white,transparent,transparent)] md:size-[1300px] md:p-32"
            >
              <div className="size-full rounded-full border p-16 md:p-32">
                <div className="size-full rounded-full border"></div>
              </div>
            </div>
            <span className="mx-auto flex size-16 items-center justify-center rounded-full border md:size-20">
              {icon}
            </span>
            <h2 className="mx-auto max-w-5xl text-balance text-center text-3xl font-medium md:text-6xl">
              {heading}
            </h2>
            <p className="text-muted-foreground mx-auto max-w-3xl text-center md:text-lg">
              {description}
            </p>
            <div className="flex flex-col items-center justify-center gap-3 pb-12 pt-3">
              <div className="flex flex-col sm:flex-row gap-3">
                {isAuthenticated ? (
                  <>
                    <Button size="lg" asChild>
                      <Link href="/dashboard">
                        Go to Dashboard <Zap className="ml-2 size-4" />
                      </Link>
                    </Button>
                    <Button size="lg" variant="outline" asChild>
                      <Link href="#features">View Features</Link>
                    </Button>
                  </>
                ) : (
                  <>
                    <Button size="lg" asChild>
                      <Link href="/api/auth">
                        <img
                          src="https://cdn.simpleicons.org/google/000000"
                          alt="google-icon"
                          className="size-4"
                        />
                        Get Started with Google
                      </Link>
                    </Button>
                    <Button size="lg" variant="outline" asChild>
                      <Link href="#features">
                        View Features <Zap className="ml-2 size-4" />
                      </Link>
                    </Button>
                  </>
                )}
              </div>
              {trustText && (
                <div className="text-muted-foreground text-xs">{trustText}</div>
              )}
            </div>
          </div>
          {imageSrc && imageAlt ? (
            <img
              src={imageSrc}
              alt={imageAlt}
              className="mx-auto h-full max-h-[524px] w-full max-w-5xl rounded-2xl object-cover"
            />
          ) : (
            <div className="mx-auto h-[524px] max-h-[524px] w-full max-w-5xl rounded-2xl bg-muted" />
          )}
        </div>
      </div>
    </section>
  );
};

export { Hero };
