// Core data types for the Career & Skills Advisor

export interface User {
  id: string;
  name: string;
  email: string;
  level: number;
  xp: number;
  maxXp: number;
  selectedCareerId?: string;
}

export interface AssessmentQuestion {
  id: string;
  type: 'mcq' | 'slider' | 'text';
  question: string;
  options?: string[];
  min?: number;
  max?: number;
  required: boolean;
}

export interface AssessmentAnswer {
  questionId: string;
  value: string | number;
}

export interface SkillVector {
  technical: number;
  creative: number;
  analytical: number;
  leadership: number;
  communication: number;
  problemSolving: number;
}

export interface CareerRecommendation {
  id: string;
  title: string;
  matchScore: number;
  shortDesc: string;
  salary: string;
  growth: string;
  icon: string;
}

export interface Resource {
  id: string;
  type: 'youtube' | 'video' | 'article' | 'task';
  title: string;
  duration?: number; // in seconds
  external_id?: string; // YouTube ID or video URL
  content?: string;
  previewUrl?: string;
  completed: boolean;
}

export interface CareerNode {
  id: string;
  parent: string | null;
  title: string;
  description: string;
  required_level: number;
  resources: Resource[];
  position?: { x: number; y: number };
  completed: boolean;
  locked: boolean;
}

export interface CareerTree {
  id: string;
  title: string;
  description: string;
  timeline: string[];
  nodes: CareerNode[];
}

export interface ProgressHeartbeat {
  userId: string;
  resourceId: string;
  watchedSeconds: number;
  totalDuration: number;
  isEnded: boolean;
  visible: boolean;
}

export interface VideoPlayerProps {
  resource: Resource;
  onProgress: (watchedSeconds: number) => void;
  onComplete: () => void;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}