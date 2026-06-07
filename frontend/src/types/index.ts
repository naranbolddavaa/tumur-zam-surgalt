export interface User {
  id: number; email: string; lastName: string; firstName: string;
  org: string; role: string; points: number;
}

export interface Material {
  id: number; title: string; content: string;
  regulation: number; chapter: number;
  createdBy?: string; createdAt?: string;
}

export interface Quiz {
  id: number; question: string; options: string[];
  answer: number; explanation: string;
  regulation: number; chapter: number;
}

export interface ChapterData {
  id: string; title: string; regulation: number; number: number;
  cards: CardData[][];
  quizzes: Quiz[];
}

export interface CardData {
  title: string; color: string; desc: string; icon?: string;
}

export interface LeaderboardEntry {
  name: string; org: string; points: number;
  correctAnswers: number; totalAnswers: number; chapters: number;
}

export interface ScoreResponse {
  points: number; correctAnswers: number;
  totalAnswers: number; chapters: string[];
}
