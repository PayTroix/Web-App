// components/CTASection.jsx
import React, { useState } from 'react';
import { waitlistService } from '../../services/api';

const CTASection = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: '', isError: false });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic email validation
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setMessage({ text: 'Please enter a valid email address', isError: true });
      return;
    }
    
    setIsSubmitting(true);
    setMessage({ text: '', isError: false });
    
    try {
      await waitlistService.joinWaitlist(email);
      setMessage({ text: 'Successfully joined the waitlist!', isError: false });
      setEmail('');
    } catch (error) {
      setMessage({ text: 'Failed to join waitlist. Please try again.', isError: true });
      console.error('Waitlist submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="CTA" className="relative py-16 overflow-hidden">
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
          
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row justify-center">
            <input 
              type="email" 
              placeholder="Enter your email"
              className="bg-transparent border border-white/30 rounded-l-2xl px-6 py-3 text-white placeholder:text-white/50 focus:outline-none focus:border-white/50 transition-all w-full sm:w-96"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
            />
            <button 
              type="submit"
              className={`${isSubmitting ? 'bg-white/70' : 'bg-white'} text-black hover:bg-white/90 px-8 py-3 rounded-r-2xl font-medium transition-all`}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Joining...' : 'Join Waitlist'}
            </button>
          </form>
          
          {message.text && (
            <p className={`mt-4 ${message.isError ? 'text-red-400' : 'text-green-400'}`}>
              {message.text}
            </p>
          )}
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
