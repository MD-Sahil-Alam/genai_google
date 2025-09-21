"use client";

import { motion } from 'framer-motion';
import { CareerRecommendation } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, DollarSign, Star } from 'lucide-react';

interface CareerCardProps {
  career: CareerRecommendation;
  onSelect: (careerId: string) => void;
  index: number;
}

export function CareerCard({ career, onSelect, index }: CareerCardProps) {
  const getMatchColor = (score: number) => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 80) return 'bg-blue-500';
    if (score >= 70) return 'bg-yellow-500';
    return 'bg-gray-500';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }} // <-- fixed here
      className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 h-full flex flex-col"
    >
      {/* Header with match score */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-4">
          <div className="text-4xl mb-2">{career.icon}</div>
          <div className="flex items-center space-x-2">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            <span className="font-bold text-gray-900">{career.matchScore}%</span>
          </div>
        </div>

        {/* Match score bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${career.matchScore}%` }}
            transition={{ delay: index * 0.1 + 0.3, duration: 0.8 }}
            className={`h-full rounded-full ${getMatchColor(career.matchScore)}`}
          />
        </div>

        <Badge 
          variant="secondary" 
          className={`mb-3 ${getMatchColor(career.matchScore)} text-white`}
        >
          {career.matchScore >= 90 ? 'Perfect Match' : 
           career.matchScore >= 80 ? 'Great Match' : 
           career.matchScore >= 70 ? 'Good Match' : 'Potential Match'}
        </Badge>
      </div>

      {/* Content */}
      <div className="px-6 pb-4 flex-1">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {career.title}
        </h3>
        <p className="text-gray-600 mb-4 leading-relaxed">
          {career.shortDesc}
        </p>

        {/* Stats */}
        <div className="space-y-2 mb-6">
          <div className="flex items-center text-sm text-gray-700">
            
            <span>{career.salary}</span>
          </div>
          <div className="flex items-center text-sm text-gray-700">
            <TrendingUp className="w-4 h-4 mr-2 text-blue-600" />
            <span>{career.growth} Growth</span>
          </div>
        </div>
      </div>

      {/* Action */}
      <div className="p-6 pt-0">
        <Button
          onClick={() => onSelect(career.id)}
          className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl py-3 font-medium transition-all duration-200 hover:shadow-lg"
        >
          Explore Career Path
        </Button>
      </div>
    </motion.div>
  );
}