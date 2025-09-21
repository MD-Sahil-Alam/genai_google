"use client";

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@/lib/store';
import { getRecommendations } from '@/lib/api';
import { CareerCard } from './career-card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface RecommendationsGridProps {
  onSelectCareer: (careerId: string) => void;
}

export function RecommendationsGrid({ onSelectCareer }: RecommendationsGridProps) {
  const { skillVector, recommendations, setRecommendations, isLoading, setLoading } = useStore();

  useEffect(() => {
    if (skillVector && recommendations.length === 0) {
      loadRecommendations();
    }
  }, [skillVector]);

  const loadRecommendations = async () => {
    if (!skillVector) return;
    
    setLoading(true);
    const response = await getRecommendations(skillVector);
    if (response.success && response.data) {
      setRecommendations(response.data);
    }
    setLoading(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <p className="text-gray-600">Finding your perfect career matches...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Your Career Recommendations
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            Based on your skills assessment, here are the top career paths that match your profile. 
            Click on any career to explore the learning roadmap!
          </p>
          
          <Button
            onClick={loadRecommendations}
            variant="outline"
            className="inline-flex items-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh Recommendations</span>
          </Button>
        </motion.div>

        {/* Grid */}
        {recommendations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {recommendations.map((career, index) => (
              <CareerCard
                key={career.id}
                career={career}
                onSelect={onSelectCareer}
                index={index}
              />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              No recommendations found
            </h3>
            <p className="text-gray-600 mb-6">
              Please complete the assessment to get personalized career recommendations.
            </p>
            <Button onClick={loadRecommendations}>
              Try Again
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}