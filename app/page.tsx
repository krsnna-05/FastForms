import { Hero } from "@/components/Hero";
import { Navbar } from "@/components/Navbar";
import { Feature } from "@/components/Feature";
import { HowItWorks } from "@/components/HowItWorks";

const HomePage = () => {
  return (
    <>
      <Hero />
      <HowItWorks />
      <Feature />
    </>
  );
};

export default HomePage;
