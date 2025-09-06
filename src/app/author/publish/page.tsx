

'use client';

import { useRouter } from 'next/navigation';
import BookForm from '@/components/BookForm';
import { useAuth } from '@/context/AuthContext';
import { Book } from '@/lib/types';
import { useEffect } from 'react';

export default function PublishPage() {
  const { authUser, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!authUser || authUser.role !== 'author')) {
      router.push('/login?role=author');
    }
  }, [authUser, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!authUser || authUser.role !== 'author') {
    return null;
  }

  const handleBookPublished = (book: Book) => {
    // Redirect to author dashboard after successful publishing
    router.push('/author/dashboard');
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Publish a New Book</h1>
        <p className="text-gray-600">
          Share your story with the world by publishing your book on our platform.
        </p>
      </div>
      
      <BookForm onSuccess={handleBookPublished} />
    </div>
  );
}