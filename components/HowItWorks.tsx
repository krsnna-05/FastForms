"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle2, Zap, BarChart3 } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: <Zap className="w-8 h-8 text-primary" />,
      title: "Create Your Form",
      description:
        "Build beautiful, interactive forms with our intuitive form builder. No coding required.",
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-primary" />,
      title: "Share & Collect",
      description:
        "Share your form via link or embed it on your website. Start collecting responses instantly.",
    },
    {
      icon: <CheckCircle2 className="w-8 h-8 text-primary" />,
      title: "Analyze Results",
      description:
        "View detailed analytics, export data, and gain insights from your responses in real-time.",
    },
  ];

  return (
    <section id="howitworks" className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Create, share, and analyze forms in just three simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <Card key={index} className="border-0 shadow-none bg-background">
              <CardHeader>
                <div className="mb-4 p-3 w-fit bg-primary/10 rounded-lg">
                  {step.icon}
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white text-sm font-semibold">
                    {index + 1}
                  </span>
                  <CardTitle className="text-xl">{step.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base text-muted-foreground">
                  {step.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 p-8 bg-primary/5 rounded-lg border border-primary/10">
          <p className="text-center text-muted-foreground">
            Get started today and create your first form in minutes. It&apos;s free
            and easy.
          </p>
        </div>
      </div>
    </section>
  );
};

export { HowItWorks };
