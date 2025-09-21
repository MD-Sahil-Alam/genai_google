"use client";

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { VideoPlayerProps, ProgressHeartbeat } from '@/types';
import { sendProgressHeartbeat } from '@/lib/api';
import { useStore } from '@/lib/store';
import { Play, Pause, Volume2, Maximize, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function VideoPlayer({ resource, onProgress, onComplete }: VideoPlayerProps) {
  const { user, updateWatchProgress } = useStore();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(resource.duration || 0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isVisible, setIsVisible] = useState(true);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const heartbeatIntervalRef = useRef<NodeJS.Timeout>();
  const lastHeartbeatRef = useRef(0);

  // Page Visibility API to track when user is away
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Setup YouTube player if it's a YouTube video
  useEffect(() => {
    if (resource.type === 'youtube' && resource.external_id) {
      // Load YouTube IFrame API if not already loaded
      if (!window.YT) {
        const script = document.createElement('script');
        script.src = 'https://www.youtube.com/iframe_api';
        script.async = true;
        document.head.appendChild(script);

        window.onYouTubeIframeAPIReady = () => {
          setupYouTubePlayer();
        };
      } else {
        setupYouTubePlayer();
      }
    }
  }, [resource]);

  const setupYouTubePlayer = useCallback(() => {
    if (!resource.external_id || !window.YT) return;

    const player = new window.YT.Player(`youtube-${resource.id}`, {
      height: '400',
      width: '100%',
      videoId: resource.external_id,
      playerVars: {
        playsinline: 1,
        controls: 1,
        modestbranding: 1,
        rel: 0,
      },
      events: {
        onReady: (event: any) => {
          setDuration(event.target.getDuration());
        },
        onStateChange: (event: any) => {
          const state = event.data;
          setIsPlaying(state === window.YT.PlayerState.PLAYING);
          
          if (state === window.YT.PlayerState.ENDED) {
            handleVideoEnd();
          }
        },
      },
    });

    // Setup time tracking for YouTube
    const trackYouTubeTime = () => {
      if (player && player.getCurrentTime) {
        const time = player.getCurrentTime();
        setCurrentTime(time);
        onProgress(time);
        updateWatchProgress(resource.id, time);
      }
    };

    const interval = setInterval(trackYouTubeTime, 1000);
    return () => clearInterval(interval);
  }, [resource]);

  // Setup heartbeat for progress tracking
  useEffect(() => {
    if (isPlaying && isVisible && user) {
      heartbeatIntervalRef.current = setInterval(() => {
        sendHeartbeat();
      }, 10000); // Every 10 seconds
    } else {
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
      }
    }

    return () => {
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
      }
    };
  }, [isPlaying, isVisible, currentTime]);

  const sendHeartbeat = async () => {
    if (!user || currentTime === lastHeartbeatRef.current) return;

    const heartbeat: ProgressHeartbeat = {
      userId: user.id,
      resourceId: resource.id,
      watchedSeconds: currentTime,
      totalDuration: duration,
      isEnded: false,
      visible: isVisible,
    };

    try {
      const response = await sendProgressHeartbeat(heartbeat);
      if (response.success && response.data?.completed && !isCompleted) {
        setIsCompleted(true);
        onComplete();
      }
    } catch (error) {
      console.error('Failed to send heartbeat:', error);
    }

    lastHeartbeatRef.current = currentTime;
  };

  const handleVideoEnd = async () => {
    if (!user) return;

    const heartbeat: ProgressHeartbeat = {
      userId: user.id,
      resourceId: resource.id,
      watchedSeconds: duration,
      totalDuration: duration,
      isEnded: true,
      visible: isVisible,
    };

    try {
      const response = await sendProgressHeartbeat(heartbeat);
      if (response.success && response.data?.completed) {
        setIsCompleted(true);
        onComplete();
      }
    } catch (error) {
      console.error('Failed to send completion heartbeat:', error);
    }
  };

  const handlePlay = () => {
    if (resource.type === 'youtube') {
      // YouTube player controls handled by iframe
      return;
    }
    
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const time = videoRef.current.currentTime;
      setCurrentTime(time);
      onProgress(time);
      updateWatchProgress(resource.id, time);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden"
    >
      {/* Video container */}
      <div className="relative bg-black">
        {resource.type === 'youtube' && resource.external_id ? (
          <div id={`youtube-${resource.id}`} className="w-full aspect-video" />
        ) : (
          <video
            ref={videoRef}
            src={resource.external_id}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={handleVideoEnd}
            className="w-full aspect-video"
            controls={false}
          >
            Your browser does not support the video tag.
          </video>
        )}

        {/* Custom controls overlay for non-YouTube videos */}
        {resource.type !== 'youtube' && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
            <div className="flex items-center space-x-4 text-white">
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePlay}
                className="text-white hover:bg-white/20"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </Button>

              <div className="flex-1">
                <div className="w-full bg-white/20 rounded-full h-1 mb-2">
                  <div 
                    className="bg-primary h-1 rounded-full transition-all duration-200"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                <div className="text-xs">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
              >
                <Volume2 className="w-5 h-5" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
              >
                <Maximize className="w-5 h-5" />
              </Button>
            </div>
          </div>
        )}

        {/* Completion overlay */}
        {isCompleted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-xl p-6 text-center max-w-sm mx-4"
            >
              <div className="text-green-500 text-5xl mb-4">✅</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Congratulations!
              </h3>
              <p className="text-gray-600 mb-4">
                You've completed this lesson. Ready to move on to the next one?
              </p>
              <Button
                onClick={() => setCurrentTime(0)}
                variant="outline"
                size="sm"
                className="mr-2"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Replay
              </Button>
            </motion.div>
          </motion.div>
        )}
      </div>

      {/* Video info */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {resource.title}
        </h3>
        
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Duration: {formatTime(duration)}</span>
          <span>Progress: {Math.round(progressPercentage)}%</span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
          <motion.div
            className="bg-primary h-2 rounded-full"
            style={{ width: `${progressPercentage}%` }}
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {!isVisible && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              ⚠️ Tab is not active - watch time is paused for accurate tracking
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// Extend Window interface for YouTube API
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}