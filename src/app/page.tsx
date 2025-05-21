"use client"

import { useEffect, useState } from "react";
import CTASection from "@/components/landingPage/CTA"
import Footer from "@/components/landingPage/Footer"
import HeroSection from "@/components/landingPage/Hero"
import WhyTroix from "@/components/landingPage/WhyTroix"
import { getToken } from "@/utils/token";
import { web3AuthService } from "@/services/api";

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = getToken();
      if (token) {
        try {
          await web3AuthService.getUser(token);
          setIsAuthenticated(true);
        } catch (error) {
          setIsAuthenticated(false);
        }
      }
    };
    checkAuth();
  }, []);

  return (
    <div className="bg-cover bg-no-repeat"
      style={{
        backgroundImage:
          "url('https://res.cloudinary.com/dxswouxj5/image/upload/v1745337339/Hompage_avdmfg.png')",
      }}>
      <HeroSection />
      <WhyTroix />
      <CTASection />
      <Footer />
    </div>
  )
}
