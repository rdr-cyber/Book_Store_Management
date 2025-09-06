'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Star, 
  ShoppingCart, 
  Heart,
  BookOpen,
  User,
  ArrowRight
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import Image from 'next/image';

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

// Sample book data
const sampleBooks = [
  {
    id: 1,
    title: 'The AI Revolution: Understanding Machine Learning',
    author: 'Dr. Sarah Chen',
    price: 29.99,
    rating: 4.8,
    reviews: 124,
    category: 'Technology',
    coverType: 'Hardcover',
    description: 'A comprehensive guide to understanding artificial intelligence and its impact on our future.',
    image: '/api/placeholder/300/400'
  },
  {
    id: 2,
    title: 'Digital Transformation Strategies',
    author: 'Michael Roberts',
    price: 24.99,
    rating: 4.6,
    reviews: 89,
    category: 'Business',
    coverType: 'Paperback',
    description: 'Learn how to lead digital transformation in your organization.',
    image: '/api/placeholder/300/400'
  },
  {
    id: 3,
    title: 'The Future of Work',
    author: 'Emma Thompson',
    price: 19.99,
    rating: 4.9,
    reviews: 256,
    category: 'Career',
    coverType: 'eBook',
    description: 'Discover how the workplace is evolving and how to adapt to future changes.',
    image: '/api/placeholder/300/400'
  },
  {
    id: 4,
    title: 'Quantum Computing Explained',
    author: 'Prof. Alan Turing',
    price: 34.99,
    rating: 4.7,
    reviews: 67,
    category: 'Science',
    coverType: 'Hardcover',
    description: 'An accessible introduction to the world of quantum computing.',
    image: '/api/placeholder/300/400'
  },
  {
    id: 5,
    title: 'Sustainable Innovation',
    author: 'Grace Hopper',
    price: 22.99,
    rating: 4.5,
    reviews: 143,
    category: 'Environment',
    coverType: 'Paperback',
    description: 'How to build a sustainable future through innovative thinking.',
    image: '/api/placeholder/300/400'
  },
  {
    id: 6,
    title: 'Creative Leadership',
    author: 'Steve Jobs Jr.',
    price: 27.99,
    rating: 4.8,
    reviews: 201,
    category: 'Leadership',
    coverType: 'Hardcover',
    description: 'Unlock your creative potential and lead with innovation.',
    image: '/api/placeholder/300/400'
  }
];

const categories = ['All', 'Technology', 'Business', 'Science', 'Career', 'Environment', 'Leadership'];

export default function BooksPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [books, setBooks] = useState(sampleBooks);
  const [filteredBooks, setFilteredBooks] = useState(sampleBooks);

  useEffect(() => {
    let filtered = books;

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(book => book.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(book => 
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredBooks(filtered);
  }, [searchQuery, selectedCategory, books]);

  const addToCart = (book: any) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find((item: any) => item.id === book.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...book, quantity: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
  };

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
            Discover Amazing Books 📚
          </motion.h1>
          <motion.p 
            variants={fadeUp}
            className="text-xl text-slate-600 max-w-2xl mx-auto"
          >
            Explore our curated collection of books from talented authors worldwide.
          </motion.p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div 
          initial="initial"
          animate="animate"
          variants={stagger}
          className="space-y-6"
        >
          {/* Search Bar */}
          <motion.div variants={fadeUp} className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search books, authors, or genres..."
              className="pl-12 pr-4 py-3 rounded-2xl border-0 bg-white shadow-lg text-lg"
            />
          </motion.div>

          {/* Category Filters */}
          <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full px-6 py-2 transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'hover:bg-blue-50 hover:text-blue-700'
                }`}
              >
                {category}
              </Button>
            ))}
          </motion.div>
        </motion.div>

        {/* Books Grid */}
        <motion.div 
          initial="initial"
          animate="animate"
          variants={stagger}
        >
          <motion.div variants={fadeUp} className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900">
              {searchQuery || selectedCategory !== 'All' 
                ? `Found ${filteredBooks.length} books`
                : 'All Books'
              }
            </h2>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Sort by
            </Button>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBooks.map((book, index) => (
              <motion.div 
                key={book.id} 
                variants={fadeUp}
                initial="initial"
                animate="animate"
                transition={{ delay: index * 0.1 }}
              >
                <Card className="group bg-white/70 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden">
                  <CardContent className="p-0">
                    {/* Book Cover */}
                    <div className="relative aspect-[3/4] bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <BookOpen className="w-16 h-16 text-white/50" />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
                      
                      {/* Wishlist Button */}
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white"
                      >
                        <Heart className="w-4 h-4" />
                      </Button>

                      {/* Category Badge */}
                      <Badge className="absolute top-3 left-3 bg-white/90 text-slate-900">
                        {book.category}
                      </Badge>
                    </div>

                    {/* Book Details */}
                    <div className="p-6 space-y-4">
                      <div>
                        <h3 className="font-bold text-lg text-slate-900 line-clamp-2 group-hover:text-blue-700 transition-colors">
                          {book.title}
                        </h3>
                        <div className="flex items-center text-slate-600 mt-1">
                          <User className="w-4 h-4 mr-1" />
                          <span className="text-sm">{book.author}</span>
                        </div>
                      </div>

                      <p className="text-sm text-slate-600 line-clamp-2">
                        {book.description}
                      </p>

                      {/* Rating */}
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-4 h-4 ${
                                i < Math.floor(book.rating) 
                                  ? 'text-yellow-400 fill-current' 
                                  : 'text-gray-300'
                              }`} 
                            />
                          ))}
                        </div>
                        <span className="text-sm font-medium text-slate-900">{book.rating}</span>
                        <span className="text-sm text-slate-500">({book.reviews} reviews)</span>
                      </div>

                      {/* Price and Actions */}
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl font-bold text-slate-900">${book.price}</span>
                          <Badge variant="outline" className="text-xs">
                            {book.coverType}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            asChild
                          >
                            <Link href={`/books/${book.id}`}>
                              View
                            </Link>
                          </Button>
                          <Button 
                            size="sm" 
                            onClick={() => addToCart(book)}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                          >
                            <ShoppingCart className="w-4 h-4 mr-1" />
                            Add
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Load More / Pagination */}
        <motion.div 
          initial="initial"
          animate="animate"
          variants={fadeUp}
          className="text-center"
        >
          <Button size="lg" variant="outline" className="px-8 py-3">
            Load More Books
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
}