"use client";

import { RecommendationsGrid } from '@/components/career/recommendations-grid';
import { useRouter } from 'next/navigation';

export default function RecommendationsPage() {
  const router = useRouter();

  const handleSelectCareer = (careerId: string) => {
    router.push(`/career-tree?career=${careerId}`);
  };

  return <RecommendationsGrid onSelectCareer={handleSelectCareer} />;
}