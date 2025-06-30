import type { GameWord } from '../types/game';

// Your custom word data
export const GAME_WORDS: GameWord[] = [
  {
    word: "BURGER",
    imageUrl: "/images/burger.jpg",
    hint: "",
    revealedPositions: [3, 4, 5] // Show ---GER
  },
  {
    word: "BIGGER",
    imageUrl: "/images/bigger.jpg",
    hint: "",
    revealedPositions: [1, 2, 3, 4, 5] // Show -IGGER
  },
  {
    word: "FINGER",
    imageUrl: "/images/finger.jpg",
    hint: "",
    revealedPositions: [1, 3, 4, 5] // Show -I-GER
  },
  {
    word: "FISHER",
    imageUrl: "/images/fisher.jpg",
    hint: "",
    revealedPositions: [4, 5] // Show ----ER
  },
  {
    word: "FATHER",
    imageUrl: "/images/father.jpg",
    hint: "",
    revealedPositions: [4, 5] // Show ----ER
  },
  {
    word: "DIGGER",
    imageUrl: "/images/digger.jpg",
    hint: "",
    revealedPositions: [2, 3, 4, 5] // Show --GGER
  },
  {
    word: "NAGGER",
    imageUrl: "/images/nagger.jpg",
    hint: "",
    revealedPositions: [0, 2, 3, 4, 5] // Show N-GGER
  },
  {
    word: "SINGER",
    imageUrl: "/images/singer.jpg",
    hint: "",
    revealedPositions: [1, 3, 4, 5] // Show -I-GER
  },
  {
    word: "HUGGER",
    imageUrl: "/images/hugger.jpg",
    hint: "",
    revealedPositions: [2, 3, 4, 5] // Show --GGER
  },
  {
    word: "JIGGER",
    imageUrl: "/images/jigger.jpg",
    hint: "",
    revealedPositions: [1, 2, 3, 4, 5] // Show -IGGER
  },
  {
    word: "LOGGER",
    imageUrl: "/images/logger.jpg",
    hint: "",
    revealedPositions: [2, 3, 4, 5] // Show --GGER
  },
  {
    word: "MUGGER",
    imageUrl: "/images/mugger.jpg",
    hint: "",
    revealedPositions: [2, 3, 4, 5] // Show --GGER
  },
  {
    word: "WINGER",
    imageUrl: "/images/winger.jpg",
    hint: "",
    revealedPositions: [1, 3, 4, 5] // Show -I-GER
  }
];

export const getAllWords = (): GameWord[] => {
  return GAME_WORDS;
};
