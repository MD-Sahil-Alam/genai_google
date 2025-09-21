import axios from 'axios';
import { AssessmentQuestion, AssessmentAnswer, SkillVector, CareerRecommendation, CareerTree, Resource, ProgressHeartbeat, ApiResponse } from '@/types';

// Configure axios defaults
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
  timeout: 10000,
});

// Mock data for development
const mockQuestions: AssessmentQuestion[] = [
  {
    id: '1',
    type: 'mcq',
    question: 'What type of work environment energizes you most?',
    options: [
      'Collaborative team settings with constant interaction',
      'Quiet spaces where I can focus deeply',
      'Dynamic environments with frequent changes',
      'Structured environments with clear processes'
    ],
    required: true,
  },
  {
    id: '2',
    type: 'slider',
    question: 'How comfortable are you with learning new technologies?',
    min: 1,
    max: 10,
    required: true,
  },
  {
    id: '3',
    type: 'text',
    question: 'Describe a project or achievement you\'re most proud of:',
    required: true,
  },
  {
    id: '4',
    type: 'mcq',
    question: 'When solving problems, you prefer to:',
    options: [
      'Break down complex problems into smaller parts',
      'Look for creative, unconventional solutions',
      'Research and analyze data thoroughly',
      'Collaborate and brainstorm with others'
    ],
    required: true,
  },
  {
    id: '5',
    type: 'slider',
    question: 'How important is work-life balance to you?',
    min: 1,
    max: 10,
    required: true,
  }
];

const mockRecommendations: CareerRecommendation[] = [
  {
    id: 'fullstack-dev',
    title: 'Full Stack Developer',
    matchScore: 95,
    shortDesc: 'Build complete web applications from frontend to backend',
    salary: '₹4LPA - ₹30 LPA+',
    growth: 'High',
    icon: ''
  },
  {
    id: 'data-scientist',
    title: 'Data Scientist',
    matchScore: 88,
    shortDesc: 'Analyze complex data to drive business decisions',
    salary: '₹5 LPA - 20 LPA+',
    growth: 'Very High',
    icon: ''
  },
  {
    id: 'ux-designer',
    title: 'UX Designer',
    matchScore: 82,
    shortDesc: 'Design intuitive user experiences for digital products',
    salary: '₹4.18LPA - ₹14 LPA+',
    growth: 'High',
    icon: ''
  },
  // Add more mock recommendations...
];

const mockCareerTree: CareerTree = {
  id: 'fullstack-dev',
  title: 'Full Stack Developer',
  description: 'Master frontend , backend development and Database',
  timeline: ['2024', '2025'],
nodes: [
  {
    id: 'n1',
    parent: null,
    title: 'Web Fundamentals',
    description: 'HTML, CSS, and JavaScript basics',
    required_level: 0,
    completed: false,
    locked: false,
    resources: [

      {
        id: 'r1a',
        type: 'youtube',
        title: 'Complete HTML CSS JavaScript Course in Hindi',
        external_id: 'kkOuRJ69BRY',
        duration: 14130,
        completed: false
      },
      {
        id: 'r1b',
        type: 'youtube',
        title: 'JavaScript Full Course Tutorial for Beginners in Hindi',
        external_id: '13gLB6hDHR8',
        duration: 25200,
        completed: false
      },
      {
        id: 'r1c',
        type: 'youtube',
        title: 'Create Responsive Multipage Website using HTML, CSS & JavaScript in Hindi',
        external_id: 'NPkPtu61yV4',
        duration: 10800,
        completed: false
      }
    ]
  },
  {
    id: 'n2',
    parent: 'n1',
    title: 'Frontend Framework',
    description: 'React.js development',
    required_level: 1,
    completed: false,
    locked: true,
    resources: [
      {
        id: 'r2',
        type: 'youtube',
        title: 'React Complete Course',
        external_id: 'bMknfKXIFA8',
        duration: 7200,
        completed: false
      },
      {
        id: 'r2a',
        type: 'youtube',
        title: 'React JS Full Course in Hindi – Learn React from scratch to advanced',
        external_id: 'LuNPCSNr-nE',
        duration: 50400,
        completed: false
      },
      {
        id: 'r2b',
        type: 'youtube',
        title: 'Namaste React by Akshay Saini',
        external_id: '83_7HQuIQfU',
        duration: 43200,
        completed: false
      }
    ]
  },
  {
    id: 'n3',
    parent: 'n1',
    title: 'Backend Basics',
    description: 'Server-side programming fundamentals',
    required_level: 1,
    completed: false,
    locked: true,
    resources: [
      {
        id: 'r3',
        type: 'youtube',
        title: 'Node.js Tutorial',
        external_id: 'TlB_eWDSMt4',
        duration: 5400,
        completed: false
      },
      {
        id: 'r3a',
        type: 'youtube',
        title: 'Build Complete RESTful API with NodeJS, Express, MongoDB (Hindi)',
        external_id: 'f4oPDjYMdF4',
        duration: 21600,
        completed: false
      },
      {
        id: 'r3b',
        type: 'youtube',
        title: 'Express JS Crash Course in Hindi',
        external_id: 'L72fhGm1tfE',
        duration: 7200,
        completed: false
      }
    ]
  },
  {
    id: 'n4',
    parent: 'n1',
    title: 'Databases',
    description: 'Database fundamentals with SQL & NoSQL',
    required_level: 1,
    completed: false,
    locked: true,
    resources: [
      {
        id: 'r4',
        type: 'youtube',
        title: 'MongoDB Tutorial in Hindi',
        external_id: 'WL4l73Mncgw',
        duration: 14400,
        completed: false
      },
      {
        id: 'r4a',
        type: 'youtube',
        title: 'SQL Full Course in Hindi | SQL for Beginners',
        external_id: 'Bp703NkC00Q',
        duration: 4920,
        completed: false
      }
    ]
  }
  
]

};

// API functions
export const getAssessmentQuestions = async (): Promise<ApiResponse<AssessmentQuestion[]>> => {
  try {
    // TODO: Replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
    return { success: true, data: mockQuestions };
  } catch (error) {
    return { success: false, error: 'Failed to fetch questions' };
  }
};

export const submitAssessment = async (userId: string, answers: AssessmentAnswer[]): Promise<ApiResponse<SkillVector>> => {
  try {
    // TODO: Replace with actual API call to process answers
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock skill calculation
    const mockSkills: SkillVector = {
      technical: Math.floor(Math.random() * 40) + 60,
      creative: Math.floor(Math.random() * 40) + 40,
      analytical: Math.floor(Math.random() * 40) + 50,
      leadership: Math.floor(Math.random() * 40) + 30,
      communication: Math.floor(Math.random() * 40) + 45,
      problemSolving: Math.floor(Math.random() * 40) + 55,
    };
    
    return { success: true, data: mockSkills };
  } catch (error) {
    return { success: false, error: 'Failed to submit assessment' };
  }
};

export const getRecommendations = async (skills: SkillVector): Promise<ApiResponse<CareerRecommendation[]>> => {
  try {
    // TODO: Replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    return { success: true, data: mockRecommendations };
  } catch (error) {
    return { success: false, error: 'Failed to fetch recommendations' };
  }
};

export const getCareerTree = async (careerId: string): Promise<ApiResponse<CareerTree>> => {
  try {
    // TODO: Replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true, data: mockCareerTree };
  } catch (error) {
    return { success: false, error: 'Failed to fetch career tree' };
  }
};

export const getResource = async (resourceId: string): Promise<ApiResponse<Resource>> => {
  try {
    // TODO: Replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const resource = mockCareerTree.nodes
      .flatMap(node => node.resources)
      .find(r => r.id === resourceId);
    
    if (!resource) {
      return { success: false, error: 'Resource not found' };
    }
    
    return { success: true, data: resource };
  } catch (error) {
    return { success: false, error: 'Failed to fetch resource' };
  }
};

export const sendProgressHeartbeat = async (heartbeat: ProgressHeartbeat): Promise<ApiResponse<{ completed: boolean }>> => {
  try {
    // TODO: Replace with actual API call
    console.log('Progress heartbeat:', heartbeat);
    
    // Mock completion logic - mark as completed if watched 80% or ended
    const watchPercentage = (heartbeat.watchedSeconds / heartbeat.totalDuration) * 100;
    const completed = heartbeat.isEnded || watchPercentage >= 80;
    
    return { success: true, data: { completed } };
  } catch (error) {
    return { success: false, error: 'Failed to send progress' };
  }
};

export default api;