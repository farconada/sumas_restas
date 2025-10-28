import React, { useState, useRef, useEffect } from 'react';
import type { Problem } from '../types';
import CheckIcon from './icons/CheckIcon';
import XIcon from './icons/XIcon';
import BookmarkIcon from './icons/BookmarkIcon';

interface ReviewProblemDisplayProps {
    problem: Problem;
    maxDigits: number;
    onUpdateAnswer: (problemId: number, newAnswer: string | null) => void;
    showResult?: boolean;
}

const ReviewProblemDisplay: React.FC<ReviewProblemDisplayProps> = ({ problem, maxDigits, onUpdateAnswer, showResult = true }) => {
    const problemWidth = maxDigits + 1;

    const [answerDigits, setAnswerDigits] = useState<string[]>(Array(problemWidth).fill(''));
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        const initialAnswer = (problem.userAnswer ?? '').padStart(problemWidth, ' ');
        setAnswerDigits(initialAnswer.split('').map(c => c === ' ' ? '' : c));
    }, [problem.userAnswer, problemWidth]);

    const handleAnswerChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const { value } = e.target;
        if (!/^[0-9]?$/.test(value)) return;

        const newDigits = [...answerDigits];
        newDigits[index] = value;
        setAnswerDigits(newDigits);

        const newAnswerString = newDigits.map(d => d || ' ').join('');
        
        if (newAnswerString.trim() === '') {
            onUpdateAnswer(problem.id, null);
        } else {
            onUpdateAnswer(problem.id, newAnswerString);
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
    
    const userAnswerNumber = parseInt((problem.userAnswer ?? '').replace(/\s/g, ''), 10);
    const isCorrect = !isNaN(userAnswerNumber) && userAnswerNumber === problem.correctAnswer;

    const getBorderColor = () => {
        if (problem.userAnswer === null) return 'border-gray-300';
        if (!showResult) return 'border-gray-300';
        return isCorrect ? 'border-green-400' : 'border-red-400';
    }
    
    const paddedNum1 = String(problem.num1).padStart(problemWidth, ' ');
    const paddedNum2WithOperator = `${problem.operator}${String(problem.num2).padStart(problemWidth - 1, ' ')}`;

    return (
        <div className={`flex items-center justify-between p-3 rounded-lg bg-white/50 border-2 ${getBorderColor()}`}>
             {problem.markedForReview && <BookmarkIcon filled className="w-6 h-6 text-yellow-500 flex-shrink-0 mr-2" />}
            <div className="font-mono text-xl font-bold text-gray-700 text-right whitespace-pre">
                <div>{paddedNum1}</div>
                <div>{paddedNum2WithOperator}</div>
                <hr className="my-1 border-t-2 border-gray-500"/>
            </div>
            <div className="flex items-center gap-2">
                <div className="flex justify-end font-mono text-xl font-bold gap-1" dir="ltr">
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
                            className={`w-5 h-7 bg-gray-100/50 text-center outline-none focus:bg-blue-100 rounded-md border-b-2 ${getBorderColor()} focus:ring-1 focus:ring-blue-400`}
                            placeholder="_"
                        />
                    ))}
                </div>
                {showResult && problem.userAnswer !== null && (
                    <div className="w-6 h-6">
                        {isCorrect ? 
                        <CheckIcon className="w-6 h-6 text-green-500 animate-pop-in" /> : 
                        <XIcon className="w-6 h-6 text-red-500 animate-pop-in" />}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReviewProblemDisplay;