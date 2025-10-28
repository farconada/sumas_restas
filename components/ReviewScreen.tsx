import React from 'react';
import type { Problem } from '../types';
import StarIcon from './icons/StarIcon';
import ReviewProblemDisplay from './ReviewProblemDisplay';


interface ReviewScreenProps {
  problems: Problem[];
  maxDigits: number;
  showResultsInReview: boolean;
  onUpdateAnswer: (problemId: number, newAnswer: string | null) => void;
  onFinishReview: () => void;
}

const ReviewScreen: React.FC<ReviewScreenProps> = ({ problems, maxDigits, showResultsInReview, onUpdateAnswer, onFinishReview }) => {
  const correctCount = problems.filter(p => {
    const userAnswerNumber = p.userAnswer === null ? NaN : parseInt(p.userAnswer.replace(/\s/g, ''), 10);
    return !isNaN(userAnswerNumber) && userAnswerNumber === p.correctAnswer;
  }).length;
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
      
      {showResultsInReview && (
        <div className="text-center my-4 p-3 bg-purple-100/60 rounded-lg border-2 border-purple-200 animate-fade-in">
          <p className="text-lg font-bold text-purple-700">Nota Provisional</p>
          <p className="text-4xl font-black text-gray-800">{correctCount} / {totalCount}</p>
        </div>
      )}


      <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
        {problems.map((p) => (
           <ReviewProblemDisplay 
              key={p.id}
              problem={p}
              maxDigits={maxDigits}
              onUpdateAnswer={onUpdateAnswer}
              showResult={showResultsInReview}
           />
        ))}
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