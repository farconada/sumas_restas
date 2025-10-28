
export type OperationType = 'add' | 'subtract' | 'mixed';

export interface Settings {
  maxDigits: number;
  numProblems: number;
  operationType: OperationType;
  forceCarry: boolean;
  showCheckButton: boolean;
  showResultsInReview: boolean;
}

export interface Problem {
  id: number;
  num1: number;
  num2: number;
  operator: '+' | '-';
  userAnswer: string | null;
  correctAnswer: number;
  markedForReview: boolean;
}