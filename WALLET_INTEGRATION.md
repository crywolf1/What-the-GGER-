# Farcaster Wallet Integration

## Overview

The app now supports Farcaster's built-in wallet integration, allowing users to connect their wallets directly through the Farcaster frame when using apps like Warpcast. This provides a seamless Web3 experience within the Farcaster ecosystem.

## How It Works

### 1. **Farcaster Frame Context (Primary)**
- When running in Farcaster (Warpcast, etc.), user data comes directly from the frame context
- Includes: `fid`, `username`, `displayName`, `pfpUrl`
- Users can optionally connect their wallet for additional functionality

### 2. **Outside Farcaster (Information Mode)**
- When NOT in Farcaster context, shows educational content about using the app in Farcaster
- App still works for gameplay but scores won't be saved to leaderboard
- Encourages users to open the app in Farcaster for the full experience

## Implementation

### Files Modified:
- `src/hooks/useFarcasterFrame.ts` - Added Farcaster SDK wallet connection
- `src/App.tsx` - Added Farcaster-first UI with wallet integration
- `src/App.css` - Added beautiful gradients and mobile-responsive styles

### Key Features:
- **Farcaster-First**: Designed primarily for Farcaster frame usage
- **SDK Wallet Integration**: Uses `sdk.wallet.ethProvider.request()` for wallet connection
- **Profile + Wallet**: Shows both Farcaster profile AND connected wallet address
- **Graceful Fallback**: Works outside Farcaster but encourages proper usage
- **Educational UI**: Teaches users how to get the best experience

## Farcaster SDK Wallet Integration

### Wallet Connection
```typescript
// Connect wallet through Farcaster SDK
const walletAddresses = await sdk.wallet.ethProvider.request({
  method: "eth_requestAccounts",
});
```

### Benefits of Farcaster Wallet Integration:
1. **No External APIs**: No need for Neynar or other paid services
2. **Native Integration**: Works seamlessly within Farcaster apps
3. **User Trust**: Users stay within their trusted Farcaster environment
4. **Better UX**: No popup windows or external wallet connections

## User Experience

### In Farcaster Frame:
1. User opens app in Warpcast/Farcaster client
2. Profile automatically loaded from frame context
3. Optional: Click "Connect Wallet" to link wallet address
4. Can play game and submit scores with both Farcaster identity and wallet

### Outside Farcaster:
1. User opens app in regular browser
2. Sees beautiful educational screen about Farcaster
3. Can still play the game for fun
4. Scores won't be saved (encourages using Farcaster)
5. Clear instructions on how to get the full experience

## Technical Details

### Wallet Data Storage:
- Farcaster profile: `fid`, `username`, `displayName`, `pfpUrl`
- Wallet connection: `walletAddress`, `connectedViaWallet` flag
- Combined in single user object for easy access

### UI States:
1. **Loading**: While Farcaster SDK initializes
2. **Farcaster + No Wallet**: Shows profile + connect wallet button
3. **Farcaster + Wallet**: Shows profile + wallet address + disconnect option
4. **Outside Farcaster**: Educational content encouraging Farcaster usage

## Deployment

### Environment Variables:
None required! The Farcaster SDK handles everything.

### API Endpoints:
- Removed `api/farcaster-profile.js` (no longer needed)
- Existing leaderboard APIs work with both profile types

## Benefits

1. **Free**: No paid API services required
2. **Native**: Seamless Farcaster integration
3. **Secure**: Uses Farcaster's trusted wallet connection
4. **Educational**: Teaches users about Farcaster benefits
5. **Flexible**: Works with or without wallet connection
6. **Mobile-First**: Beautiful responsive design

## Testing

### Test in Farcaster:
1. Share app URL in Warpcast cast
2. Should load with Farcaster profile
3. Click "Connect Wallet" to test wallet integration
4. Verify wallet address appears in profile

### Test Outside Farcaster:
1. Open app in regular browser
2. Should see educational Farcaster prompt
3. Can still play game but no score saving
4. UI should encourage Farcaster usage

This approach provides the best possible experience while staying within the free Farcaster ecosystem! 🚀
