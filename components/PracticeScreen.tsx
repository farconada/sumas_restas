import React, { useState, useEffect, useRef } from 'react';
import type { Problem } from '../types';
import CheckIcon from './icons/CheckIcon';
import XIcon from './icons/XIcon';

interface PracticeScreenProps {
  problem: Problem;
  currentProblemNumber: number;
  totalProblems: number;
  maxDigits: number;
  onAnswerSubmit: (answer: number) => void;
}

const PracticeScreen: React.FC<PracticeScreenProps> = ({
  problem,
  currentProblemNumber,
  totalProblems,
  maxDigits,
  onAnswerSubmit,
}) => {
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setAnswer('');
    setFeedback(null);
    inputRef.current?.focus();
  }, [problem]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (answer.trim() === '' || feedback) {
      return;
    }
    const userAnswer = parseInt(answer, 10);
    const isCorrect = userAnswer === problem.correctAnswer;
    
    setFeedback(isCorrect ? 'correct' : 'incorrect');

    setTimeout(() => {
      onAnswerSubmit(userAnswer);
    }, 1200);
  };

  const padNumber = (num: number) => {
    return String(num).padStart(maxDigits, ' ');
  };
  
  const getFeedbackBorderStyle = () => {
    if (feedback === 'correct') return 'border-green-400';
    if (feedback === 'incorrect') return 'border-red-400';
    return 'border-white';
  };

  const getButtonText = () => {
    if (feedback === 'correct') return '¡Correcto!';
    if (feedback === 'incorrect') return 'Incorrecto';
    return 'Siguiente';
  };

  return (
    <div className={`relative bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border-4 animate-fade-in transition-colors duration-300 ${getFeedbackBorderStyle()}`}>
      {feedback && (
        <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center rounded-xl z-10">
          {feedback === 'correct' ? (
            <CheckIcon className="w-32 h-32 text-green-500 animate-pop-in" />
          ) : (
            <XIcon className="w-32 h-32 text-red-500 animate-pop-in" />
          )}
        </div>
      )}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-lg font-bold text-purple-700">Operación</span>
          <span className="text-lg font-bold text-gray-600">
            {currentProblemNumber} / {totalProblems}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className="bg-gradient-to-r from-pink-400 to-purple-500 h-4 rounded-full transition-all duration-500"
            style={{ width: `${(currentProblemNumber / totalProblems) * 100}%` }}
          ></div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="bg-blue-50/50 p-6 rounded-lg border-2 border-dashed border-blue-200">
            <div className="text-right text-7xl font-black font-mono text-gray-800 tracking-wider">
                <div>{padNumber(problem.num1)}</div>
                <div className="flex justify-end items-center">
                    <span className="text-5xl mr-4">{problem.operator}</span>
                    <span>{padNumber(problem.num2)}</span>
                </div>
            </div>
            <hr className="my-4 border-t-4 border-gray-700" />
            <input
                ref={inputRef}
                type="number"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="?"
                className="w-full text-right text-7xl font-black font-mono bg-transparent text-green-600 outline-none pr-1 disabled:opacity-50"
                autoFocus
                disabled={!!feedback}
            />
        </div>
        
        <button
          type="submit"
          disabled={!!feedback}
          className="mt-8 w-full bg-blue-500 text-white font-black text-2xl py-4 rounded-xl hover:bg-blue-600 transition-transform transform hover:scale-105 shadow-lg disabled:bg-gray-400 disabled:scale-100 disabled:cursor-not-allowed"
        >
          {getButtonText()}
        </button>
      </form>
    </div>
  );
};

export default PracticeScreen;