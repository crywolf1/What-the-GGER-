import { useEffect, useState } from 'react';
import { sdk } from '@farcaster/frame-sdk';

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

export const useFarcasterFrame = (): FarcasterContext => {
  const [isFrameContext, setIsFrameContext] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [user, setUser] = useState<FarcasterUser | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);
  const [isConnectingWallet, setIsConnectingWallet] = useState(false);

  const connectWallet = async () => {
    if (isFrameContext) {
      // In frame context, use Farcaster SDK wallet connection
      setIsConnectingWallet(true);
      try {
        // Request wallet connection through Farcaster SDK
        const walletAddresses = await sdk.wallet.ethProvider.request({
          method: "eth_requestAccounts",
        });

        if (walletAddresses && walletAddresses.length > 0) {
          const walletAddress = walletAddresses[0];
          console.log('Wallet connected via Farcaster:', walletAddress);

          // Update user with wallet address (keep existing Farcaster data)
          if (user) {
            setUser({
              ...user,
              walletAddress,
              connectedViaWallet: true
            });
          }
        }
      } catch (err) {
        console.error('Farcaster wallet connection error:', err);
        setError(err instanceof Error ? err.message : 'Wallet connection failed');
      } finally {
        setIsConnectingWallet(false);
      }
    } else {
      // Fallback for non-frame context - redirect to Farcaster
      setError('Please open this app in Farcaster (Warpcast) to connect your wallet');
    }
  };

  const disconnectWallet = () => {
    if (user && user.connectedViaWallet) {
      // Remove wallet address but keep Farcaster profile
      setUser({
        ...user,
        walletAddress: undefined,
        connectedViaWallet: false
      });
    }
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
          // Not in a frame context
          console.log('Running outside Farcaster frame');
          setIsReady(true);
          // Don't set error here - let App.tsx handle the UI messaging
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
