'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  TrendingUp, 
  Users, 
  DollarSign,
  PlusCircle,
  BarChart3,
  Star,
  Eye,
  Sparkles,
  Crown
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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

export default function AuthorDashboard() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem('loggedInUser') || localStorage.getItem('currentUser');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const stats = [
    { label: 'Published Books', value: '12', icon: BookOpen, color: 'from-blue-500 to-cyan-500', change: '+2 this month' },
    { label: 'Total Sales', value: '1,247', icon: TrendingUp, color: 'from-green-500 to-emerald-500', change: '+15% this month' },
    { label: 'Revenue', value: '$8,420', icon: DollarSign, color: 'from-purple-500 to-pink-500', change: '+22% this month' },
    { label: 'Followers', value: '342', icon: Users, color: 'from-orange-500 to-red-500', change: '+8 this week' },
  ];

  const recentBooks = [
    { id: 1, title: 'The AI Revolution', sales: 156, revenue: '$780', rating: 4.8 },
    { id: 2, title: 'Future Perspectives', sales: 89, revenue: '$445', rating: 4.6 },
    { id: 3, title: 'Digital Transformation', sales: 203, revenue: '$1,015', rating: 4.9 },
  ];

  const quickActions = [
    {
      title: 'Publish New Book',
      description: 'Create and publish your next masterpiece',
      icon: PlusCircle,
      color: 'from-blue-600 to-purple-600',
      href: '/author/publish'
    },
    {
      title: 'View Analytics',
      description: 'Track your book performance and sales',
      icon: BarChart3,
      color: 'from-green-600 to-teal-600',
      href: '/author/analytics'
    },
    {
      title: 'AI Book Ideas',
      description: 'Get AI-powered writing suggestions',
      icon: Sparkles,
      color: 'from-purple-600 to-pink-600',
      href: '/ai/suggestions?role=author'
    },
    {
      title: 'Manage Books',
      description: 'Edit and update your published books',
      icon: BookOpen,
      color: 'from-orange-600 to-red-600',
      href: '/author/books'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div 
          initial="initial"
          animate="animate"
          variants={stagger}
          className="text-center space-y-4"
        >
          <motion.div variants={fadeUp} className="flex items-center justify-center space-x-3">
            <Crown className="w-8 h-8 text-purple-600" />
            <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-slate-900 via-purple-800 to-slate-900 bg-clip-text text-transparent">
              Author Studio
            </h1>
          </motion.div>
          <motion.p 
            variants={fadeUp}
            className="text-xl text-slate-600 max-w-2xl mx-auto"
          >
            Welcome back, {user?.firstName || 'Author'}! Ready to create your next bestseller?
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
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                      <div className="text-xs text-green-600 font-medium">{stat.change}</div>
                    </div>
                  </div>
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
        >
          <motion.h2 
            variants={fadeUp}
            className="text-2xl font-bold text-slate-900 mb-6"
          >
            Quick Actions
          </motion.h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <motion.div key={index} variants={fadeUp}>
                <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-500 group cursor-pointer">
                  <Link href={action.href}>
                    <CardContent className="p-6 text-center">
                      <div className={`w-16 h-16 bg-gradient-to-r ${action.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        <action.icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="font-bold text-slate-900 mb-2">{action.title}</h3>
                      <p className="text-sm text-slate-600">{action.description}</p>
                    </CardContent>
                  </Link>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Books Performance */}
        <motion.div 
          initial="initial"
          animate="animate"
          variants={stagger}
        >
          <motion.h2 
            variants={fadeUp}
            className="text-2xl font-bold text-slate-900 mb-6"
          >
            Recent Books Performance
          </motion.h2>
          <motion.div variants={fadeUp}>
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {recentBooks.map((book) => (
                    <div key={book.id} className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                          <BookOpen className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900">{book.title}</h4>
                          <div className="flex items-center space-x-4 text-sm text-slate-600">
                            <span className="flex items-center">
                              <TrendingUp className="w-4 h-4 mr-1" />
                              {book.sales} sales
                            </span>
                            <span className="flex items-center">
                              <DollarSign className="w-4 h-4 mr-1" />
                              {book.revenue}
                            </span>
                            <span className="flex items-center">
                              <Star className="w-4 h-4 mr-1 text-yellow-500" />
                              {book.rating}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Call to Action */}
        <motion.div 
          initial="initial"
          animate="animate"
          variants={fadeUp}
          className="text-center"
        >
          <Card className="bg-gradient-to-r from-purple-600 to-pink-600 border-0 shadow-2xl">
            <CardContent className="p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Ready to Write Your Next Bestseller?</h3>
              <p className="text-purple-100 mb-6">
                Use our AI-powered tools to get inspiration, analyze trends, and create compelling content.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
                  <Link href="/author/publish">
                    <PlusCircle className="w-5 h-5 mr-2" />
                    Start Writing
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600">
                  <Link href="/ai/suggestions?role=author">
                    <Sparkles className="w-5 h-5 mr-2" />
                    Get AI Ideas
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}