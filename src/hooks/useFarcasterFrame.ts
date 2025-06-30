import { useEffect, useState } from 'react';
import { sdk } from '@farcaster/frame-sdk';

interface FarcasterUser {
  fid: number;
  username?: string;
  displayName?: string;
  pfpUrl?: string;
}

interface FarcasterContext {
  isFrameContext: boolean;
  isReady: boolean;
  user?: FarcasterUser;
  error?: string;
}

export const useFarcasterFrame = (): FarcasterContext => {
  const [isFrameContext, setIsFrameContext] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [user, setUser] = useState<FarcasterUser | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);

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
          console.log('Running outside Farcaster frame');
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
    error
  };
};
