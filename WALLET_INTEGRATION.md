# Wallet Connection & Farcaster Integration

## Overview

The app now supports wallet connection as a fallback when not running in a Farcaster Frame environment. This allows users to connect their wallets and potentially link to their Farcaster profiles.

## How It Works

### 1. **Farcaster Frame Context (Primary)**
- When running in Farcaster (Warpcast, etc.), user data comes directly from the frame context
- Includes: `fid`, `username`, `displayName`, `pfpUrl`

### 2. **Wallet Connection (Fallback)**
- When NOT in Farcaster context, users can connect their wallet
- App attempts to look up Farcaster profile associated with the wallet address
- Fallback to generic wallet user if no Farcaster profile found

## Implementation

### Files Modified:
- `src/hooks/useFarcasterFrame.ts` - Added wallet connection logic
- `src/App.tsx` - Added wallet connect UI
- `src/App.css` - Added wallet connection styles
- `api/farcaster-profile.js` - API to lookup Farcaster profiles by wallet

### Key Features:
- **Automatic Detection**: Detects if running in Farcaster frame
- **Wallet Connect**: MetaMask/compatible wallet connection
- **Profile Lookup**: Attempts to find Farcaster profile for wallet
- **Fallback Profile**: Creates generic profile if no Farcaster account found
- **Disconnect Option**: Users can disconnect their wallet

## Integration with Real Farcaster APIs

To use real Farcaster profile lookup (currently using mock data), integrate with:

### 1. **Neynar API** (Recommended)
```javascript
// In api/farcaster-profile.js
const neynarResponse = await fetch(
  `https://api.neynar.com/v2/farcaster/user/bulk-by-address?addresses=${walletAddress}`,
  {
    headers: {
      'api_key': process.env.NEYNAR_API_KEY
    }
  }
);
```

### 2. **Airstack API**
```javascript
// GraphQL query to Airstack
const query = `
  query GetFarcasterUserByAddress($address: Address!) {
    Socials(
      input: {
        filter: {
          dappName: {_eq: farcaster}
          userAssociatedAddresses: {_eq: $address}
        }
        blockchain: ethereum
      }
    ) {
      Social {
        userId
        profileName
        profileDisplayName
        profileImage
      }
    }
  }
`;
```

### 3. **Environment Variables Needed**
Add to Vercel environment variables:
- `NEYNAR_API_KEY` - Your Neynar API key
- `AIRSTACK_API_KEY` - Your Airstack API key

## User Experience

### In Farcaster Frame:
1. User opens app in Warpcast/Farcaster client
2. Profile automatically loaded from frame context
3. Can play game and submit scores immediately

### Outside Farcaster:
1. User opens app in regular browser
2. Sees "Connect Wallet" button
3. Connects MetaMask or compatible wallet
4. App looks up Farcaster profile for wallet address
5. If found: Shows Farcaster profile data
6. If not found: Creates generic wallet user profile
7. Can play game and submit scores

## Benefits

1. **Broader Reach**: Works outside Farcaster ecosystem
2. **Web3 Integration**: Connects to user's wallet identity
3. **Profile Linking**: Links wallet addresses to Farcaster identities
4. **Fallback Experience**: Still works even without Farcaster profile
5. **Score Persistence**: Scores saved regardless of connection method

## Testing

### Test in Farcaster:
- Share app URL in Warpcast
- Should load with Farcaster profile automatically

### Test with Wallet:
- Open app in regular browser
- Click "Connect Wallet"
- Should prompt for MetaMask connection
- Profile should load (mock data for now)

### Test without Connection:
- App should still work for playing
- Scores won't be saved to leaderboard
- Can still see global leaderboard
