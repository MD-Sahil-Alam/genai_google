"use client";

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CareerTree } from '@/components/career/career-tree';
import { VideoPlayer } from '@/components/video/video-player';
import { useStore } from '@/lib/store';
import { getCareerTree } from '@/lib/api';
import { CareerNode, Resource } from '@/types';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Button } from '@/components/ui/button';
import { ArrowLeft, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function CareerTreePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { currentCareer, setCurrentCareer, setLoading, isLoading } = useStore();
  const [selectedNode, setSelectedNode] = useState<CareerNode | null>(null);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [showResourcePanel, setShowResourcePanel] = useState(false);

  const careerId = searchParams.get('career') || 'fullstack-dev';

  useEffect(() => {
    loadCareerTree();
  }, [careerId]);

  const loadCareerTree = async () => {
    setLoading(true);
    const response = await getCareerTree(careerId);
    if (response.success && response.data) {
      setCurrentCareer(response.data);
    }
    setLoading(false);
  };

  const handleNodeClick = (node: CareerNode) => {
    if (node.locked) return;
    setSelectedNode(node);
    if (node.resources.length > 0) {
      setSelectedResource(node.resources[0]);
      setShowResourcePanel(true);
    }
  };

  const handleResourceProgress = (watchedSeconds: number) => {
    // Progress is handled in the VideoPlayer component
    console.log('Progress:', watchedSeconds);
  };

  const handleResourceComplete = () => {
    if (selectedNode && selectedResource && currentCareer) {
      // Mark resource as completed
      const updatedNodes = currentCareer.nodes.map(node => {
        if (node.id === selectedNode.id) {
          const updatedResources = node.resources.map(resource => {
            if (resource.id === selectedResource.id) {
              return { ...resource, completed: true };
            }
            return resource;
          });
          
          // Check if all resources are completed
          const allCompleted = updatedResources.every(r => r.completed);
          return { 
            ...node, 
            resources: updatedResources,
            completed: allCompleted
          };
        }
        return node;
      });

      setCurrentCareer({ ...currentCareer, nodes: updatedNodes });
    }
  };

  const getNextResource = () => {
    if (!selectedNode) return null;
    const currentIndex = selectedNode.resources.findIndex(r => r.id === selectedResource?.id);
    return selectedNode.resources[currentIndex + 1] || null;
  };

  const handleNextResource = () => {
    const nextResource = getNextResource();
    if (nextResource) {
      setSelectedResource(nextResource);
    } else {
      // All resources completed, close panel
      setShowResourcePanel(false);
      setSelectedNode(null);
      setSelectedResource(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <p className="text-gray-600">Loading your career roadmap...</p>
        </div>
      </div>
    );
  }

  if (!currentCareer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📚</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Career not found</h2>
          <p className="text-gray-600 mb-6">The career path you're looking for doesn't exist.</p>
          <Button onClick={() => router.push('/recommendations')}>
            Back to Recommendations
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 relative">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/recommendations')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Recommendations
            </Button>
            
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {currentCareer.title}
              </h1>
              <p className="text-gray-600">{currentCareer.description}</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Badge variant="secondary">
              {currentCareer.nodes.filter(n => n.completed).length} / {currentCareer.nodes.length} completed
            </Badge>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex">
        {/* Career Tree */}
        <div className={`transition-all duration-300 ${showResourcePanel ? 'w-1/2' : 'w-full'}`}>
          <CareerTree
            nodes={currentCareer.nodes}
            timeline={currentCareer.timeline}
            onNodeClick={handleNodeClick}
            selectedNode={selectedNode || undefined}
          />
        </div>

        {/* Resource Panel */}
        {showResourcePanel && selectedResource && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="w-1/2 bg-white border-l border-gray-200 overflow-y-auto"
          >
            <div className="p-6">
              {/* Panel header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {selectedNode?.title}
                  </h2>
                  <p className="text-gray-600">{selectedNode?.description}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowResourcePanel(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Resource content */}
              <div className="space-y-6">
                {selectedResource.type === 'youtube' || selectedResource.type === 'video' ? (
                  <VideoPlayer
                    resource={selectedResource}
                    onProgress={handleResourceProgress}
                    onComplete={handleResourceComplete}
                  />
                ) : (
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {selectedResource.title}
                    </h3>
                    <p className="text-gray-600">
                      {selectedResource.content || 'Resource content will be loaded here.'}
                    </p>
                  </div>
                )}

                {/* Resource navigation */}
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    {selectedNode && selectedResource
                      ? (() => {
                          const idx = selectedNode.resources.findIndex(r => r.id === selectedResource.id);
                          return idx !== -1
                            ? `Resource ${idx + 1} of ${selectedNode.resources.length}`
                            : "Resource not found";
                        })()
                      : "No resource selected"}
                  </div>
                  
                  {getNextResource() ? (
                    <Button
                      onClick={handleNextResource}
                      disabled={!selectedResource.completed}
                    >
                      Next Resource
                    </Button>
                  ) : (
                    <Badge className="bg-green-100 text-green-800">
                      All resources completed!
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}