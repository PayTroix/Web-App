"use client"

import CTASection from "@/components/landingPage/CTA"
import Footer from "@/components/landingPage/Footer"
import HeroSection from "@/components/landingPage/Hero"
import WhyTroix from "@/components/landingPage/WhyTroix"


export default function Home() {
  return (
<div className="bg-cover  bg-no-repeat"
      style={{
        backgroundImage:
          "url('https://res.cloudinary.com/dxswouxj5/image/upload/v1745337339/Hompage_avdmfg.png')",
      }}>
<HeroSection />
<WhyTroix />
<CTASection/>
<Footer/>
</div>

  )
}
