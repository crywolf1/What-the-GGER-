import React, { useEffect, useState } from "react";
import { RotateCcw, Share2, Plus, Trophy } from "lucide-react";
import { useWordGame } from "../hooks/useWordGame";
import { useFarcasterFrame } from "../hooks/useFarcasterFrame";
import { useLeaderboard } from "../hooks/useLeaderboard";
import { sdk } from "@farcaster/frame-sdk";
import Leaderboard from "./Leaderboard";
import "./WordGame.css";

const WordGame: React.FC = () => {
  const {
    currentWord,
    currentWordIndex,
    userGuess,
    isAnswered,
    isCorrect,
    isGameComplete,
    isTransitioning,
    results,
    setGuess,
    submitGuess,
    resetGame,
  } = useWordGame();

  const { isFrameContext, user } = useFarcasterFrame();
  const { leaderboard, isLoading, addScore, getUserRank, getUserScore, clearLeaderboard, refreshLeaderboard } = useLeaderboard();
  
  const [showAddMiniApp, setShowAddMiniApp] = useState(false);
  const [addMiniAppDismissed, setAddMiniAppDismissed] = useState(() => {
    // Check localStorage for dismissed state
    if (typeof window !== 'undefined') {
      return localStorage.getItem('addMiniAppDismissed') === 'true';
    }
    return false;
  });
  const [isAppAdded, setIsAppAdded] = useState(() => {
    // Check localStorage for added state
    if (typeof window !== 'undefined') {
      return localStorage.getItem('miniAppAdded') === 'true';
    }
    return false;
  });
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [scoreSubmitted, setScoreSubmitted] = useState(false);
  const [userRank, setUserRank] = useState<number>(-1);

  // Clear any test data on app startup
  useEffect(() => {
    // Check if there are test users in the leaderboard and remove them
    const hasTestData = leaderboard.some(entry => 
      entry.fid === 12345 || entry.fid === 67890 || 
      entry.username === 'testuser' || entry.username === 'anotheruser'
    );
    
    if (hasTestData) {
      console.log('Clearing test data from leaderboard');
      const realEntries = leaderboard.filter(entry => 
        entry.fid !== 12345 && entry.fid !== 67890 &&
        entry.username !== 'testuser' && entry.username !== 'anotheruser'
      );
      
      if (realEntries.length === 0) {
        clearLeaderboard();
      } else {
        // Re-save without test data
        localStorage.setItem('whatTheGgerLeaderboard', JSON.stringify(realEntries));
      }
    }
  }, [leaderboard, clearLeaderboard]);

  // Listen for Farcaster SDK events
  useEffect(() => {
    if (!isFrameContext) return;

    // Listen for frameAdded event
    const handleFrameAdded = () => {
      console.log("Frame added event received");
      setIsAppAdded(true);
      setShowAddMiniApp(false);
      setAddMiniAppDismissed(true);
      
      // Persist to localStorage
      localStorage.setItem('miniAppAdded', 'true');
      localStorage.setItem('addMiniAppDismissed', 'true');
    };

    // Listen for frameRemoved event
    const handleFrameRemoved = () => {
      console.log("Frame removed event received");
      setIsAppAdded(false);
      setAddMiniAppDismissed(false);
      
      // Update localStorage
      localStorage.setItem('miniAppAdded', 'false');
      localStorage.setItem('addMiniAppDismissed', 'false');
    };

    // Register event listeners
    sdk.on('frameAdded', handleFrameAdded);
    sdk.on('frameRemoved', handleFrameRemoved);

    // Cleanup listeners on unmount
    return () => {
      sdk.removeListener('frameAdded', handleFrameAdded);
      sdk.removeListener('frameRemoved', handleFrameRemoved);
    };
  }, [isFrameContext]);

  // Show add mini app prompt when in frame context, not dismissed, and not already added
  useEffect(() => {
    if (isFrameContext && !addMiniAppDismissed && !isAppAdded) {
      // Small delay to let the app load first
      const timer = setTimeout(() => {
        setShowAddMiniApp(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isFrameContext, addMiniAppDismissed, isAppAdded]);

  const handleAddMiniApp = async () => {
    try {
      await sdk.actions.addMiniApp();
      // Don't immediately hide - wait for frameAdded event
      console.log("addMiniApp action completed successfully");
    } catch (error: unknown) {
      console.error("Error adding mini app:", error);
      
      // Handle specific error types
      const errorObj = error as { name?: string };
      if (errorObj.name === 'RejectedByUser') {
        console.log("User rejected adding mini app");
        setShowAddMiniApp(false);
        setAddMiniAppDismissed(true);
        localStorage.setItem('addMiniAppDismissed', 'true');
      } else if (errorObj.name === 'InvalidDomainManifestJson') {
        console.error("Invalid farcaster.json manifest");
        setShowAddMiniApp(false);
        setAddMiniAppDismissed(true);
        localStorage.setItem('addMiniAppDismissed', 'true');
      } else {
        // For other errors, just dismiss
        console.error("Unknown error:", error);
        setShowAddMiniApp(false);
        setAddMiniAppDismissed(true);
        localStorage.setItem('addMiniAppDismissed', 'true');
      }
    }
  };

  const dismissAddMiniApp = () => {
    setShowAddMiniApp(false);
    setAddMiniAppDismissed(true);
    
    // Persist dismissal to localStorage
    localStorage.setItem('addMiniAppDismissed', 'true');
  };

  // Submit score when game completes (for Farcaster users)
  useEffect(() => {
    console.log('Score submission effect triggered:', { isGameComplete, user, scoreSubmitted });
    if (isGameComplete && user && !scoreSubmitted) {
      const correctCount = results.filter(r => r.isCorrect).length;
      console.log('Submitting score:', { correctCount, totalWords: results.length, user });
      
      const submitScore = async () => {
        try {
          await addScore({
            fid: user.fid,
            username: user.username,
            displayName: user.displayName,
            pfpUrl: user.pfpUrl,
            score: correctCount,
            totalWords: results.length,
          });
          setScoreSubmitted(true);
        } catch (error) {
          console.error('Error submitting score:', error);
          setScoreSubmitted(true); // Still mark as submitted to prevent retry
        }
      };
      
      submitScore();
    }
  }, [isGameComplete, user, scoreSubmitted, results, addScore]);

  // Update user rank when game completes
  useEffect(() => {
    if (isGameComplete && user) {
      getUserRank(user.fid).then(rank => {
        setUserRank(rank);
      }).catch(error => {
        console.error('Error fetching user rank:', error);
      });
    }
  }, [isGameComplete, user, getUserRank, leaderboard]);

  const shareScore = async () => {
    const correctCount = results.filter((r) => r.isCorrect).length;
    const totalCount = results.length;

    const shareText = `I survived what the gger with a score of ${correctCount}/${totalCount}. My brain was thinking wild stuff, but I kept it clean. Can you keep your cool and match me?`;

    try {
      if (isFrameContext) {
        // Use Farcaster SDK if in frame context
        await sdk.actions.composeCast({
          text: shareText,
          embeds: ["https://what-the-gger.vercel.app/"],
        });
      } else {
        // Fallback to Web Share API or clipboard
        if (navigator.share) {
          await navigator.share({
            title: "what the gger - My Score",
            text: shareText,
            url: "https://what-the-gger.vercel.app/",
          });
        } else {
          // Fallback to clipboard
          await navigator.clipboard.writeText(
            `${shareText} https://what-the-gger.vercel.app/`
          );
          alert("Score copied to clipboard!");
        }
      }
    } catch (error) {
      console.error("Error sharing score:", error);
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(
          `${shareText} https://what-the-gger.vercel.app/`
        );
        alert("Score copied to clipboard!");
      } catch (clipboardError) {
        console.error("Clipboard fallback failed:", clipboardError);
      }
    }
  };

  const renderWordDisplay = () => {
    if (!currentWord) return null;

    return currentWord.word.split("").map((letter, index) => {
      const isRevealed = currentWord.revealedPositions.includes(index);
      const userLetter = userGuess[index] || "";

      // Show revealed letters, or user's typed letters, or underscores
      let displayLetter = "";
      if (isRevealed) {
        displayLetter = letter;
      } else if (userLetter) {
        displayLetter = userLetter;
      } else {
        displayLetter = "_";
      }

      return (
        <div
          key={index}
          className={`letter-box ${isRevealed ? "revealed" : "user-input"}`}
        >
          {displayLetter}
        </div>
      );
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userGuess.length === 6) {
      submitGuess();
    }
  };

  const canSubmit = userGuess.length === 6 && !isAnswered;
  const correctCount = results.filter((r) => r.isCorrect).length;

  if (isGameComplete) {
    return (
      <div className="word-game final-game">
        <div className="game-header">
          <h1>� Game Complete!</h1>
          <p>
            Final Score: {correctCount}/{results.length}
          </p>
        </div>

        <div className="game-content final-content">
          <div className="score-summary">
            <div className="score-circle">
              <span className="score-number">{correctCount}</span>
              <span className="score-total">/{results.length}</span>
            </div>
            <p className="score-text">
              {correctCount === results.length
                ? "Perfect Score! 🏆"
                : correctCount >= results.length * 0.8
                ? "Great Job! 🌟"
                : correctCount >= results.length * 0.6
                ? "Good Work! 👍"
                : "Keep Practicing! 💪"}
            </p>
            
            {/* User Rank Display */}
            {user && (
              <div className="user-rank">
                {(() => {
                  const userScore = getUserScore(user.fid);
                  if (userRank > 0 && userScore) {
                    return (
                      <p className="rank-text">
                        🎯 Your Rank: #{userRank} • Best: {userScore.score}/{userScore.totalWords} ({userScore.percentage}%)
                      </p>
                    );
                  }
                  return null;
                })()}
              </div>
            )}
          </div>

          <div className="compact-results">
            {results.map((result, index) => (
              <div
                key={index}
                className={`compact-result ${
                  result.isCorrect ? "correct" : "incorrect"
                }`}
              >
                <span className="result-number">{index + 1}</span>
                <span className="result-word">{result.word}</span>
                <span
                  className={`result-status ${
                    result.isCorrect ? "correct" : "incorrect"
                  }`}
                >
                  {result.isCorrect ? "✓" : "✗"}
                </span>
              </div>
            ))}
          </div>

          <div className="action-buttons">
            <button onClick={() => {
              console.log('Leaderboard button clicked');
              console.log('Current leaderboard:', leaderboard);
              setShowLeaderboard(true);
            }} className="leaderboard-button">
              <Trophy size={20} />
              Leaderboard
            </button>
            <button onClick={shareScore} className="share-button">
              <Share2 size={20} />
              Share Score
            </button>
            <button onClick={resetGame} className="play-again-button">
              <RotateCcw size={20} />
              Play Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="word-game">
      {/* Add Mini App Prompt */}
      {showAddMiniApp && (
        <div className="add-miniapp-overlay">
          <div className="add-miniapp-modal">
            <h2>🎯 Add "what the gger" to your Apps!</h2>
            <p>Keep this word guessing game handy for quick access anytime.</p>
            <div className="add-miniapp-buttons">
              <button onClick={handleAddMiniApp} className="add-miniapp-button">
                <Plus size={20} />
                Add to My Apps
              </button>
              <button onClick={dismissAddMiniApp} className="dismiss-button">
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard Modal */}
      {showLeaderboard && (
        <Leaderboard
          leaderboard={leaderboard}
          currentUserFid={user?.fid}
          isLoading={isLoading}
          onClose={() => setShowLeaderboard(false)}
          onRefresh={refreshLeaderboard}
        />
      )}

      <div className="game-header">
        <div className="header-content">
          <div className="title-section">
            <h1>what the gger</h1>
            <p>Word {currentWordIndex + 1} of 13</p>
          </div>
          <button 
            onClick={() => {
              console.log('Header leaderboard button clicked');
              console.log('Current leaderboard:', leaderboard);
              setShowLeaderboard(true);
            }} 
            className="header-leaderboard-button"
            title="View Leaderboard"
          >
            <Trophy size={24} />
          </button>
        </div>
      </div>

      <div className="game-content">
        {currentWord && (
          <>
            {/* Progress indicator */}
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${((currentWordIndex + 1) / 13) * 100}%` }}
              ></div>
            </div>

            {/* Image Display with Loading State */}
            <div className="image-container">
              {isTransitioning || isAnswered ? (
                <div className="image-loading">
                  <div className="loading-spinner"></div>
                  <p>{isAnswered ? "Loading next word..." : "Processing..."}</p>
                </div>
              ) : (
                <img
                  src={currentWord.imageUrl}
                  alt={`Guess word ${currentWordIndex + 1}`}
                  className="game-image"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://via.placeholder.com/400x300?text=Image+Not+Found";
                  }}
                />
              )}
            </div>

            {/* Word Display with live typing */}
            <div className="word-display">{renderWordDisplay()}</div>

            {/* Answer feedback */}
            {isAnswered && (
              <div className="answer-feedback">
                {isCorrect ? (
                  <div className="correct-feedback">
                    <h3>🎉 Correct!</h3>
                    <p>
                      The word was: <strong>{currentWord.word}</strong>
                    </p>
                    <p className="auto-next">Moving to next word...</p>
                  </div>
                ) : (
                  <div className="incorrect-feedback">
                    <h3>❌ Incorrect!</h3>
                    <p>
                      Your guess: <strong>{userGuess}</strong>
                    </p>
                    <p>
                      The correct word was: <strong>{currentWord.word}</strong>
                    </p>
                    <p className="auto-next">Moving to next word...</p>
                  </div>
                )}
              </div>
            )}

            {/* Input Form */}
            {!isAnswered && (
              <form onSubmit={handleSubmit} className="guess-form">
                <input
                  type="text"
                  value={userGuess}
                  onChange={(e) => setGuess(e.target.value)}
                  placeholder="Type your 6-letter guess..."
                  className="guess-input"
                  maxLength={6}
                  autoComplete="off"
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="submit-button"
                >
                  Submit Guess
                </button>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default WordGame;
