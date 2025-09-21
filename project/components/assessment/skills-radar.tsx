"use client";

import { useStore } from '@/lib/store';
import { motion } from 'framer-motion';

export function SkillsRadar() {
  const { skillVector } = useStore();

  if (!skillVector) return null;

  const skills = [
    { name: 'Technical', value: skillVector.technical, color: 'bg-blue-500' },
    { name: 'Creative', value: skillVector.creative, color: 'bg-purple-500' },
    { name: 'Analytical', value: skillVector.analytical, color: 'bg-green-500' },
    { name: 'Leadership', value: skillVector.leadership, color: 'bg-red-500' },
    { name: 'Communication', value: skillVector.communication, color: 'bg-yellow-500' },
    { name: 'Problem Solving', value: skillVector.problemSolving, color: 'bg-indigo-500' },
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
        Your Skill Strengths
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {skills.map((skill, index) => (
          <motion.div
            key={skill.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="space-y-2"
          >
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-700">{skill.name}</span>
              <span className="text-lg font-bold text-gray-900">{skill.value}%</span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${skill.value}%` }}
                transition={{ delay: index * 0.1 + 0.3, duration: 0.8, ease: "easeOut" }}
                className={`h-full rounded-full ${skill.color} shadow-sm`}
              />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
        <h4 className="font-bold text-gray-900 mb-2">Your Top Strengths:</h4>
        <p className="text-gray-700">
          {skills
            .sort((a, b) => b.value - a.value)
            .slice(0, 3)
            .map(skill => skill.name)
            .join(', ')}
        </p>
      </div>
    </div>
  );
}