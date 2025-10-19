
export type OperationType = 'add' | 'subtract' | 'mixed';

export interface Settings {
  maxDigits: number;
  numProblems: number;
  operationType: OperationType;
  forceCarry: boolean;
}

export interface Problem {
  id: number;
  num1: number;
  num2: number;
  operator: '+' | '-';
  userAnswer: number | null;
  correctAnswer: number;
}