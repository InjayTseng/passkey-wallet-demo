import { useState, useCallback, useEffect } from 'react';
import { ethers } from 'ethers';

export const useEthereumWallet = () => {
  const [status, setStatus] = useState('');
  const [address, setAddress] = useState('');
  const [signatureInfo, setSignatureInfo] = useState(null);
  const [privateKey, setPrivateKey] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if there's a stored address on component mount
    const storedAddress = localStorage.getItem('walletAddress');
    if (storedAddress) {
      setAddress(storedAddress);
      setIsLoggedIn(true);
    }
  }, []);

  const sha256 = useCallback(async (data) => {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    return new Uint8Array(hashBuffer);
  }, []);

  const registerPasskey = useCallback(async () => {
    setStatus('Registering Passkey...');
    const challenge = new Uint8Array(32);
    crypto.getRandomValues(challenge);
    
    const createCredentialOptions = {
      challenge: challenge,
      rp: {
        name: "Passkey Ethereum Wallet Demo",
        id: window.location.hostname
      },
      user: {
        id: new Uint8Array(16),
        name: "demo@example.com",
        displayName: "Demo User"
      },
      pubKeyCredParams: [{alg: -7, type: "public-key"}],
      authenticatorSelection: {
        authenticatorAttachment: "platform",
        userVerification: "required"
      },
      timeout: 60000
    };

    try {
      const credential = await navigator.credentials.create({
        publicKey: createCredentialOptions
      });
      
      const credentialId = btoa(String.fromCharCode.apply(null, new Uint8Array(credential.rawId)));
      localStorage.setItem('credentialId', credentialId);
      
      setStatus('Passkey registered successfully');
    } catch (error) {
      setStatus('Error registering Passkey: ' + error.message);
    }
  }, []);

  const authenticateAndGenerateEthAddress = useCallback(async () => {
    setStatus('Authenticating and generating Ethereum address...');
    const credentialId = localStorage.getItem('credentialId');
    if (!credentialId) {
      setStatus('No Passkey found. Please register first.');
      return null;
    }

    const challenge = new Uint8Array(32);
    crypto.getRandomValues(challenge);

    const getCredentialOptions = {
      challenge: challenge,
      allowCredentials: [{
        id: Uint8Array.from(atob(credentialId), c => c.charCodeAt(0)),
        type: 'public-key'
      }],
      userVerification: "required",
      timeout: 60000
    };

    try {
      const assertion = await navigator.credentials.get({
        publicKey: getCredentialOptions
      });

      const seed = assertion.response.authenticatorData;
      const privateKeyArray = await sha256(seed);
      const privateKeyHex = '0x' + Array.from(privateKeyArray)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');

      const wallet = new ethers.Wallet(privateKeyHex);
      setStatus('Ethereum address generated successfully');
      setAddress(wallet.address);
      setPrivateKey(privateKeyHex);
      setIsLoggedIn(true);
      localStorage.setItem('walletAddress', wallet.address);
      return wallet.address;
    } catch (error) {
      setStatus('Error authenticating or generating address: ' + error.message);
      return null;
    }
  }, [sha256]);

  const signMessage = useCallback(async (message) => {
    setStatus('Signing message...');
    if (!privateKey) {
      setStatus('No private key available. Please authenticate first.');
      return;
    }

    try {
      const wallet = new ethers.Wallet(privateKey);
      const signature = await wallet.signMessage(message);

      setSignatureInfo({
        address: wallet.address,
        msg: ethers.utils.hexlify(ethers.utils.toUtf8Bytes(message)),
        sig: signature,
        version: "3",
        signer: "Passkey Wallet Demo"
      });

      setStatus('Message signed successfully');
    } catch (error) {
      setStatus('Error signing message: ' + error.message);
    }
  }, [privateKey]);

  const logout = useCallback(() => {
    setAddress('');
    setPrivateKey(null);
    setIsLoggedIn(false);
    localStorage.removeItem('walletAddress');
    setStatus('Logged out successfully');
  }, []);

  return {
    status,
    setStatus,
    address,
    signatureInfo,
    isLoggedIn,
    registerPasskey,
    authenticateAndGenerateEthAddress,
    signMessage,
    logout
  };
};