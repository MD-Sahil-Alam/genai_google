"use client";

import { ChatAssessment } from '@/components/assessment/chat-assessment';
import { useRouter } from 'next/navigation';

export default function AssessmentPage() {
  const router = useRouter();

  const handleComplete = () => {
    router.push('/recommendations');
  };

  return <ChatAssessment onComplete={handleComplete} />;
}