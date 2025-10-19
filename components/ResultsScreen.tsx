
import React from 'react';
import type { Problem } from '../types';
import CheckIcon from './icons/CheckIcon';
import XIcon from './icons/XIcon';
import StarIcon from './icons/StarIcon';

interface ResultsScreenProps {
  problems: Problem[];
  onRetryIncorrect: () => void;
  onStartOver: () => void;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({ problems, onRetryIncorrect, onStartOver }) => {
  const correctCount = problems.filter(p => p.userAnswer === p.correctAnswer).length;
  const totalCount = problems.length;
  const incorrectProblemsExist = correctCount < totalCount;

  const scoreMessage = () => {
    const percentage = (correctCount / totalCount) * 100;
    if (percentage === 100) return "¡Felicidades! ¡Todo perfecto!";
    if (percentage >= 80) return "¡Muy bien! ¡Sigue así!";
    if (percentage >= 50) return "¡Buen intento! ¡A seguir practicando!";
    return "¡No te rindas! La práctica hace al maestro.";
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-white">
      <div className="text-center mb-6">
        <div className="flex justify-center items-center gap-2">
            <StarIcon className="w-10 h-10 text-yellow-400" />
            <h1 className="text-4xl font-black text-gray-800">Tus Resultados</h1>
            <StarIcon className="w-10 h-10 text-yellow-400" />
        </div>
        <p className="text-2xl font-bold text-purple-600 mt-2">{scoreMessage()}</p>
        <p className="text-5xl font-black text-gray-700 my-4">
          {correctCount} <span className="text-3xl font-bold text-gray-500">/ {totalCount}</span>
        </p>
      </div>

      <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
        {problems.map((p) => {
          const isCorrect = p.userAnswer === p.correctAnswer;
          return (
            <div
              key={p.id}
              className={`flex items-center justify-between p-3 rounded-lg ${
                isCorrect ? 'bg-green-100' : 'bg-red-100'
              }`}
            >
              <div className="flex items-center gap-4">
                {isCorrect ? <CheckIcon className="w-6 h-6 text-green-600" /> : <XIcon className="w-6 h-6 text-red-600" />}
                <span className="font-mono font-bold text-xl text-gray-700">
                  {p.num1} {p.operator} {p.num2} = {p.correctAnswer}
                </span>
              </div>
              {!isCorrect && (
                <span className="font-bold text-red-600 text-lg">
                  Tu respuesta: <span className="line-through">{p.userAnswer ?? 'N/A'}</span>
                </span>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex flex-col sm:flex-row gap-4">
        {incorrectProblemsExist && (
          <button
            onClick={onRetryIncorrect}
            className="flex-1 bg-orange-500 text-white font-bold text-xl py-3 rounded-lg hover:bg-orange-600 transition-transform transform hover:scale-105"
          >
            Reintentar Fallos
          </button>
        )}
        <button
          onClick={onStartOver}
          className="flex-1 bg-purple-500 text-white font-bold text-xl py-3 rounded-lg hover:bg-purple-600 transition-transform transform hover:scale-105"
        >
          Nuevo Juego
        </button>
      </div>
    </div>
  );
};

export default ResultsScreen;
