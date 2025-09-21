"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  LogOut, 
  Settings, 
  Home, 
  BookOpen, 
  Target,
  TrendingUp
} from 'lucide-react';

export function Header() {
  const router = useRouter();
  const { user, setUser } = useStore();

  const handleSignOut = () => {
    setUser(null);
    router.push('/');
  };

  const getLevelProgress = () => {
    if (!user) return 0;
    return (user.xp / user.maxXp) * 100;
  };

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">CareerPath</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
{/*             <Link 
            {/* <Link 
              href="/dashboard" 
              className="flex items-center space-x-2 text-gray-600 hover:text-primary transition-colors"
            >
              <Home className="w-4 h-4" />
              <span>Dashboard</span>
            </Link> */}
            <Link 
              href="/career-tree" 
              className="flex items-center space-x-2 text-gray-600 hover:text-primary transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              <span>Career Tree</span>
            </Link>
            <Link 
              href="/recommendations" 
              className="flex items-center space-x-2 text-gray-600 hover:text-primary transition-colors"
            >
              <TrendingUp className="w-4 h-4" />
              <span>Explore Careers</span>
            </Link>
          </nav>

          {/* User section */}
          {user ? (
            <div className="flex items-center space-x-4">
              {/* XP Progress */}
              <div className="hidden sm:flex items-center space-x-3">
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">
                    Level {user.level}
                  </div>
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <motion.div
                      className="bg-primary h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${getLevelProgress()}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>
                </div>
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  {user.xp} XP
                </Badge>
              </div>

              {/* User menu */}
              <div className="flex items-center space-x-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={`${user.name}`} />
                  <AvatarFallback>
                    {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="hidden sm:block text-right">
                  <div className="text-sm font-medium text-gray-900">{user.name}</div>
                  <div className="text-xs text-gray-500">{user.email}</div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  className="text-gray-500 hover:text-red-600"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" asChild>
                <Link href="/signin">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </motion.header>
  );
}
