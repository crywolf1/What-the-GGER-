import React, { useEffect, useState } from "react";
import { RotateCcw, Share2, Plus } from "lucide-react";
import { useWordGame } from "../hooks/useWordGame";
import { useFarcasterFrame } from "../hooks/useFarcasterFrame";
import { sdk } from "@farcaster/frame-sdk";
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

  const { isFrameContext } = useFarcasterFrame();
  
  const [showAddMiniApp, setShowAddMiniApp] = useState(false);
  const [addMiniAppDismissed, setAddMiniAppDismissed] = useState(false);

  // Show add mini app prompt when in frame context and not dismissed
  useEffect(() => {
    if (isFrameContext && !addMiniAppDismissed) {
      setShowAddMiniApp(true);
    }
  }, [isFrameContext, addMiniAppDismissed]);

  const handleAddMiniApp = async () => {
    try {
      await sdk.actions.addMiniApp();
      setShowAddMiniApp(false);
      setAddMiniAppDismissed(true);
    } catch (error) {
      console.error("Error adding mini app:", error);
      // If user rejects or there's an error, just dismiss the prompt
      setShowAddMiniApp(false);
      setAddMiniAppDismissed(true);
    }
  };

  const dismissAddMiniApp = () => {
    setShowAddMiniApp(false);
    setAddMiniAppDismissed(true);
  };

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

      <div className="game-header">
        <h1>what the gger</h1>
        <p>Word {currentWordIndex + 1} of 13</p>
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
