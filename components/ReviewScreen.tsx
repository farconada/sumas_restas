import React from 'react';
import type { Problem } from '../types';
import CheckIcon from './icons/CheckIcon';
import XIcon from './icons/XIcon';
import StarIcon from './icons/StarIcon';

interface ReviewScreenProps {
  problems: Problem[];
  onUpdateAnswer: (problemId: number, newAnswer: number | null) => void;
  onFinishReview: () => void;
}

const ReviewScreen: React.FC<ReviewScreenProps> = ({ problems, onUpdateAnswer, onFinishReview }) => {
  const correctCount = problems.filter(p => p.userAnswer === p.correctAnswer).length;
  const totalCount = problems.length;

  return (
    <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-white animate-fade-in">
      <div className="text-center mb-6">
        <div className="flex justify-center items-center gap-2">
          <StarIcon className="w-10 h-10 text-yellow-400" />
          <h1 className="text-4xl font-black text-gray-800">Repasa y Corrige</h1>
          <StarIcon className="w-10 h-10 text-yellow-400" />
        </div>
        <p className="text-purple-600 mt-2 font-semibold">¡Puedes cambiar tus respuestas antes de ver la nota!</p>
      </div>

      <div className="text-center my-4 p-3 bg-purple-100/60 rounded-lg border-2 border-purple-200 animate-fade-in">
        <p className="text-lg font-bold text-purple-700">Nota Provisional</p>
        <p className="text-4xl font-black text-gray-800">{correctCount} / {totalCount}</p>
      </div>

      <div className="space-y-4 max-h-72 overflow-y-auto pr-2">
        {problems.map((p) => {
          const isCorrect = p.userAnswer === p.correctAnswer;
          const borderColor = p.userAnswer === null ? 'border-gray-300' : isCorrect ? 'border-green-400' : 'border-red-400';
          const ringColor = p.userAnswer === null ? 'focus:ring-purple-400' : isCorrect ? 'focus:ring-green-400' : 'focus:ring-red-400';

          return (
            <div
              key={p.id}
              className={`flex items-center justify-between p-3 rounded-lg bg-white/50 border-2 ${borderColor}`}
            >
              <div className="font-mono font-bold text-2xl text-gray-700">
                {p.num1} {p.operator} {p.num2} =
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  value={p.userAnswer ?? ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    onUpdateAnswer(p.id, val === '' ? null : parseInt(val, 10));
                  }}
                  className={`w-28 text-center text-2xl font-bold rounded-md p-2 border-2 ${borderColor} ${ringColor} focus:ring-2 outline-none transition-colors`}
                  placeholder="?"
                />
                <div className="w-8 h-8">
                  {p.userAnswer !== null && (
                    isCorrect ? 
                    <CheckIcon className="w-8 h-8 text-green-500 animate-pop-in" /> : 
                    <XIcon className="w-8 h-8 text-red-500 animate-pop-in" />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8">
        <button
          onClick={onFinishReview}
          className="w-full bg-green-500 text-white font-black text-2xl py-4 rounded-xl hover:bg-green-600 transition-transform transform hover:scale-105 shadow-lg"
        >
          Ver mi nota
        </button>
      </div>
    </div>
  );
};

export default ReviewScreen;