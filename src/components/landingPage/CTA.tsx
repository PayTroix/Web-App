// components/CTASection.jsx
import React from 'react';
import Link from 'next/link';

const CTASection = () => {
  return (
    <div className="relative py-16 overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0" 
        style={{
          backgroundImage: `url('https://res.cloudinary.com/dxswouxj5/image/upload/v1745335984/Frame_1000001178_1_ecydpx.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      
      {/* Grid Overlay with lighting effects */}
      <div className="absolute inset-0">
        {/* Glowing points */}
        {Array(30).fill(0).map((_, index) => {
          const size = Math.floor(Math.random() * 5) + 2;
          const top = Math.floor(Math.random() * 100);
          const left = Math.floor(Math.random() * 100);
          const delay = Math.random() * 5;
          const hue = 200 + Math.random() * 40; // Blue shades between 200-240
          const color = `hsl(${hue}, 100%, 50%)`;
          
          return (
            <div 
              key={`glow-point-${index}`}
              className="absolute rounded-full"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                top: `${top}%`,
                left: `${left}%`,
                boxShadow: `0 0 20px 8px ${color}`,
                animation: 'pulse 3s infinite',
                animationDelay: `${delay}s`,
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(5px)',
                borderRadius: '50%',
                zIndex: 1000,
                transform: 'scale(1)',
                transition: 'transform 0.3s ease-in-out',
              }}
            />
          );
        })}
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Ready to Upgrade Your Payroll?
          </h2>
          
          <p className="text-lg mb-10">
            Join the future of employee compensation with the most advanced Web3 
            payroll system available.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-16">
            <Link href="/get-started">
              <button className="bg-white text-black px-8 py-3 rounded-lg font-medium hover:bg-gray-200 transition-all">
                Get Started
              </button>
            </Link>
            <Link href="/join-waitlist">
              <button className="border border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white/10 transition-all">
                Join Waitlist
              </button>
            </Link>
          </div>
        </div>
      </div>
      
      {/* CSS for animations */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { 
            opacity: 0.3;
            transform: scale(1);
          }
          50% { 
            opacity: 1;
            transform: scale(1.2);
          }
        }
      `}</style>
    </div>
  );
};

export default CTASection;