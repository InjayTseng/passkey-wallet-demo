import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useEthereumWallet } from '../hooks/useEthereumWallet';

const WalletPage = () => {
  const { address, authenticateAndGenerateEthAddress } = useEthereumWallet();
  const [copySuccess, setCopySuccess] = useState('');

  // Mock data - replace with actual wallet data in a real application
  const balance = 123;
  const currency = "USDC";

  const copyToClipboard = async () => {
    if (address) {
      try {
        await navigator.clipboard.writeText(address);
        setCopySuccess('Copied!');
        setTimeout(() => setCopySuccess(''), 2000);
      } catch (err) {
        setCopySuccess('Failed to copy');
      }
    }
  };

  if (!address) {
    return (
      <Layout>
        <div className="max-w-md mx-auto mt-10 text-center">
          <h2 className="text-2xl font-bold mb-4">Wallet Not Connected</h2>
          <p className="mb-4">Please authenticate to view your wallet.</p>
          <button 
            onClick={authenticateAndGenerateEthAddress} 
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Authenticate & Generate Address
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-md mx-auto mt-10">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-gray-600">
              {address.slice(0, 6)}...{address.slice(-4)}
            </span>
            <button 
              onClick={copyToClipboard}
              className="text-gray-500 hover:text-gray-700 transition-colors"
              title="Copy full address"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
              </svg>
            </button>
          </div>
          {copySuccess && <div className="text-green-500 text-sm mb-2">{copySuccess}</div>}
          <div className="text-center mb-6">
            <h2 className="text-5xl font-bold">{balance}</h2>
            <p className="text-xl text-gray-600">{currency}</p>
          </div>
          <div className="flex justify-between">
            <button className="flex-1 bg-blue-500 text-white py-2 rounded-lg mx-1 hover:bg-blue-600 transition-colors">
              Send
            </button>
            <button className="flex-1 bg-green-500 text-white py-2 rounded-lg mx-1 hover:bg-green-600 transition-colors">
              Receive
            </button>
            <button className="flex-1 bg-purple-500 text-white py-2 rounded-lg mx-1 hover:bg-purple-600 transition-colors">
              Transfer
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default WalletPage;