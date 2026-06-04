export interface CountryRaw {
  name: {
    common: string;
    official: string;
  };
  capital: string[];
  flags: {
    png: string;
    svg: string;
    alt?: string;
  };
}

export interface Country {
  name: string;   
  capital: string; 
  flagSvg: string;
  flagPng: string;
  flagAlt: string;
}


export type QuestionType = "flag" | "capital";


export type AnswerId = "A" | "B" | "C" | "D";


export interface AnswerOption {
  id: AnswerId;
  text: string;
  isCorrect: boolean;
}


export interface QuizQuestion {
  id: string;
  type: QuestionType;
  question: string;
  flagUrl?: string;
  options: AnswerOption[];
  correctAnswer: string;
}


export type GameStatus =
  | "idle"
  | "loading"
  | "playing"
  | "answered"
  | "timeout"
  | "finished";

export interface QuizState {
  questions: QuizQuestion[];
  currentIndex: number;
  score: number;
  status: GameStatus;
  selectedAnswer: string | null;
}


export interface HighScoreData {
  score: number;
  date: string; // ISO string
}



export interface ApiError {
  message: string;
  status?: number;
}
