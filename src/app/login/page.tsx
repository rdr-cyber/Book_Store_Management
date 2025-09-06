
'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, BookOpen, UserCheck, Sparkles, ArrowRight } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import type { UserRole } from '@/lib/types';
import { motion } from 'framer-motion';

// Separate component for search params to enable Suspense
function LoginContent() {
  const searchParams = useSearchParams();
  const userType = searchParams.get('role') || 'reader';
  return <LoginFormComponent userType={userType} />;
}

function LoginFormComponent({ userType }: { userType: string }) {
  const [readerFormData, setReaderFormData] = useState({
    email: '',
    password: ''
  });
  
  const [authorFormData, setAuthorFormData] = useState({
    email: '',
    password: ''
  });
  
  const [loading, setLoading] = useState<Record<UserRole, boolean>>({ reader: false, author: false, admin: false });
  const [errors, setErrors] = useState<Record<UserRole, Record<string, string>>>({ reader: {}, author: {}, admin: {} });
  const router = useRouter();

  const validateForm = (formData: typeof readerFormData, role: UserRole) => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
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
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store user info in localStorage for client-side access
        localStorage.setItem('currentUser', JSON.stringify(data.user));
        
        // Dispatch storage event to update header immediately
        window.dispatchEvent(new Event('storage'));
        
        toast({
          title: 'Login Successful!',
          description: `Welcome back, ${data.user.firstName}!`,
        });
        
        // Redirect based on role
        const redirectUrl = new URLSearchParams(window.location.search).get('redirect');
        if (redirectUrl) {
          router.push(redirectUrl);
        } else {
          router.push(data.user.role === 'author' ? '/author/dashboard' : '/reader/dashboard');
        }
      } else {
        setErrors(prev => ({ 
          ...prev, 
          [role]: { ...prev[role], general: data.error || 'Login failed' }
        }));
      }
    } catch (error) {
      console.error('Login error:', error);
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

  const handleTabChange = (value: string) => {
    router.push(`/login?role=${value}`, { scroll: false });
  };

  const renderForm = (role: UserRole) => {
    const formData = role === 'reader' ? readerFormData : authorFormData;
    const formErrors = errors[role] || {};
    const isLoading = loading[role];

    return (
      <motion.form 
        onSubmit={(e) => handleSubmit(e, role)} 
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {formErrors.general && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Alert variant="destructive" className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-800">{formErrors.general}</AlertDescription>
            </Alert>
          </motion.div>
        )}
        
        <motion.div 
          className="space-y-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Label htmlFor={`email-${role}`} className="text-sm font-medium text-gray-700">
            Email Address
          </Label>
          <motion.div
            whileFocus={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <Input
              id={`email-${role}`}
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value, role)}
              className={`transition-all duration-200 ${
                formErrors.email 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
              }`}
              placeholder={role === 'author' ? 'author@example.com' : 'reader@example.com'}
              disabled={isLoading}
            />
          </motion.div>
          {formErrors.email && (
            <motion.p 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-red-600"
            >
              {formErrors.email}
            </motion.p>
          )}
        </motion.div>

        <motion.div 
          className="space-y-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Label htmlFor={`password-${role}`} className="text-sm font-medium text-gray-700">
            Password
          </Label>
          <motion.div
            whileFocus={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <Input
              id={`password-${role}`}
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value, role)}
              className={`transition-all duration-200 ${
                formErrors.password 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
              }`}
              placeholder="Enter your password"
              disabled={isLoading}
            />
          </motion.div>
          {formErrors.password && (
            <motion.p 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-red-600"
            >
              {formErrors.password}
            </motion.p>
          )}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          >
            <Button 
              type="submit" 
              className={`w-full py-3 text-base font-semibold transition-all duration-200 ${
                role === 'reader'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
              } shadow-lg hover:shadow-xl`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in as {role === 'reader' ? 'Reader' : 'Author'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </motion.div>
        </motion.div>
      </motion.form>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-200 to-purple-300 rounded-full opacity-10"
          animate={{
            rotate: 360,
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-indigo-200 to-blue-300 rounded-full opacity-10"
          animate={{
            rotate: -360,
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      <motion.div 
        className="w-full max-w-md relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div 
          className="text-center mb-8" 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.div
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl mb-6 shadow-lg"
            whileHover={{ 
              scale: 1.1,
              rotate: 360,
              boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
            }}
            transition={{ duration: 0.6 }}
          >
            <BookOpen className="h-8 w-8 text-white" />
          </motion.div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome Back
          </h1>
          <p className="text-lg text-gray-600">
            Sign in to continue your reading journey
          </p>
          
          <motion.div 
            className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm mt-4"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Sparkles className="w-4 h-4 text-yellow-500 mr-2" />
            <span className="text-sm font-medium text-gray-700">Secure & Fast Login</span>
          </motion.div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-2xl">
            <CardHeader className="space-y-1 pb-6">
              <Tabs value={userType} onValueChange={handleTabChange} className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-gray-100">
                  <TabsTrigger 
                    value="reader" 
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white transition-all duration-200"
                  >
                    <UserCheck className="mr-2 h-4 w-4" />
                    Reader
                  </TabsTrigger>
                  <TabsTrigger 
                    value="author"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white transition-all duration-200"
                  >
                    <BookOpen className="mr-2 h-4 w-4" />
                    Author
                  </TabsTrigger>
                </TabsList>
                
                <motion.div 
                  className="mt-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <TabsContent value="reader" className="space-y-0">
                    <CardTitle className="text-2xl text-center text-gray-900">
                      Reader Login
                    </CardTitle>
                    <CardDescription className="text-center text-gray-600 mt-2">
                      Access your personal library and discover new books
                    </CardDescription>
                  </TabsContent>
                  
                  <TabsContent value="author" className="space-y-0">
                    <CardTitle className="text-2xl text-center text-gray-900">
                      Author Login
                    </CardTitle>
                    <CardDescription className="text-center text-gray-600 mt-2">
                      Manage your publications and track your success
                    </CardDescription>
                  </TabsContent>
                </motion.div>
              </Tabs>
            </CardHeader>
            
            <CardContent className="p-8 pt-4">
              <Tabs value={userType} className="w-full">
                <TabsContent value="reader" className="m-0">
                  {renderForm('reader')}
                </TabsContent>
                <TabsContent value="author" className="m-0">
                  {renderForm('author')}
                </TabsContent>
              </Tabs>
              
              <motion.div 
                className="mt-8 pt-6 border-t border-gray-200/50"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <p className="text-center text-gray-600 mb-4 font-medium">
                  New to ShelfWise?
                </p>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button asChild variant="outline" className="w-full border-2 hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 rounded-xl py-3 font-semibold">
                    <Link href="/register" className="flex items-center justify-center">
                      <Sparkles className="mr-2 h-4 w-4" />
                      Create Your Account
                    </Link>
                  </Button>
                </motion.div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div 
          className="mt-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <p className="text-sm text-gray-500 leading-relaxed">
            By signing in, you agree to our{' '}
            <Link href="/terms" className="text-blue-600 hover:text-blue-800 font-semibold transition-colors">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-blue-600 hover:text-blue-800 font-semibold transition-colors">
              Privacy Policy
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}

// Main component that wraps the content in Suspense
export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
