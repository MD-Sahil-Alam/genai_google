import { create } from 'zustand';
import { User, SkillVector, CareerRecommendation, CareerTree } from '@/types';

interface AppState {
  // User state
  user: User | null;
  setUser: (user: User | null) => void;
  
  // Assessment state
  skillVector: SkillVector | null;
  setSkillVector: (skills: SkillVector) => void;
  
  // Career recommendations
  recommendations: CareerRecommendation[];
  setRecommendations: (recs: CareerRecommendation[]) => void;
  
  // Current career
  currentCareer: CareerTree | null;
  setCurrentCareer: (career: CareerTree | null) => void;
  
  // Progress tracking
  watchProgress: Record<string, number>;
  updateWatchProgress: (resourceId: string, seconds: number) => void;
  
  // UI state
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

export const useStore = create<AppState>((set) => ({
  // User state
  user: {
    id: 'demo-user',
    name: 'Demo User',
    email: 'demo@example.com',
    level: 1,
    xp: 250,
    maxXp: 1000,
  },
  setUser: (user) => set({ user }),
  
  // Assessment state
  skillVector: null,
  setSkillVector: (skillVector) => set({ skillVector }),
  
  // Career recommendations
  recommendations: [],
  setRecommendations: (recommendations) => set({ recommendations }),
  
  // Current career
  currentCareer: null,
  setCurrentCareer: (currentCareer) => set({ currentCareer }),
  
  // Progress tracking
  watchProgress: {},
  updateWatchProgress: (resourceId, seconds) => 
    set((state) => ({ 
      watchProgress: { ...state.watchProgress, [resourceId]: seconds } 
    })),
  
  // UI state
  isLoading: false,
  setLoading: (isLoading) => set({ isLoading }),
}));