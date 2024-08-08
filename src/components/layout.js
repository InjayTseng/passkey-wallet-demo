import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEthereumWallet } from '../hooks/useEthereumWallet';

const Layout = ({ children }) => {
  const router = useRouter();
  const { isLoggedIn, authenticateAndGenerateEthAddress, logout } = useEthereumWallet();

  const handleConnectClick = async () => {
    if (isLoggedIn) {
      logout();
    } else {
      await authenticateAndGenerateEthAddress();
    }
  };

  const NavItem = ({ href, name, icon, isMobile = false }) => {
    const isActive = router.pathname === href;
    const commonClasses = `flex flex-col items-center justify-center ${isActive ? 'text-blue-500' : 'text-gray-500'}`;
    
    return (
      <Link href={href} className={isMobile ? `${commonClasses} px-3 py-2` : `${commonClasses} px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 hover:text-white`}>
        <svg className={`h-6 w-6 ${isMobile ? 'mb-1' : 'mr-2'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          {icon}
        </svg>
        <span className={isMobile ? 'text-xs' : ''}>{name}</span>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Top navigation for larger screens */}
      <nav className="bg-gray-800 md:block hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Link href="/" className="text-white font-bold text-lg">Passkey Wallet</Link>
              </div>
              <div className="ml-10 flex items-baseline space-x-4">
                <NavItem href="/wallet" name="Wallet" icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />} />
                <NavItem href="/demo" name="Demo" icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />} />
                <NavItem href="/settings" name="Settings" icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />} />
              </div>
            </div>
            <div>
              <button
                onClick={handleConnectClick}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  isLoggedIn
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-green-500 hover:bg-green-600 text-white'
                }`}
              >
                {isLoggedIn ? 'Disconnect' : 'Connect Wallet'}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="flex-grow max-w-7xl w-full mx-auto py-6 sm:px-6 lg:px-8 mb-16 md:mb-0">
        {children}
      </main>

      {/* Bottom navigation for mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="flex justify-around">
          <NavItem href="/wallet" name="Wallet" icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />} isMobile={true} />
          <NavItem href="/demo" name="Demo" icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />} isMobile={true} />
          <NavItem href="/settings" name="Settings" icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />} isMobile={true} />
        </div>
      </nav>
    </div>
  );
};

export default Layout;