import React, { useState, useEffect, useRef } from 'react';
import type { Problem } from '../types';
import CheckIcon from './icons/CheckIcon';
import XIcon from './icons/XIcon';
import BookmarkIcon from './icons/BookmarkIcon';

interface PracticeScreenProps {
  problem: Problem;
  currentProblemNumber: number;
  totalProblems: number;
  maxDigits: number;
  showCheckButton: boolean;
  onAnswerUpdate: (answer: string | null) => void;
  onNavigate: (direction: 'next' | 'prev') => void;
  onToggleMark: () => void;
  onFinishPractice: () => void;
}

const PracticeScreen: React.FC<PracticeScreenProps> = ({
  problem,
  currentProblemNumber,
  totalProblems,
  maxDigits,
  showCheckButton,
  onAnswerUpdate,
  onNavigate,
  onToggleMark,
  onFinishPractice,
}) => {
  const problemWidth = maxDigits + 1;
  const [answerDigits, setAnswerDigits] = useState<string[]>(Array(problemWidth).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    const initialDigits = (problem.userAnswer ?? '').padStart(problemWidth, ' ').split('').map(c => c === ' ' ? '' : c);
    setAnswerDigits(initialDigits);

    setFeedback(null);
    setHasSubmitted(false);
    
    if (problem.userAnswer === null && inputRefs.current[problemWidth - 1]) {
      inputRefs.current[problemWidth - 1]?.focus();
    }
  }, [problem, problemWidth]);

  const handleAnswerChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const { value } = e.target;
    if (!/^[0-9]?$/.test(value)) return;

    const newDigits = [...answerDigits];
    newDigits[index] = value;
    setAnswerDigits(newDigits);

    const newAnswerString = newDigits.map(d => d || ' ').join('');
    
    if (newAnswerString.trim() === '') {
      onAnswerUpdate(null);
    } else {
      onAnswerUpdate(newAnswerString);
    }

    if (value && index > 0) {
        inputRefs.current[index - 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
      if (e.key === 'Backspace' && answerDigits[index] === '') {
          e.preventDefault();
          if (index > 0) {
              inputRefs.current[index - 1]?.focus();
          }
      } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          if (index > 0) {
              inputRefs.current[index - 1]?.focus();
          }
      } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          if (index < problemWidth - 1) {
              inputRefs.current[index + 1]?.focus();
          }
      }
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (problem.userAnswer === null || !showCheckButton) return;
    
    setHasSubmitted(true);
    const userAnswerNumber = parseInt((problem.userAnswer ?? '').replace(/\s/g, ''), 10);
    const isCorrect = !isNaN(userAnswerNumber) && userAnswerNumber === problem.correctAnswer;
    setFeedback(isCorrect ? 'correct' : 'incorrect');

    if (isCorrect) {
        setTimeout(() => {
            if (currentProblemNumber < totalProblems) {
                onNavigate('next');
            } else {
                onFinishPractice();
            }
        }, 1200);
    } else {
         setTimeout(() => {
            setFeedback(null);
            setHasSubmitted(false);
         }, 1500);
    }
  };
  
  const getFeedbackBorderStyle = () => {
    if (feedback === 'correct') return 'border-green-400';
    if (feedback === 'incorrect') return 'border-red-400';
    return 'border-white';
  };

  const getButtonText = () => {
    if (feedback === 'correct') return '¡Correcto!';
    if (feedback === 'incorrect') return 'Inténtalo de nuevo';
    return 'Comprobar';
  };
  
  const paddedNum1 = String(problem.num1).padStart(problemWidth, ' ');
  const paddedNum2WithOperator = `${problem.operator}${String(problem.num2).padStart(problemWidth - 1, ' ')}`;

  return (
    <div
      className={`relative bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border-4 animate-fade-in transition-colors duration-300 ${getFeedbackBorderStyle()}`}
    >
      {feedback && (
        <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center rounded-xl z-20">
          {feedback === 'correct' ? (
            <CheckIcon className="w-32 h-32 text-green-500 animate-pop-in" />
          ) : (
            <XIcon className="w-32 h-32 text-red-500 animate-pop-in" />
          )}
        </div>
      )}
      <div className="flex justify-between items-center mb-2">
        <span className="text-lg font-bold text-purple-700">Operación</span>
        <span className="text-lg font-bold text-gray-600">
          {currentProblemNumber} / {totalProblems}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
        <div
          className="bg-gradient-to-r from-pink-400 to-purple-500 h-4 rounded-full transition-all duration-500"
          style={{ width: `${(currentProblemNumber / totalProblems) * 100}%` }}
        ></div>
      </div>

      <form onSubmit={handleSubmit} className="relative">
        <button
          type="button"
          onClick={onToggleMark}
          aria-label="Marcar para revisar"
          className="absolute top-0 right-0 p-2 rounded-full hover:bg-yellow-100 transition-colors z-10"
        >
          <BookmarkIcon
            filled={problem.markedForReview}
            className={`w-8 h-8 ${
              problem.markedForReview ? 'text-yellow-500' : 'text-gray-400'
            }`}
          />
        </button>

        <div className="bg-blue-50/50 p-6 rounded-lg border-2 border-dashed border-blue-200 mt-2">
          <div className="text-right text-7xl font-black font-mono text-gray-800 tracking-wider whitespace-pre">
            <div>{paddedNum1}</div>
            <div>{paddedNum2WithOperator}</div>
          </div>
          <hr className="my-4 border-t-4 border-gray-700" />
          <div className="flex justify-end font-mono text-7xl font-black text-green-600 tracking-wider gap-1" dir="ltr">
             {answerDigits.map((digit, index) => (
                <input
                  key={index}
                  ref={el => { inputRefs.current[index] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleAnswerChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onFocus={(e) => e.target.select()}
                  className="w-14 h-20 bg-blue-100/40 text-center flex items-center justify-center outline-none rounded-lg border-b-4 border-blue-200 focus:bg-blue-100 focus:ring-2 focus:ring-blue-400"
                  aria-label={`dígito de la respuesta ${index + 1}`}
                  disabled={hasSubmitted}
                />
             ))}
          </div>
        </div>

        {showCheckButton && (
          <button
            type="submit"
            disabled={problem.userAnswer === null || hasSubmitted}
            className="mt-6 w-full bg-blue-500 text-white font-black text-2xl py-4 rounded-xl hover:bg-blue-600 transition-transform transform hover:scale-105 shadow-lg disabled:bg-gray-400 disabled:scale-100 disabled:cursor-not-allowed"
          >
            {getButtonText()}
          </button>
        )}
      </form>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <button
          onClick={() => onNavigate('prev')}
          disabled={currentProblemNumber === 1}
          className="w-full bg-gray-200 text-gray-700 font-bold text-xl py-3 rounded-xl hover:bg-gray-300 transition-transform transform hover:scale-105 shadow-md disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed"
        >
          Anterior
        </button>

        {currentProblemNumber < totalProblems ? (
          <button
            onClick={() => onNavigate('next')}
            className="w-full bg-purple-500 text-white font-bold text-xl py-3 rounded-xl hover:bg-purple-600 transition-transform transform hover:scale-105 shadow-md"
          >
            Siguiente
          </button>
        ) : (
          <button
            onClick={onFinishPractice}
            className="w-full bg-green-500 text-white font-black text-2xl py-3 rounded-xl hover:bg-green-600 transition-transform transform hover:scale-105 shadow-lg"
          >
            Revisar
          </button>
        )}
      </div>

      {currentProblemNumber < totalProblems && (
          <div className="mt-4">
              <button
                  onClick={onFinishPractice}
                  className="w-full bg-orange-500 text-white font-bold text-lg py-3 rounded-xl hover:bg-orange-600 transition-transform transform hover:scale-105 shadow-md"
              >
                  Ir a Revisión
              </button>
          </div>
      )}
    </div>
  );
};

export default PracticeScreen;