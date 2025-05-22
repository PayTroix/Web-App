"use client"

import { useEffect, useState } from "react";
import CTASection from "@/components/landingPage/CTA"
import Footer from "@/components/landingPage/Footer"
import HeroSection from "@/components/landingPage/Hero"
import WhyTroix from "@/components/landingPage/WhyTroix"
import { getToken } from "@/utils/token";
import { web3AuthService } from "@/services/api";
import RolesModal from "@/components/RolesModal";
import Header from "@/components/landingPage/Header";

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showRolesModal, setShowRolesModal] = useState(false);
  const [userType, setUserType] = useState<'recipient' | 'organization' | 'both' | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = getToken();
      if (token) {
        try {
          const user = await web3AuthService.getUser(token);
          setIsAuthenticated(true);
          setUserType(user.user_type as 'recipient' | 'organization' | 'both');
        } catch (error) {
          console.error("Error fetching user data:", error);
          setIsAuthenticated(false);
        }
      }
    };
    checkAuth();
  }, []);

  return (
    <div className="bg-cover bg-no-repeat relative"
      style={{
        backgroundImage:
          "url('https://res.cloudinary.com/dxswouxj5/image/upload/v1745337339/Hompage_avdmfg.png')",
      }}>
      <Header onShowRoles={() => setShowRolesModal(true)} />
      <HeroSection onShowRoles={() => setShowRolesModal(true)} />
      <WhyTroix />
      <CTASection />
      <Footer />
      <RolesModal
        isOpen={showRolesModal}
        onClose={() => setShowRolesModal(false)}
        userType={userType}
      />
    </div>
  )
}
