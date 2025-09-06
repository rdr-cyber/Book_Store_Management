
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, BookOpen, UserCheck, Sparkles, ArrowRight, User, Mail, Lock, Eye, EyeOff, Shield, Star, Heart, Crown } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import type { UserRole } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.08
    }
  }
};

export default function RegisterPage() {
  const [readerFormData, setReaderFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [authorFormData, setAuthorFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('reader');
  const [loading, setLoading] = useState<Record<UserRole, boolean>>({ reader: false, author: false, admin: false });
  const [errors, setErrors] = useState<Record<UserRole, Record<string, string>>>({ reader: {}, author: {}, admin: {} });
  const router = useRouter();

  const validateForm = (formData: typeof readerFormData, role: UserRole) => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/.test(formData.password)) {
      newErrors.password = 'Password must be at least 8 characters with uppercase, lowercase, and number';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(prev => ({ ...prev, [role]: newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent, role: UserRole) => {
    e.preventDefault();
    
    const formData = role === 'reader' ? readerFormData : authorFormData;
    
    if (!validateForm(formData, role)) {
      return;
    }

    setLoading(prev => ({ ...prev, [role]: true }));
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          role: role,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Welcome to ShelfWise! ✨',
          description: `Your ${role} account has been created. Let\'s get started!`,
        });
        router.push('/login');
      } else {
        setErrors(prev => ({ 
          ...prev, 
          [role]: { ...prev[role], general: data.error || 'Registration failed' }
        }));
      }
    } catch (error) {
      console.error('Registration error:', error);
      setErrors(prev => ({ 
        ...prev, 
        [role]: { ...prev[role], general: 'An unexpected error occurred. Please try again.' }
      }));
    } finally {
      setLoading(prev => ({ ...prev, [role]: false }));
    }
  };

  const handleInputChange = (field: string, value: string, role: UserRole) => {
    if (role === 'reader') {
      setReaderFormData(prev => ({ ...prev, [field]: value }));
    } else {
      setAuthorFormData(prev => ({ ...prev, [field]: value }));
    }
    
    if (errors[role][field]) {
      setErrors(prev => ({ 
        ...prev, 
        [role]: { ...prev[role], [field]: '' }
      }));
    }
  };

  const renderForm = (role: UserRole) => {
    const formData = role === 'reader' ? readerFormData : authorFormData;
    const formErrors = errors[role] || {};
    const isLoading = loading[role];

    return (
      <motion.form 
        onSubmit={(e) => handleSubmit(e, role)} 
        className="space-y-6"
        variants={stagger}
        initial="initial"
        animate="animate"
      >
        <AnimatePresence>
          {formErrors.general && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <Alert variant="destructive" className="border-red-200 bg-red-50/80 backdrop-blur-sm">
                <AlertDescription className="text-red-800 font-medium">{formErrors.general}</AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.div variants={fadeUp} className="space-y-2">
            <Label htmlFor={`firstName-${role}`} className="text-sm font-semibold text-gray-700 flex items-center">
              <User className="w-4 h-4 mr-2 text-gray-500" />
              First Name
            </Label>
            <Input
              id={`firstName-${role}`}
              type="text"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value, role)}
              className={`pl-4 pr-4 py-3 rounded-xl border-2 transition-all duration-300 ${
                formErrors.firstName 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-200/50' 
                  : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200/50 hover:border-gray-300'
              } bg-white/80 backdrop-blur-sm text-gray-800 placeholder:text-gray-500 font-medium`}
              placeholder="John"
              disabled={isLoading}
            />
            <AnimatePresence>
              {formErrors.firstName && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-sm text-red-600 font-medium"
                >
                  {formErrors.firstName}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
          
          <motion.div variants={fadeUp} className="space-y-2">
            <Label htmlFor={`lastName-${role}`} className="text-sm font-semibold text-gray-700 flex items-center">
              <User className="w-4 h-4 mr-2 text-gray-500" />
              Last Name
            </Label>
            <Input
              id={`lastName-${role}`}
              type="text"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value, role)}
              className={`pl-4 pr-4 py-3 rounded-xl border-2 transition-all duration-300 ${
                formErrors.lastName 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-200/50' 
                  : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200/50 hover:border-gray-300'
              } bg-white/80 backdrop-blur-sm text-gray-800 placeholder:text-gray-500 font-medium`}
              placeholder="Doe"
              disabled={isLoading}
            />
            <AnimatePresence>
              {formErrors.lastName && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-sm text-red-600 font-medium"
                >
                  {formErrors.lastName}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        <motion.div variants={fadeUp} className="space-y-2">
          <Label htmlFor={`email-${role}`} className="text-sm font-semibold text-gray-700 flex items-center">
            <Mail className="w-4 h-4 mr-2 text-gray-500" />
            Email Address
          </Label>
          <Input
            id={`email-${role}`}
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value, role)}
            className={`pl-4 pr-4 py-3 rounded-xl border-2 transition-all duration-300 ${
              formErrors.email 
                ? 'border-red-300 focus:border-red-500 focus:ring-red-200/50' 
                : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200/50 hover:border-gray-300'
            } bg-white/80 backdrop-blur-sm text-gray-800 placeholder:text-gray-500 font-medium`}
            placeholder={role === 'author' ? 'author@example.com' : 'reader@example.com'}
            disabled={isLoading}
          />
          <AnimatePresence>
            {formErrors.email && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-sm text-red-600 font-medium"
              >
                {formErrors.email}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div variants={fadeUp} className="space-y-2">
          <Label htmlFor={`password-${role}`} className="text-sm font-semibold text-gray-700 flex items-center">
            <Lock className="w-4 h-4 mr-2 text-gray-500" />
            Password
          </Label>
          <div className="relative">
            <Input
              id={`password-${role}`}
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value, role)}
              className={`pl-4 pr-12 py-3 rounded-xl border-2 transition-all duration-300 ${
                formErrors.password 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-200/50' 
                  : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200/50 hover:border-gray-300'
              } bg-white/80 backdrop-blur-sm text-gray-800 placeholder:text-gray-500 font-medium`}
              placeholder="Create a strong password"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          <AnimatePresence>
            {formErrors.password && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-sm text-red-600 font-medium"
              >
                {formErrors.password}
              </motion.p>
            )}
          </AnimatePresence>
          <p className="text-xs text-gray-500 font-medium flex items-center mt-1">
            <Shield className="w-3 h-3 mr-1" />
            At least 8 characters with uppercase, lowercase, and number
          </p>
        </motion.div>

        <motion.div variants={fadeUp} className="space-y-2">
          <Label htmlFor={`confirmPassword-${role}`} className="text-sm font-semibold text-gray-700 flex items-center">
            <Lock className="w-4 h-4 mr-2 text-gray-500" />
            Confirm Password
          </Label>
          <div className="relative">
            <Input
              id={`confirmPassword-${role}`}
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value, role)}
              className={`pl-4 pr-12 py-3 rounded-xl border-2 transition-all duration-300 ${
                formErrors.confirmPassword 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-200/50' 
                  : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200/50 hover:border-gray-300'
              } bg-white/80 backdrop-blur-sm text-gray-800 placeholder:text-gray-500 font-medium`}
              placeholder="Confirm your password"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          <AnimatePresence>
            {formErrors.confirmPassword && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-sm text-red-600 font-medium"
              >
                {formErrors.confirmPassword}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div variants={fadeUp} className="pt-2">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <Button 
              type="submit" 
              className={`w-full py-4 text-base font-bold transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl ${
                role === 'reader'
                  ? 'bg-gradient-to-r from-blue-600 via-blue-700 to-blue-600 hover:from-blue-700 hover:via-blue-800 hover:to-blue-700'
                  : 'bg-gradient-to-r from-purple-600 via-purple-700 to-purple-600 hover:from-purple-700 hover:via-purple-800 hover:to-purple-700'
              } transform hover:-translate-y-0.5`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                  Creating your account...
                </>
              ) : (
                <>
                  <Crown className="mr-3 h-5 w-5" />
                  Create {role === 'reader' ? 'Reader' : 'Author'} Account
                  <ArrowRight className="ml-3 h-5 w-5" />
                </>
              )}
            </Button>
          </motion.div>
        </motion.div>
      </motion.form>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 -right-32 w-96 h-96 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full blur-3xl"
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute -bottom-32 -left-32 w-80 h-80 bg-gradient-to-tr from-blue-200/30 to-purple-200/30 rounded-full blur-3xl"
          animate={{
            rotate: -360,
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <div className="absolute inset-0 bg-grid-slate-100/50 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      </div>

      <motion.div 
        className="w-full max-w-2xl relative z-10"
        initial="initial"
        animate="animate"
        variants={stagger}
      >
        {/* Header */}
        <motion.div className="text-center mb-8" variants={fadeUp}>
          <motion.div
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-600 via-pink-600 to-purple-700 rounded-3xl mb-6 shadow-2xl"
            whileHover={{ 
              scale: 1.1,
              rotate: [0, -10, 10, 0],
              boxShadow: "0 25px 50px rgba(0,0,0,0.15)"
            }}
            transition={{ duration: 0.6 }}
          >
            <BookOpen className="h-10 w-10 text-white" />
          </motion.div>
          
          <h1 className="text-5xl font-black text-gray-900 mb-4 leading-tight">
            Join Our
            <span className="block bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
              Community
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Start your journey as a reader or author today
          </p>
          
          <motion.div 
            className="inline-flex items-center px-6 py-3 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50"
            whileHover={{ scale: 1.05, y: -2 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Star className="w-5 h-5 text-yellow-500 mr-3" />
            <span className="text-sm font-semibold text-gray-700">Trusted by 50K+ Users</span>
            <Heart className="w-4 h-4 text-red-500 ml-2" />
          </motion.div>
        </motion.div>

        {/* Main Card */}
        <motion.div variants={fadeUp}>
          <Card className="bg-white/90 backdrop-blur-xl border-0 shadow-2xl shadow-black/10 rounded-3xl overflow-hidden">
            <CardHeader className="pb-2">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-gray-100/80 backdrop-blur-sm rounded-2xl p-1">
                  <TabsTrigger 
                    value="reader" 
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 rounded-xl font-semibold"
                  >
                    <UserCheck className="mr-2 h-4 w-4" />
                    Reader
                  </TabsTrigger>
                  <TabsTrigger 
                    value="author"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 rounded-xl font-semibold"
                  >
                    <BookOpen className="mr-2 h-4 w-4" />
                    Author
                  </TabsTrigger>
                </TabsList>
                
                <motion.div className="mt-6" variants={fadeUp}>
                  <TabsContent value="reader" className="space-y-0 m-0">
                    <CardTitle className="text-3xl text-center text-gray-900 font-black">
                      Become a Reader
                    </CardTitle>
                    <CardDescription className="text-center text-gray-600 mt-3 text-base">
                      Discover amazing books and join our community of book lovers
                    </CardDescription>
                  </TabsContent>
                  
                  <TabsContent value="author" className="space-y-0 m-0">
                    <CardTitle className="text-3xl text-center text-gray-900 font-black">
                      Become an Author
                    </CardTitle>
                    <CardDescription className="text-center text-gray-600 mt-3 text-base">
                      Share your stories with readers around the world
                    </CardDescription>
                  </TabsContent>
                </motion.div>
              </Tabs>
            </CardHeader>
            
            <CardContent className="p-8 pt-4">
              <Tabs value={activeTab} className="w-full">
                <TabsContent value="reader" className="m-0">
                  {renderForm('reader')}
                </TabsContent>
                <TabsContent value="author" className="m-0">
                  {renderForm('author')}
                </TabsContent>
              </Tabs>
              
              <motion.div 
                className="mt-8 pt-6 border-t border-gray-200/50"
                variants={fadeUp}
              >
                <p className="text-center text-gray-600 mb-4 font-medium">
                  Already have an account?
                </p>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button asChild variant="outline" className="w-full border-2 hover:border-purple-500 hover:bg-purple-50 transition-all duration-300 rounded-xl py-3 font-semibold">
                    <Link href="/login" className="flex items-center justify-center">
                      <ArrowRight className="mr-2 h-4 w-4" />
                      Sign In Instead
                    </Link>
                  </Button>
                </motion.div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div 
          className="mt-8 text-center"
          variants={fadeUp}
        >
          <p className="text-sm text-gray-500 leading-relaxed">
            By creating an account, you agree to our{' '}
            <Link href="/terms" className="text-purple-600 hover:text-purple-800 font-semibold transition-colors">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-purple-600 hover:text-purple-800 font-semibold transition-colors">
              Privacy Policy
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
