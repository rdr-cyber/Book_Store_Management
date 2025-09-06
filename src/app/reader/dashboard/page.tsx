'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  TrendingUp, 
  Users, 
  Star,
  Search,
  ShoppingCart,
  Heart,
  Clock,
  Sparkles
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function ReaderDashboard() {
  const [user, setUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const userData = localStorage.getItem('loggedInUser') || localStorage.getItem('currentUser');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const stats = [
    { label: 'Books Read', value: '24', icon: BookOpen, color: 'from-blue-500 to-cyan-500' },
    { label: 'Reading Streak', value: '12 days', icon: TrendingUp, color: 'from-purple-500 to-pink-500' },
    { label: 'Authors Following', value: '8', icon: Users, color: 'from-green-500 to-emerald-500' },
    { label: 'Reviews Written', value: '15', icon: Star, color: 'from-orange-500 to-yellow-500' },
  ];

  const recentBooks = [
    { id: 1, title: 'The Digital Frontier', author: 'Sarah Chen', progress: 75 },
    { id: 2, title: 'AI Revolution', author: 'Michael Roberts', progress: 45 },
    { id: 3, title: 'Future Insights', author: 'Emma Thompson', progress: 90 },
  ];

  const recommendations = [
    { id: 1, title: 'Quantum Computing Basics', author: 'Dr. Alan Turing', rating: 4.8 },
    { id: 2, title: 'Machine Learning Ethics', author: 'Prof. Ada Lovelace', rating: 4.9 },
    { id: 3, title: 'The Data Revolution', author: 'Grace Hopper', rating: 4.7 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div 
          initial="initial"
          animate="animate"
          variants={stagger}
          className="text-center space-y-4"
        >
          <motion.h1 
            variants={fadeUp}
            className="text-4xl md:text-5xl font-black bg-gradient-to-r from-slate-900 via-blue-800 to-slate-900 bg-clip-text text-transparent"
          >
            Welcome back, {user?.firstName || 'Reader'}! 👋
          </motion.h1>
          <motion.p 
            variants={fadeUp}
            className="text-xl text-slate-600 max-w-2xl mx-auto"
          >
            Continue your literary journey and discover new worlds of knowledge.
          </motion.p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          initial="initial"
          animate="animate"
          variants={stagger}
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {stats.map((stat, index) => (
            <motion.div key={index} variants={fadeUp}>
              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-500 group">
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</div>
                  <div className="text-sm text-slate-600">{stat.label}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Actions */}
        <motion.div 
          initial="initial"
          animate="animate"
          variants={stagger}
          className="grid md:grid-cols-2 gap-8"
        >
          {/* Search Books */}
          <motion.div variants={fadeUp}>
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Search className="w-5 h-5" />
                  <span>Find Your Next Read</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Search by title, author, or genre..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border-0 bg-slate-50"
                />
                <Button asChild className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <Link href={`/books${searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : ''}`}>
                    Browse Books
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* AI Recommendations */}
          <motion.div variants={fadeUp}>
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5" />
                  <span>AI Recommendations</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 mb-4">Get personalized book recommendations powered by AI.</p>
                <Button asChild className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                  <Link href="/ai/suggestions?role=reader">
                    Get AI Suggestions
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Reading Progress & Recommendations */}
        <motion.div 
          initial="initial"
          animate="animate"
          variants={stagger}
          className="grid lg:grid-cols-2 gap-8"
        >
          {/* Continue Reading */}
          <motion.div variants={fadeUp}>
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span>Continue Reading</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentBooks.map((book) => (
                  <div key={book.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="w-12 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-900">{book.title}</h4>
                      <p className="text-sm text-slate-600">by {book.author}</p>
                      <div className="mt-2 w-full bg-slate-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full" 
                          style={{ width: `${book.progress}%` }}
                        />
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{book.progress}% complete</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Recommended for You */}
          <motion.div variants={fadeUp}>
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Heart className="w-5 h-5" />
                  <span>Recommended for You</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recommendations.map((book) => (
                  <div key={book.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="w-12 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg flex items-center justify-center">
                      <Star className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-900">{book.title}</h4>
                      <p className="text-sm text-slate-600">by {book.author}</p>
                      <div className="flex items-center mt-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-slate-600 ml-1">{book.rating}</span>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      <ShoppingCart className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}