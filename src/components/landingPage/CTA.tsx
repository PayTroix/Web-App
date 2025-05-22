import React, { useState } from 'react';
import { waitlistService } from '../../services/api';
import { toast } from 'react-hot-toast';

const CTASection = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Please enter a valid email address', {
        style: {
          background: '#1E293B',
          color: '#fff',
        },
        icon: '✉️',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await waitlistService.joinWaitlist(email);
      toast.success('You\'re on the waitlist!', {
        style: {
          background: '#1E293B',
          color: '#fff',
        },
        icon: '🎉',
      });
      setEmail('');
    } catch (error) {
      toast.error('Failed to join waitlist. Please try again.', {
        style: {
          background: '#1E293B',
          color: '#fff',
        },
        icon: '⚠️',
      });
      console.error('Waitlist submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="CTA" className="relative py-16 sm:py-20 overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://res.cloudinary.com/dxswouxj5/image/upload/v1745335984/Frame_1000001178_1_ecydpx.png')`,
        }}
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/40 z-0" />

      {/* Grid Overlay with lighting effects */}
      <div className="absolute inset-0 overflow-hidden">
        {Array(20).fill(0).map((_, index) => {
          const size = Math.floor(Math.random() * 4) + 2;
          const top = Math.floor(Math.random() * 100);
          const left = Math.floor(Math.random() * 100);
          const delay = Math.random() * 5;
          const hue = 200 + Math.random() * 40;
          const color = `hsl(${hue}, 100%, 50%)`;

          return (
            <div
              key={`glow-point-${index}`}
              className="absolute rounded-full animate-pulse"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                top: `${top}%`,
                left: `${left}%`,
                boxShadow: `0 0 10px 4px ${color}`,
                animationDelay: `${delay}s`,
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
              }}
            />
          );
        })}
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 leading-tight">
            Ready to Upgrade Your Payroll?
          </h2>

          <p className="text-base sm:text-lg mb-6 sm:mb-8 text-gray-300 max-w-2xl mx-auto">
            Join the future of employee compensation with the most advanced Web3
            payroll system available.
          </p>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto"
          >
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-grow bg-white/10 border border-white/30 rounded-lg sm:rounded-l-lg sm:rounded-r-none px-4 py-3 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
            />
            <button
              type="submit"
              className={`${isSubmitting
                  ? 'bg-blue-600/70 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
                } text-white px-6 py-3 rounded-lg sm:rounded-r-lg sm:rounded-l-none font-medium transition-all min-w-[120px] flex items-center justify-center`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Joining...
                </>
              ) : 'Join Waitlist'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default CTASection;