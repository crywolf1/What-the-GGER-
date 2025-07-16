import WordGame from './components/WordGame'
import FarcasterMeta from './components/FarcasterMeta'
import { useFarcasterFrame } from './hooks/useFarcasterFrame'
import './App.css'

function App() {
  const { isReady, isFrameContext, user, error, connectWallet, disconnectWallet, isConnectingWallet } = useFarcasterFrame();

  // Show loading state until Farcaster Frame is ready
  if (!isReady) {
    return (
      <div className="app">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading Word Game...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <FarcasterMeta 
        title="Word Guessing Game"
        description="Guess the 6-letter word from the image clues! 13 challenging words to solve."
        imageUrl="https://what-the-gger.vercel.app/images/ggger.png"
        appUrl="https://what-the-gger.vercel.app"
        splashBackgroundColor="#F2B149"
      />
      
      {/* Show user info or Farcaster prompt */}
      {user ? (
        <div className="farcaster-user-info">
          {user.pfpUrl && (
            <img 
              src={user.pfpUrl} 
              alt={`${user.displayName || user.username}'s profile`}
              className="user-avatar"
              onError={(e) => {
                // Hide image if it fails to load
                e.currentTarget.style.display = 'none';
              }}
            />
          )}
          <div className="user-details">
            <p>Welcome, {user.displayName || user.username}!</p>
            <span className="user-fid">FID: {user.fid}</span>
            {user.walletAddress && (
              <span className="user-wallet">
                Wallet: {user.walletAddress.slice(0, 6)}...{user.walletAddress.slice(-4)}
              </span>
            )}
            {isFrameContext && !user.walletAddress && (
              <button 
                onClick={connectWallet} 
                disabled={isConnectingWallet}
                className="wallet-connect-btn-small"
              >
                {isConnectingWallet ? 'Connecting...' : 'Connect Wallet'}
              </button>
            )}
            {user.connectedViaWallet && (
              <button onClick={disconnectWallet} className="disconnect-btn">
                Disconnect Wallet
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="farcaster-prompt-section">
          <h3>🎯 Welcome to "What the gger"</h3>
          <p>For the best experience and to save your scores to the global leaderboard:</p>
          <div className="farcaster-instructions">
            <p>📱 <strong>Open this app in Farcaster (Warpcast)</strong></p>
            <p>🔗 Share this link in a Farcaster cast or DM</p>
            <p>🎮 Connect your wallet and compete on the leaderboard!</p>
          </div>
          {!isFrameContext && (
            <div className="outside-farcaster-notice">
              <p>You're currently viewing outside Farcaster. You can still play, but scores won't be saved.</p>
            </div>
          )}
        </div>
      )}
      
      {error && (
        <div className="error-message">
          <p>⚠️ {error}</p>
        </div>
      )}
      
      <WordGame />
    </div>
  )
}

export default App
