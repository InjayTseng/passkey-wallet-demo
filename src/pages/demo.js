import { useState } from 'react';
import { useEthereumWallet } from '../hooks/useEthereumWallet';
import { ethers } from 'ethers';
import Layout from '../components/Layout';

export default function Demo() {
  const { 
    status, 
    setStatus,
    address, 
    signatureInfo, 
    registerPasskey, 
    authenticateAndGenerateEthAddress, 
    signMessage 
  } = useEthereumWallet();
  
  const [messageToSign, setMessageToSign] = useState('');
  const [verificationInfo, setVerificationInfo] = useState('');
  const [verificationResult, setVerificationResult] = useState('');

  const handleSignMessage = async () => {
    if (!address) {
      setStatus('Please authenticate and generate an Ethereum address first.');
      return;
    }
    if (messageToSign) {
      await signMessage(messageToSign);
    } else {
      setStatus('Please enter a message to sign.');
    }
  };

  const verifyMessage = () => {
    try {
      const info = JSON.parse(verificationInfo);
      const recoveredAddress = ethers.utils.verifyMessage(ethers.utils.toUtf8String(info.msg), info.sig);
      setVerificationResult(`Recovered signer address: ${recoveredAddress}`);
      if (recoveredAddress.toLowerCase() === info.address.toLowerCase()) {
        setStatus('Signature verified successfully!');
      } else {
        setStatus('Signature verification failed. Addresses do not match.');
      }
    } catch (error) {
      setStatus('Error verifying message: ' + error.message);
      setVerificationResult('');
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Passkey Wallet Demo</h2>
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Wallet Generation</h3>
          {address ? (
            <div>
              <p className="mb-2">Your Ethereum Address:</p>
              <p className="font-mono text-sm break-all bg-gray-100 p-2 rounded">{address}</p>
            </div>
          ) : (
            <div>
              <p className="mb-4">No wallet generated yet. Use the buttons below to create one.</p>
              <button onClick={registerPasskey} className="bg-blue-500 text-white px-4 py-2 rounded mr-2 hover:bg-blue-600 transition-colors">
                Register Passkey
              </button>
              <button onClick={authenticateAndGenerateEthAddress} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors">
                Generate Ethereum Address
              </button>
            </div>
          )}
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Sign Message</h3>
          <input
            type="text"
            value={messageToSign}
            onChange={(e) => setMessageToSign(e.target.value)}
            placeholder="Enter message to sign"
            className="w-full p-2 border rounded mb-2"
          />
          <button onClick={handleSignMessage} className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition-colors">
            Sign Message
          </button>
          {signatureInfo && (
            <div className="mt-4 bg-gray-100 p-3 rounded">
              <p className="text-sm font-semibold">Signature Information:</p>
              <pre className="text-xs overflow-x-auto">{JSON.stringify(signatureInfo, null, 2)}</pre>
            </div>
          )}
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Verify Message</h3>
          <textarea
            value={verificationInfo}
            onChange={(e) => setVerificationInfo(e.target.value)}
            placeholder="Paste signature information here"
            className="w-full p-2 border rounded h-24 mb-2"
          />
          <button onClick={verifyMessage} className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition-colors">
            Verify Message
          </button>
          {verificationResult && (
            <div className="mt-4 bg-gray-100 p-3 rounded">
              <p className="text-sm">{verificationResult}</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">{status}</p>
      </div>
    </Layout>
  );
}