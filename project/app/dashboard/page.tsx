"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  Target, 
  TrendingUp, 
  Award, 
  Play, 
  Calendar,
  Clock,
  CheckCircle
} from 'lucide-react';

export default function DashboardPage() {
  const { user, currentCareer, skillVector } = useStore();

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to CareerPath</h2>
          <p className="text-gray-600 mb-6">Please complete your assessment to access your dashboard.</p>
          <Button asChild>
            <Link href="/assessment">Start Assessment</Link>
          </Button>
        </div>
      </div>
    );
  }

  const getLevelProgress = () => {
    return (user.xp / user.maxXp) * 100;
  };

  const getCompletedResources = () => {
    if (!currentCareer) return 0;
    return currentCareer.nodes
      .flatMap(node => node.resources)
      .filter(resource => resource.completed).length;
  };

  const getTotalResources = () => {
    if (!currentCareer) return 0;
    return currentCareer.nodes.flatMap(node => node.resources).length;
  };

  const getTopSkills = () => {
    if (!skillVector) return [];
    
    const skills = [
      { name: 'Technical', value: skillVector.technical },
      { name: 'Creative', value: skillVector.creative },
      { name: 'Analytical', value: skillVector.analytical },
      { name: 'Leadership', value: skillVector.leadership },
      { name: 'Communication', value: skillVector.communication },
      { name: 'Problem Solving', value: skillVector.problemSolving },
    ];

    return skills.sort((a, b) => b.value - a.value).slice(0, 3);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user.name}! 👋
          </h1>
          <p className="text-gray-600 text-lg">
            Ready to continue your career journey? Here's your progress so far.
          </p>
        </motion.div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{user.level}</p>
                    <p className="text-gray-600">Current Level</p>
                  </div>
                  <Award className="w-8 h-8 text-yellow-500" />
                </div>
                <Progress value={getLevelProgress()} className="mt-3" />
                <p className="text-sm text-gray-500 mt-2">
                  {user.xp} / {user.maxXp} XP
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {getCompletedResources()}
                    </p>
                    <p className="text-gray-600">Resources Completed</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  {getTotalResources()} total available
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">7</p>
                    <p className="text-gray-600">Day Streak</p>
                  </div>
                  <Calendar className="w-8 h-8 text-blue-500" />
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Keep it up! 🔥
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">2.5h</p>
                    <p className="text-gray-600">Time This Week</p>
                  </div>
                  <Clock className="w-8 h-8 text-purple-500" />
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  +30min from last week
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Current Career Progress */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-2"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="w-5 h-5 text-primary" />
                  <span>Current Career Path</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {currentCareer ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {currentCareer.title}
                      </h3>
                      <Badge variant="secondary">
                        {Math.round((getCompletedResources() / getTotalResources()) * 100)}% Complete
                      </Badge>
                    </div>
                    
                    <p className="text-gray-600">{currentCareer.description}</p>
                    
                    <Progress 
                      value={(getCompletedResources() / getTotalResources()) * 100} 
                      className="h-3"
                    />
                    
                    <div className="flex space-x-4">
                      <Button asChild>
                        <Link href="/career-tree">
                          <BookOpen className="w-4 h-4 mr-2" />
                          Continue Learning
                        </Link>
                      </Button>
                      
                      <Button variant="outline" asChild>
                        <Link href="/recommendations">
                          <TrendingUp className="w-4 h-4 mr-2" />
                          Explore Other Careers
                        </Link>
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No Career Selected
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Take our assessment to get personalized career recommendations.
                    </p>
                    <Button asChild>
                      <Link href="/assessment">Start Assessment</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Skills & Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-6"
          >
            {/* Top Skills */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  <span>Top Skills</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {getTopSkills().map((skill, index) => (
                    <div key={skill.name} className="flex items-center justify-between">
                      <span className="text-gray-700">{skill.name}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${skill.value}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {skill.value}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                
                {!skillVector && (
                  <div className="text-center py-4">
                    <p className="text-gray-500 text-sm mb-2">Complete assessment to see skills</p>
                    <Button size="sm" variant="outline" asChild>
                      <Link href="/assessment">Take Assessment</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline" asChild>
                  <Link href="/career-tree">
                    <Play className="w-4 h-4 mr-2" />
                    Continue Learning
                  </Link>
                </Button>
                
                <Button className="w-full justify-start" variant="outline" asChild>
                  <Link href="/recommendations">
                    <Target className="w-4 h-4 mr-2" />
                    Explore Careers
                  </Link>
                </Button>
                
                <Button className="w-full justify-start" variant="outline" asChild>
                  <Link href="/assessment">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Retake Assessment
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}