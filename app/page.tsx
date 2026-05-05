"use client";

import { Hero } from "@/components/Home/Hero";
import { Feature } from "@/components/Home/Feature";
import { HowItWorks } from "@/components/Home/HowItWorks";
import Footer from "@/components/Home/Footer";
import { useAuth } from "@/hooks/useAuth";

const HomePage = () => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <>
      <Hero />
      <HowItWorks />
      <Feature />
      <Footer />
    </>
  );
};

export default HomePage;
