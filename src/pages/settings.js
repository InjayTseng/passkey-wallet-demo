import React from 'react';
import Layout from '../components/Layout';
import { useEthereumWallet } from '../hooks/useEthereumWallet';

const SettingsPage = () => {
  const { isLoggedIn, address, logout } = useEthereumWallet();

  return (
    <Layout>
      <div className="max-w-2xl mx-auto mt-10">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h1 className="text-2xl font-bold mb-6">Settings</h1>
          
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Login Status</h2>
            <p className="mb-2">
              Status: <span className={`font-bold ${isLoggedIn ? 'text-green-600' : 'text-red-600'}`}>
                {isLoggedIn ? 'Logged In' : 'Logged Out'}
              </span>
            </p>
            {isLoggedIn && (
              <p className="mb-2">
                Wallet Address: <span className="font-mono text-sm break-all">{address}</span>
              </p>
            )}
          </div>
          
          {isLoggedIn && (
            <div>
              <button
                onClick={logout}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
              >
                Logout
              </button>
            </div>
          )}
          
          {!isLoggedIn && (
            <p className="text-gray-600">
              You are currently logged out. Go to the Wallet page to log in.
            </p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default SettingsPage;