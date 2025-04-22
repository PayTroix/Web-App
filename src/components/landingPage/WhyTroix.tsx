import Image from "next/image"
import { motion } from "framer-motion"

export default function Home() {
  const features = [
    {
      icon: "Vector_ll7g9t.png",
      text: "Instant Salary Payments via Smart Contracts",
    },
    {
      icon: "Vector_1_b9eirb.png",
      text: "Support for Stablecoins & Cryptocurrencies",
    },
    {
      icon: "Vector_2_ru3o2y.png",
      text: "Cross-Border, Gas-Optimized Transactions",
    },
    {
      icon: "Vector_3_awnjy7.png",
      text: "Fully Decentralized Treasury & HR Integration",
    },
    {
      icon: "Vector_4_zfypg9.png",
      text: "Financial Wellness Tools for Employees",
    },
  ]

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-20 ">
      <section className="max-w-5xl mx-auto text-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold text-blue-400 mb-4"
        >
          Why PayTroix?
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-gray-300 max-w-3xl mx-auto mb-12"
        >
          Empowering Teams, Anywhere in the World. Traditional payroll systems are slow, centralized, and costly. Our
          platform replaces complexity with transparency, speed, and employee-first innovation.
        </motion.p>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }} // Repeat animation on every scroll
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className={`card-lightning p-[2px] ${
                index === 2 ? "md:col-span-2 max-w-lg mx-auto w-full" : ""
              }`}
            >
              <div className="rounded-lg p-6 flex items-center space-x-4 bg-black/40 hover:bg-black/60 transition-all">
                <div className="bg-blue-900/50 p-3 rounded-full flex items-center justify-center">
                  <Image
                    src={`https://res.cloudinary.com/dxswouxj5/image/upload/v1745300178/${feature.icon}`}
                    alt="Icon"
                    width={32}
                    height={32}
                  />
                </div>
                <span className="text-gray-200">{feature.text}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Subheading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold text-blue-400 mb-4 mt-36"
        >
          Decentralized. Transparent. Secure.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-gray-300 max-w-2xl mx-auto mb-12"
        >
          From onboarding to payouts, our smart contracts automate everything. No middlemen, no delays—just trustless
          payroll on-chain.
        </motion.p>

        {/* Feature Pills */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap justify-center gap-4"
        >
          <FeaturePill text="Multi-sig Treasury Management" />
          <FeaturePill text="Salary Splits: Crypto + Fiat" />
          <FeaturePill text="Global Compliance Built-in" />
          <FeaturePill text="Configurable Pay Schedules & Bonus Rules" />
          <FeaturePill text="Blockchain-Verified Payslips & Reports" />
        </motion.div>
      </section>
    </div>
  )
}

function FeaturePill({ text }: { text: string }) {
  return (
    <div className="bg-black/60 border border-blue-900/50 rounded-full px-5 py-2 flex items-center space-x-2">
      <div className="bg-blue-500/20 rounded-full p-1 flex items-center justify-center">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M20 6L9 17L4 12" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <span className="text-sm text-gray-300">{text}</span>
    </div>
  )
}
