
import React, { useState } from 'react';
import type { Settings, OperationType } from '../types';
import StarIcon from './icons/StarIcon';

interface ConfigScreenProps {
  onStart: (settings: Settings) => void;
}

const ConfigScreen: React.FC<ConfigScreenProps> = ({ onStart }) => {
  const [maxDigits, setMaxDigits] = useState(2);
  const [numProblems, setNumProblems] = useState(10);
  const [operationType, setOperationType] = useState<OperationType>('mixed');
  const [forceCarry, setForceCarry] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (maxDigits > 0 && numProblems > 0) {
      onStart({ maxDigits, numProblems, operationType, forceCarry });
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-white">
      <div className="text-center mb-8">
        <div className="flex justify-center items-center gap-2">
            <StarIcon className="w-8 h-8 text-yellow-400" />
            <h1 className="text-4xl font-black text-gray-800">Práctica de Mates</h1>
            <StarIcon className="w-8 h-8 text-yellow-400" />
        </div>
        <p className="text-purple-600 mt-2 font-semibold">¡Configura tu juego y a practicar!</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="maxDigits" className="block text-lg font-bold text-gray-700 mb-2">Máximo número de dígitos:</label>
          <input
            type="number"
            id="maxDigits"
            value={maxDigits}
            onChange={(e) => setMaxDigits(Math.max(1, parseInt(e.target.value, 10)))}
            min="1"
            max="5"
            className="w-full p-3 text-center text-xl font-bold bg-purple-50 border-2 border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
          />
        </div>

        <div>
          <label htmlFor="numProblems" className="block text-lg font-bold text-gray-700 mb-2">Número de operaciones:</label>
          <input
            type="number"
            id="numProblems"
            value={numProblems}
            onChange={(e) => setNumProblems(Math.max(1, parseInt(e.target.value, 10)))}
            min="1"
            max="50"
            className="w-full p-3 text-center text-xl font-bold bg-pink-50 border-2 border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition"
          />
        </div>

        <div>
          <label className="block text-lg font-bold text-gray-700 mb-3">Tipo de operación:</label>
          <div className="grid grid-cols-3 gap-3">
            {(['add', 'subtract', 'mixed'] as OperationType[]).map((op) => (
              <button
                key={op}
                type="button"
                onClick={() => setOperationType(op)}
                className={`p-4 rounded-lg text-xl font-bold transition-all duration-200 ${
                  operationType === op
                    ? 'bg-purple-500 text-white scale-105 shadow-lg'
                    : 'bg-white text-purple-500 hover:bg-purple-100'
                }`}
              >
                {op === 'add' ? 'Suma' : op === 'subtract' ? 'Resta' : 'Mezcla'}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center p-3 bg-purple-50 rounded-lg border-2 border-purple-200">
            <input
                type="checkbox"
                id="forceCarry"
                checked={forceCarry}
                onChange={(e) => setForceCarry(e.target.checked)}
                className="w-5 h-5 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 cursor-pointer"
            />
            <label htmlFor="forceCarry" className="ml-3 text-md font-bold text-gray-700 cursor-pointer select-none">
                Forzar llevadas y restas prestando
            </label>
        </div>


        <button
          type="submit"
          className="w-full bg-green-500 text-white font-black text-2xl py-4 rounded-xl hover:bg-green-600 transition-transform transform hover:scale-105 shadow-lg"
        >
          ¡Empezar!
        </button>
      </form>
    </div>
  );
};

export default ConfigScreen;