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
      
      {/* Show user info when in Farcaster context */}
      {isFrameContext && user && (
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
            {!user.walletAddress && (
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
      )}
      
      {error && isFrameContext && (
        <div className="error-message">
          <p>⚠️ {error}</p>
        </div>
      )}
      
      {/* Only show the game if we're in Farcaster context */}
      {isFrameContext ? (
        <WordGame />
      ) : (
        <div className="browser-only-message">
          <div className="farcaster-cta">
            <h2>🚀 Open in Farcaster to Play!</h2>
            <p>This word guessing game is designed for Farcaster (Warpcast).</p>
            <div className="instructions-list">
              <div className="instruction-item">
                <span className="step-number">1</span>
                <span>Copy this URL: <code>https://what-the-gger.vercel.app</code></span>
              </div>
              <div className="instruction-item">
                <span className="step-number">2</span>
                <span>Open Farcaster (Warpcast) app or website</span>
              </div>
              <div className="instruction-item">
                <span className="step-number">3</span>
                <span>Paste the URL in a cast or DM to yourself</span>
              </div>
              <div className="instruction-item">
                <span className="step-number">4</span>
                <span>Tap the link to open the game in Farcaster!</span>
              </div>
            </div>
            <p className="benefit-text">🎯 Connect your wallet, save scores, and compete on the global leaderboard!</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
