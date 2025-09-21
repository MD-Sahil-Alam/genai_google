"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AssessmentQuestion, AssessmentAnswer } from '@/types';
import { QuestionCard } from './question-card';
import { SkillsRadar } from './skills-radar';
import { getAssessmentQuestions, submitAssessment } from '@/lib/api';
import { useStore } from '@/lib/store';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Button } from '@/components/ui/button';

interface ChatAssessmentProps {
  onComplete: () => void;
}

export function ChatAssessment({ onComplete }: ChatAssessmentProps) {
  const { user, setSkillVector, setLoading, isLoading } = useStore();
  const [questions, setQuestions] = useState<AssessmentQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<AssessmentAnswer[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    setLoading(true);
    const response = await getAssessmentQuestions();
    if (response.success && response.data) {
      setQuestions(response.data);
    }
    setLoading(false);
  };

  const handleAnswer = (answer: AssessmentAnswer) => {
    const updatedAnswers = answers.filter(a => a.questionId !== answer.questionId);
    setAnswers([...updatedAnswers, answer]);
  };

  const getCurrentAnswer = (): AssessmentAnswer | undefined => {
    return answers.find(a => a.questionId === questions[currentQuestion]?.id);
  };

  const handleNext = async () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Submit assessment
      if (!user) return;
      
      setLoading(true);
      setIsSubmitted(true);
      
      const response = await submitAssessment(user.id, answers);
      if (response.success && response.data) {
        setSkillVector(response.data);
        setShowResults(true);
      }
      setLoading(false);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSeeRecommendations = () => {
    onComplete();
  };

  if (isLoading && questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <p className="text-gray-600">Loading your personalized assessment...</p>
        </div>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Your Skills Profile
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Based on your responses, here's your personalized skills assessment. 
              Let's find the perfect career matches for you!
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-xl p-8 mb-8"
          >
            <SkillsRadar />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-center"
          >
            <Button
              onClick={handleSeeRecommendations}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-white px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              See Your Top 10 Career Matches
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  if (isSubmitted && isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <p className="text-gray-600">Analyzing your responses...</p>
          <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Career Assessment
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Let's discover your strengths and find the perfect career path for you. 
            Answer these questions honestly for the best recommendations.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {questions[currentQuestion] && (
            <QuestionCard
              key={currentQuestion}
              question={questions[currentQuestion]}
              answer={getCurrentAnswer()}
              onAnswer={handleAnswer}
              onNext={handleNext}
              onPrevious={handlePrevious}
              isFirst={currentQuestion === 0}
              isLast={currentQuestion === questions.length - 1}
              questionNumber={currentQuestion + 1}
              totalQuestions={questions.length}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}