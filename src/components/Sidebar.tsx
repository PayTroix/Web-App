'use client'
import React, { FC, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { JSX } from 'react/jsx-runtime';
import WalletButton from './WalletButton';
import CreateRecipient from './CreateRecipient';
import { MdOutlineDashboard } from "react-icons/md";
// import NProgress from 'nprogress';

interface NavItem {
  label: string;
  href: string;
  icon: JSX.Element;
}

export const Header: FC = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="flex justify-between items-center px-4 md:px-6 py-4 bg-black h-20 border-b border-gray-800/50 sticky top-0 z-30">
        <div className="flex items-center gap-4">      {/* Mobile menu button */}
          <button
            className="md:hidden text-gray-400 hover:text-white z-50"
            onClick={() => {
              setMobileMenuOpen(!mobileMenuOpen);
              const sidebarElement = document.querySelector('aside');
              if (sidebarElement) {
                sidebarElement.classList.toggle('-translate-x-full');
              }
            }}
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
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-3 py-2 md:px-4 bg-blue-600 hover:bg-blue-700 rounded-lg transition-all text-sm md:text-base transform hover:scale-105 whitespace-nowrap"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 md:w-5 md:h-5">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <span className="hidden md:inline">Create Recipient</span>
            <span className="md:hidden">Add</span>
          </button>

          <WalletButton className="scale-90 md:scale-100" />
        </div>
      </header>

      {/* Modal Overlay */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center px-4">
          <div className="relative w-full max-w-4xl">
            <CreateRecipient onClose={() => setShowCreateModal(false)} />
          </div>
        </div>
      )}
    </>
  );
};

export const Sidebar: FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const mainNavItems: NavItem[] = [
    {
      label: 'Home',
      href: '/',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
    },
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: <MdOutlineDashboard className="text-blue-500" size={20} />,
    },
    {
      label: 'Recipients',
      href: '/employees',
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
      label: 'Payroll',
      href: '/payroll',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
      ),
    },
    {
      label: 'Leave Management',
      href: '/leaveManagement',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
          <path d="M8 14h.01" />
          <path d="M12 14h.01" />
          <path d="M16 14h.01" />
          <path d="M8 18h.01" />
          <path d="M12 18h.01" />
          <path d="M16 18h.01" />
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

  // Pre-fetch routes when component mounts
  useEffect(() => {
    mainNavItems.forEach(item => {
      router.prefetch(item.href);
    });
    router.prefetch(settingsItem.href);
  }, [router]);

  const renderNavItem = (item: NavItem) => {
    const isActive = pathname === item.href;
    return (
      <Link
        key={item.href}
        href={item.href}
        prefetch={true} // Enable prefetching for smoother transitions
        className={`flex items-center py-3 px-4 rounded-lg mb-2 transition-colors ${isActive
          ? 'bg-blue-950 text-blue-500'
          : 'text-gray-400 hover:bg-[#01182C] hover:text-white'
          }`}
        title={isCollapsed ? item.label : ''}
        onClick={() => {
          setMobileMenuOpen(false);
          // Show loading state while transitioning
          // NProgress.start();
        }}
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
          className="fixed inset-0 bg-black bg-opacity-60 md:hidden z-30"
          onClick={() => {
            setMobileMenuOpen(false);
            const sidebarElement = document.querySelector('aside');
            if (sidebarElement) {
              sidebarElement.classList.add('-translate-x-full');
            }
          }}
        />
      )}<aside className={`
        ${isCollapsed ? 'w-16' : 'w-64'} 
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        min-h-screen bg-black text-white flex flex-col 
        transition-all duration-300 fixed md:relative
        z-40 border-r border-gray-800/50
        md:top-0 top-[80px]
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
          {/* Main nav items including settings */}
          {[...mainNavItems, settingsItem].map(renderNavItem)}

          {/* Remove the settings item from bottom */}
          <div className="mt-auto">
            <hr className="border-gray-800 my-4" />
            {/* You can add other bottom items here if needed */}
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