export interface GameWord {
  word: string;
  imageUrl: string;
  hint: string;
  revealedPositions: number[]; // Positions to show (0-indexed)
}

export interface GameState {
  words: GameWord[];
  currentWordIndex: number;
  userGuess: string;
  isAnswered: boolean;
  isCorrect: boolean;
  isGameComplete: boolean;
  results: { word: string; guess: string; isCorrect: boolean }[];
}

export type GameAction = 
  | { type: 'SET_GUESS'; payload: string }
  | { type: 'SUBMIT_GUESS' }
  | { type: 'NEXT_WORD' }
  | { type: 'RESET_GAME' };
