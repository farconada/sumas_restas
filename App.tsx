
import React, { useState, useCallback } from 'react';
import type { Settings, Problem, OperationType } from './types';
import ConfigScreen from './components/ConfigScreen';
import PracticeScreen from './components/PracticeScreen';
import ResultsScreen from './components/ResultsScreen';
import ReviewScreen from './components/ReviewScreen';

const hasCarry = (n1: number, n2: number): boolean => {
  let s1 = String(n1);
  let s2 = String(n2);
  const len = Math.max(s1.length, s2.length);
  s1 = s1.padStart(len, '0');
  s2 = s2.padStart(len, '0');

  for (let i = len - 1; i >= 0; i--) {
    const digit1 = parseInt(s1[i], 10);
    const digit2 = parseInt(s2[i], 10);
    if (digit1 + digit2 >= 10) {
      return true;
    }
  }
  return false;
};

const hasBorrow = (n1: number, n2: number): boolean => {
    let temp_n1 = n1;
    let temp_n2 = n2;
    while (temp_n2 > 0) {
        if ((temp_n1 % 10) < (temp_n2 % 10)) {
            return true;
        }
        temp_n1 = Math.floor(temp_n1 / 10);
        temp_n2 = Math.floor(temp_n2 / 10);
    }
    return false;
};

const App: React.FC = () => {
  const [gameState, setGameState] = useState<'config' | 'practice' | 'review' | 'results'>('config');
  const [settings, setSettings] = useState<Settings | null>(null);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);

  const generateProblems = useCallback((currentSettings: Settings): Problem[] => {
    const newProblems: Problem[] = [];
    const maxNumber = Math.pow(10, currentSettings.maxDigits) - 1;
    const minNumber = currentSettings.maxDigits > 1 ? Math.pow(10, currentSettings.maxDigits - 1) : 0;

    for (let i = 0; i < currentSettings.numProblems; i++) {
      let num1 = 0, num2 = 0;
      let operator: '+' | '-' = '+';

      if (currentSettings.operationType === 'add') {
        operator = '+';
      } else if (currentSettings.operationType === 'subtract') {
        operator = '-';
      } else {
        operator = Math.random() > 0.5 ? '+' : '-';
      }
      
      const maxRetries = 50;
      for (let attempt = 0; attempt < maxRetries; attempt++) {
        const tempNum1 = Math.floor(Math.random() * (maxNumber - minNumber + 1)) + minNumber;
        const tempNum2 = Math.floor(Math.random() * (maxNumber - minNumber + 1)) + minNumber;
        
        if (operator === '-' && tempNum1 < tempNum2) {
            num1 = tempNum2;
            num2 = tempNum1;
        } else {
            num1 = tempNum1;
            num2 = tempNum2;
        }

        if (!currentSettings.forceCarry) {
          break; 
        }

        if (operator === '+' && hasCarry(num1, num2)) {
          break;
        }

        if (operator === '-' && hasBorrow(num1, num2)) {
          break;
        }
      }

      const correctAnswer = operator === '+' ? num1 + num2 : num1 - num2;

      newProblems.push({
        id: i,
        num1,
        num2,
        operator,
        userAnswer: null,
        correctAnswer,
      });
    }
    return newProblems;
  }, []);

  const handleStartPractice = useCallback((newSettings: Settings) => {
    const newProblems = generateProblems(newSettings);
    setSettings(newSettings);
    setProblems(newProblems);
    setCurrentProblemIndex(0);
    setGameState('practice');
  }, [generateProblems]);

  const handleAnswerSubmit = (answer: number) => {
    const updatedProblems = [...problems];
    updatedProblems[currentProblemIndex].userAnswer = answer;
    setProblems(updatedProblems);

    if (currentProblemIndex < problems.length - 1) {
      setCurrentProblemIndex(currentProblemIndex + 1);
    } else {
      setGameState('review');
    }
  };

  const handleUpdateAnswerInReview = (problemId: number, newAnswer: number | null) => {
    const updatedProblems = problems.map(p => {
        if (p.id === problemId) {
            return { ...p, userAnswer: newAnswer };
        }
        return p;
    });
    setProblems(updatedProblems);
  };

  const handleFinishReview = () => {
    setGameState('results');
  };

  const handleRetryIncorrect = () => {
    const incorrectProblems = problems
      .filter(p => p.userAnswer !== p.correctAnswer)
      .map(p => ({ ...p, userAnswer: null }));
    
    if(settings) {
      setProblems(incorrectProblems);
      setCurrentProblemIndex(0);
      setGameState('practice');
    }
  };

  const handleStartOver = () => {
    setGameState('config');
    setSettings(null);
    setProblems([]);
    setCurrentProblemIndex(0);
  };

  const renderGameState = () => {
    switch (gameState) {
      case 'practice':
        return (
          <PracticeScreen
            problem={problems[currentProblemIndex]}
            currentProblemNumber={currentProblemIndex + 1}
            totalProblems={problems.length}
            maxDigits={settings?.maxDigits || 1}
            onAnswerSubmit={handleAnswerSubmit}
          />
        );
      case 'review':
        return (
          <ReviewScreen
            problems={problems}
            onUpdateAnswer={handleUpdateAnswerInReview}
            onFinishReview={handleFinishReview}
          />
        );
      case 'results':
        return (
          <ResultsScreen
            problems={problems}
            onRetryIncorrect={handleRetryIncorrect}
            onStartOver={handleStartOver}
          />
        );
      case 'config':
      default:
        return <ConfigScreen onStart={handleStartPractice} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 via-pink-200 to-red-200 flex items-center justify-center p-4">
      <main className="w-full max-w-2xl mx-auto">
        {renderGameState()}
      </main>
    </div>
  );
};

export default App;