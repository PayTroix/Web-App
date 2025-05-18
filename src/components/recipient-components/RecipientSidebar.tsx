'use client'
import React, { FC, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { JSX } from 'react/jsx-runtime';
import WalletButton from '../WalletButton';
import LeaveRequest from './LeaveRequest';
import { MdOutlineDashboard } from "react-icons/md";

interface NavItem {
  label: string;
  href: string;
  icon: JSX.Element;
}

export const Header: FC = () => {
  const [showLeaveRequest, setShowLeaveRequest] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="flex justify-between items-center px-4 md:px-6 py-4 bg-black h-20 border-b border-gray-800/50 sticky top-0 z-30">
        <div className="flex items-center gap-4">
          {/* Mobile menu button */}
          <button 
            className="md:hidden text-gray-400 hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {mobileMenuOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <path d="M3 12h18M3 6h18M3 18h18" />
              )}
            </svg>
          </button>
          
          <Image 
            src="/logo.png" 
            alt="Logo" 
            width={120} 
            height={40}
            className="transition-transform hover:scale-105 w-24 md:w-32 h-auto" 
          />
        </div>
        
        <div className="flex items-center gap-3 md:gap-6">
          <button
            onClick={() => setShowLeaveRequest(true)}
            className="flex items-center gap-2 px-3 py-2 md:px-4  text-blue-400 rounded-lg transition-all text-sm md:text-base transform hover:scale-105 whitespace-nowrap"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 md:w-5 md:h-5">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <span className="">Leave Request</span>
           
          </button>

          <WalletButton className="scale-90 md:scale-100" />
        </div>
      </header>

      {/* Modal Overlay */}
      {showLeaveRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center px-4">
          <div className="relative w-full max-w-4xl">
            <LeaveRequest onClose={() => setShowLeaveRequest(false)} />
          </div>
        </div>
      )}
    </>
  );
};

export const Sidebar: FC = () => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const mainNavItems: NavItem[] = [
    {
      label: 'Dashboard',
      href: '/recipient',
      icon: <MdOutlineDashboard className="text-blue-500" size={20} />,
    },
    {
      label: 'Wallet',
      href: '/wallet',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    {
      label: 'Salary Advance',
      href: '/salary-advance',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    
  ];

  const settingsItem: NavItem = {
    label: 'Settings',
    href: '/settings',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1-2 2 2 2 0 0 1-2-2h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  };

  const renderNavItem = (item: NavItem) => {
    const isActive = pathname === item.href;
    return (
      <Link 
        key={item.href} 
        href={item.href}
        className={`flex items-center py-3 px-4 rounded-lg mb-2 transition-colors ${
          isActive 
            ? 'bg-blue-950 text-blue-500' 
            : 'text-gray-400 hover:bg-[#01182C] hover:text-white'
        }`}
        title={isCollapsed ? item.label : ''}
        onClick={() => setMobileMenuOpen(false)}
      >
        <span className={`${isCollapsed ? '' : 'mr-3'}`}>
          {item.icon}
        </span>
        {!isCollapsed && <span>{item.label}</span>}
      </Link>
    );
  };

  return (
    <>
      {/* Mobile sidebar overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-60 z-10 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <aside className={`
        ${isCollapsed ? 'w-16' : 'w-64'} 
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        min-h-screen bg-black text-white flex flex-col 
        transition-all duration-300 fixed md:relative
        z-20 border-r border-gray-800/50
      `}>
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-6 w-6 h-6 rounded-full 
            bg-black flex items-center justify-center text-white 
            shadow-lg hover:bg-blue-600 transition-all duration-300
            border border-gray-800 hover:border-blue-500
            transform hover:scale-110 hidden md:flex"
        >
          {isCollapsed ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 transition-transform duration-300">
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 transition-transform duration-300">
              <path d="M19 12H5" />
              <path d="m12 19-7-7 7-7" />
            </svg>
          )}
        </button>

        <nav className="px-4 py-6 flex flex-col h-full">
          {mainNavItems.map(renderNavItem)}
          <div className="mt-auto">
            <hr className="border-gray-800 my-4" />
            {renderNavItem(settingsItem)}
          </div>
        </nav>
      </aside>
    </>
  );
};

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-black">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-4 md:p-6 overflow-auto bg-neutral-950 
          md:ml-0 transition-all duration-300">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;