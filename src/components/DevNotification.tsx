'use client';

import { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { isSupabaseConfigured } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';

export default function DevNotification() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenDismissed, setHasBeenDismissed] = useState(false);

  useEffect(() => {
    // Only show if Supabase is not configured and hasn't been dismissed
    const dismissed = localStorage.getItem('dev-notification-dismissed') === 'true';
    if (!isSupabaseConfigured && !dismissed) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    setHasBeenDismissed(true);
    localStorage.setItem('dev-notification-dismissed', 'true');
  };

  if (!isVisible || hasBeenDismissed) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.95 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md mx-4"
        >
          <Alert className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-lg">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800 pr-8">
              <strong>Development Mode:</strong> Running with mock authentication. 
              Configure Supabase in <code className="text-blue-900 bg-blue-100 px-1 rounded">.env.local</code> for full functionality.
            </AlertDescription>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="absolute top-2 right-2 h-6 w-6 p-0 text-blue-600 hover:text-blue-800"
            >
              <X className="h-4 w-4" />
            </Button>
          </Alert>
        </motion.div>
      )}
    </AnimatePresence>
  );
}