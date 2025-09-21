"use client";

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CareerNode, Resource } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Lock, CheckCircle, Clock, Book, Video } from 'lucide-react';

interface CareerTreeProps {
  nodes: CareerNode[];
  timeline: string[];
  onNodeClick: (node: CareerNode) => void;
  selectedNode?: CareerNode;
}

export function CareerTree({ nodes, timeline, onNodeClick, selectedNode }: CareerTreeProps) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // Create a tree-like layout inspired by the reference image
  const getNodePosition = (node: CareerNode, index: number, totalNodes: number) => {
    const baseY = 100 + (index * 120);
    const baseX = node.parent ? 400 : 300;
    
    // Add some variation for a more organic tree look
    const variation = Math.sin(index * 0.5) * 50;
    
    return {
      x: baseX + variation,
      y: baseY
    };
  };

  const getNodeIcon = (resources: Resource[]) => {
    const hasVideo = resources.some(r => r.type === 'youtube' || r.type === 'video');
    if (hasVideo) return <Video className="w-5 h-5" />;
    
    const hasArticle = resources.some(r => r.type === 'article');
    if (hasArticle) return <Book className="w-5 h-5" />;
    
    return <Play className="w-5 h-5" />;
  };

  const getNodeColor = (node: CareerNode, index: number) => {
    if (node.completed) return 'bg-green-500';
    if (node.locked) return 'bg-gray-400';
    
    // Use a color palette similar to the reference image
    const colors = [
      'bg-purple-500', 'bg-blue-500', 'bg-red-500', 'bg-orange-500',
      'bg-yellow-500', 'bg-green-500', 'bg-teal-500', 'bg-indigo-500', 'bg-pink-500'
    ];
    
    return colors[index % colors.length];
  };

  const renderConnectionLine = (parentNode: CareerNode, childNode: CareerNode, parentIndex: number, childIndex: number) => {
    const parentPos = getNodePosition(parentNode, parentIndex, nodes.length);
    const childPos = getNodePosition(childNode, childIndex, nodes.length);
    
    return (
      <motion.line
        key={`line-${parentNode.id}-${childNode.id}`}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.6 }}
        transition={{ delay: childIndex * 0.1, duration: 0.8 }}
        x1={parentPos.x + 60}
        y1={parentPos.y + 60}
        x2={childPos.x + 60}
        y2={childPos.y + 60}
        stroke="#6B7280"
        strokeWidth="2"
        strokeDasharray="5,5"
      />
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Timeline header inspired by the reference */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center space-x-8 mb-12"
        >
          {timeline.map((year, index) => (
            <motion.div
              key={year}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-full px-6 py-3 shadow-md border-2 border-gray-200"
            >
              <span className="font-bold text-gray-700">{year}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Tree visualization container */}
        <div className="relative">
          <svg 
            className="absolute inset-0 w-full h-full pointer-events-none" 
            style={{ height: `${nodes.length * 120 + 200}px` }}
          >
            {/* Render connection lines */}
            {nodes.map((node, nodeIndex) => {
              if (!node.parent) return null;
              const parentNode = nodes.find(n => n.id === node.parent);
              if (!parentNode) return null;
              const parentIndex = nodes.findIndex(n => n.id === node.parent);
              return renderConnectionLine(parentNode, node, parentIndex, nodeIndex);
            })}

            {/* Central trunk line */}
            <motion.line
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              x1="360"
              y1="50"
              x2="360"
              y2={nodes.length * 120 + 150}
              stroke="#6B7280"
              strokeWidth="6"
              strokeLinecap="round"
            />
          </svg>

          {/* Nodes */}
          <div className="relative z-10">
            {nodes.map((node, index) => {
              const position = getNodePosition(node, index, nodes.length);
              const isSelected = selectedNode?.id === node.id;
              const isHovered = hoveredNode === node.id;

              return (
                <motion.div
                  key={node.id}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ 
                    opacity: 1, 
                    scale: isSelected ? 1.1 : 1,
                    x: position.x,
                    y: position.y
                  }}
                  transition={{ 
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 300,
                    damping: 25
                  }}
                  whileHover={{ scale: 1.05 }}
                  className="absolute cursor-pointer"
                  onMouseEnter={() => setHoveredNode(node.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                  onClick={() => onNodeClick(node)}
                >
                  {/* Node circle */}
                  <div className="relative">
                    <div
                      className={`
                        w-20 h-20 rounded-full flex items-center justify-center text-white
                        shadow-lg border-4 border-white transition-all duration-200
                        ${getNodeColor(node, index)}
                        ${isSelected ? 'ring-4 ring-primary ring-opacity-50' : ''}
                      `}
                    >
                      {node.completed ? (
                        <CheckCircle className="w-8 h-8" />
                      ) : node.locked ? (
                        <Lock className="w-6 h-6" />
                      ) : (
                        <span className="text-2xl font-bold">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                      )}
                    </div>

                    {/* Status indicators */}
                    <div className="absolute -top-2 -right-2">
                      {node.completed && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center"
                        >
                          <CheckCircle className="w-4 h-4 text-white" />
                        </motion.div>
                      )}
                      {node.locked && (
                        <div className="w-6 h-6 bg-gray-500 rounded-full border-2 border-white flex items-center justify-center">
                          <Lock className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Node info card */}
                  <AnimatePresence>
                    {(isHovered || isSelected) && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.9 }}
                        className="absolute top-24 left-1/2 transform -translate-x-1/2 z-50"
                      >
                        <div className="bg-white rounded-xl shadow-xl p-6 border border-gray-200 min-w-[300px] max-w-[400px]">
                          <h3 className="font-bold text-lg text-gray-900 mb-2">
                            {node.title}
                          </h3>
                          <p className="text-gray-600 text-sm mb-4">
                            {node.description}
                          </p>
                          
                          <div className="flex items-center justify-between mb-4">
                            <Badge variant="outline" className="text-xs">
                              Level {node.required_level}+
                            </Badge>
                            <div className="flex items-center text-xs text-gray-500">
                              <Clock className="w-3 h-3 mr-1" />
                              {node.resources.length} resource{node.resources.length !== 1 ? 's' : ''}
                            </div>
                          </div>

                          <div className="space-y-2">
                            {node.resources.slice(0, 3).map((resource) => (
                              <div key={resource.id} className="flex items-center text-sm text-gray-600">
                                {getNodeIcon([resource])}
                                <span className="ml-2 truncate">{resource.title}</span>
                              </div>
                            ))}
                            {node.resources.length > 3 && (
                              <div className="text-xs text-gray-400">
                                +{node.resources.length - 3} more resources
                              </div>
                            )}
                          </div>

                          {!node.locked && (
                            <Button
                              size="sm"
                              className="w-full mt-4"
                              onClick={(e) => {
                                e.stopPropagation();
                                onNodeClick(node);
                              }}
                            >
                              {node.completed ? 'Review' : 'Start Learning'}
                            </Button>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}