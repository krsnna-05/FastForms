import { Hero } from "@/components/Hero";
import { Navbar } from "@/components/Navbar";
import { Feature } from "@/components/Feature";
import OptionalAuth from "@/components/OptionalAuth";

const HomePage = () => {
  return (
    <OptionalAuth>
      <Hero />
      <Feature />
    </OptionalAuth>
  );
};

export default HomePage;
