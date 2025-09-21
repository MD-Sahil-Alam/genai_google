"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { AssessmentQuestion, AssessmentAnswer } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';

interface QuestionCardProps {
  question: AssessmentQuestion;
  answer: AssessmentAnswer | undefined;
  onAnswer: (answer: AssessmentAnswer) => void;
  onNext: () => void;
  onPrevious: () => void;
  isFirst: boolean;
  isLast: boolean;
  questionNumber: number;
  totalQuestions: number;
}

export function QuestionCard({
  question,
  answer,
  onAnswer,
  onNext,
  onPrevious,
  isFirst,
  isLast,
  questionNumber,
  totalQuestions
}: QuestionCardProps) {
  const [currentValue, setCurrentValue] = useState<string | number>(
    answer?.value ?? (question.type === 'slider' ? 5 : '')
  );

  const handleAnswer = (value: string | number) => {
    setCurrentValue(value);
    onAnswer({ questionId: question.id, value });
  };

  const isAnswered = currentValue !== '' && currentValue !== undefined;

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto"
    >
      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-500 mb-2">
          <span>Question {questionNumber} of {totalQuestions}</span>
          <span>{Math.round((questionNumber / totalQuestions) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className="bg-primary h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Question */}
      <h2 className="text-2xl font-bold text-gray-900 mb-6 leading-relaxed">
        {question.question}
      </h2>

      {/* Answer options */}
      <div className="mb-8">
        {question.type === 'mcq' && question.options && (
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleAnswer(option)}
                className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 ${
                  currentValue === option
                    ? 'border-primary bg-primary/5 text-primary font-medium'
                    : 'border-gray-200 hover:border-gray-300 bg-gray-50'
                }`}
              >
                <span className="flex items-center">
                  <span className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center ${
                    currentValue === option ? 'border-primary bg-primary' : 'border-gray-300'
                  }`}>
                    {currentValue === option && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-2 h-2 bg-white rounded-full"
                      />
                    )}
                  </span>
                  {option}
                </span>
              </motion.button>
            ))}
          </div>
        )}

        {question.type === 'slider' && (
          <div className="space-y-4">
            <div className="px-4">
              <Slider
                value={[currentValue as number]}
                onValueChange={([value]) => handleAnswer(value)}
                max={question.max || 10}
                min={question.min || 1}
                step={1}
                className="w-full"
              />
            </div>
            <div className="flex justify-between text-sm text-gray-500 px-4">
              <span>Not comfortable ({question.min || 1})</span>
              <span className="font-bold text-primary text-lg">{currentValue}</span>
              <span>Very comfortable ({question.max || 10})</span>
            </div>
          </div>
        )}

        {question.type === 'text' && (
          <Textarea
            value={currentValue as string}
            onChange={(e) => handleAnswer(e.target.value)}
            placeholder="Share your thoughts..."
            className="w-full min-h-[120px] text-base"
          />
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={isFirst}
          className="min-w-[100px]"
        >
          Previous
        </Button>

        <Button
          onClick={onNext}
          disabled={!isAnswered}
          className="min-w-[100px] bg-primary hover:bg-primary/90"
        >
          {isLast ? 'Complete' : 'Next'}
        </Button>
      </div>
    </motion.div>
  );
}