import { useEffect, useState } from 'react';
import { sdk } from '@farcaster/frame-sdk';

// Type definitions for Ethereum provider
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<string[]>;
      on: (event: string, callback: (...args: unknown[]) => void) => void;
      removeListener: (event: string, callback: (...args: unknown[]) => void) => void;
    };
  }
}

interface FarcasterUser {
  fid: number;
  username?: string;
  displayName?: string;
  pfpUrl?: string;
  walletAddress?: string;
  connectedViaWallet?: boolean;
}

interface FarcasterContext {
  isFrameContext: boolean;
  isReady: boolean;
  user?: FarcasterUser;
  error?: string;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  isConnectingWallet: boolean;
}

// Function to get Farcaster profile from wallet address
const getFarcasterProfileByWallet = async (walletAddress: string): Promise<Partial<FarcasterUser> | null> => {
  try {
    const response = await fetch(`/api/farcaster-profile?walletAddress=${walletAddress}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch profile');
    }
    
    const profile = await response.json();
    return profile;
  } catch (error) {
    console.error('Error fetching Farcaster profile:', error);
    return null;
  }
};

export const useFarcasterFrame = (): FarcasterContext => {
  const [isFrameContext, setIsFrameContext] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [user, setUser] = useState<FarcasterUser | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);
  const [isConnectingWallet, setIsConnectingWallet] = useState(false);

  const connectWallet = async () => {
    if (typeof window === 'undefined' || !window.ethereum) {
      setError('MetaMask or compatible wallet not found');
      return;
    }

    setIsConnectingWallet(true);
    try {
      // Request wallet connection
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length > 0) {
        const walletAddress = accounts[0];
        console.log('Wallet connected:', walletAddress);

        // Try to get Farcaster profile associated with this wallet
        const farcasterProfile = await getFarcasterProfileByWallet(walletAddress);

        if (farcasterProfile) {
          setUser(farcasterProfile as FarcasterUser);
        } else {
          // Create a basic user profile even without Farcaster data
          setUser({
            fid: 0, // Special FID for wallet-only users
            username: `wallet_${walletAddress.slice(-6)}`,
            displayName: `Wallet User`,
            pfpUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${walletAddress}`,
            walletAddress,
            connectedViaWallet: true
          });
        }
      }
    } catch (err) {
      console.error('Wallet connection error:', err);
      setError(err instanceof Error ? err.message : 'Wallet connection failed');
    } finally {
      setIsConnectingWallet(false);
    }
  };

  const disconnectWallet = () => {
    setUser(undefined);
    setError(undefined);
  };

  useEffect(() => {
    const initializeFrame = async () => {
      try {
        // Check if we're running in a Farcaster frame context
        const context = await sdk.context;
        setIsFrameContext(!!context);
        
        if (context) {
          // We're in a Farcaster frame, initialize properly
          await sdk.actions.ready({
            disableNativeGestures: true
          });
          
          setIsReady(true);
          setUser(context.user as FarcasterUser);
          
          console.log('Farcaster Frame initialized:', {
            user: context.user,
            client: context.client
          });
        } else {
          // Not in a frame context, but that's okay
          console.log('Running outside Farcaster frame - wallet connection available');
          setIsReady(true);
        }
      } catch (err) {
        console.warn('Farcaster Frame SDK error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setIsReady(true); // Still allow the app to work
      }
    };

    initializeFrame();
  }, []);

  return {
    isFrameContext,
    isReady,
    user,
    error,
    connectWallet,
    disconnectWallet,
    isConnectingWallet
  };
};
