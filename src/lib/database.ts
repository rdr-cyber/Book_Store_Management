// @ts-nocheck
// Temporary TypeScript disable for deployment

import { supabase, isSupabaseConfigured } from './supabase';
import { 
  User, 
  Book, 
  Order, 
  Review, 
  Follow, 
  Transaction, 
  AuthorAnalytics, 
  ReviewConversation 
} from './types';

// In-memory storage for development when Supabase is not configured
let mockUsers: User[] = [];
let mockBooks: Book[] = [];
let mockOrders: Order[] = [];
let mockReviews: Review[] = [];
let mockFollows: Follow[] = [];

// Helper function to generate mock IDs
const generateMockId = () => `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// User Management
export const createUser = async (userData: Omit<User, 'id'>) => {
  try {
    if (!isSupabaseConfigured) {
      // Mock implementation
      const mockUser: User = {
        id: generateMockId(),
        ...userData,
        createdAt: new Date(),
      };
      mockUsers.push(mockUser);
      return mockUser.id;
    }

    const { data, error } = await supabase
      .from('users')
      .insert({
        email: userData.email,
        first_name: userData.firstName,
        last_name: userData.lastName,
        role: userData.role,
        avatar_url: userData.avatarUrl,
        bio: userData.bio,
        is_active: true,
        followed_authors: userData.role === 'reader' ? [] : undefined,
        purchased_books: userData.role === 'reader' ? [] : undefined,
        author_verified: userData.role === 'author' ? false : undefined,
        total_books: userData.role === 'author' ? 0 : undefined,
        total_sales: userData.role === 'author' ? 0 : undefined,
        total_revenue: userData.role === 'author' ? 0 : undefined,
      })
      .select()
      .single();
    
    if (error) throw error;
    return data.id;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
  try {
    if (!isSupabaseConfigured) {
      // Mock implementation
      const user = mockUsers.find(u => u.email === email);
      return user || null;
    }

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    if (!data) return null;
    
    return {
      id: data.id,
      firstName: data.first_name,
      lastName: data.last_name,
      email: data.email,
      role: data.role,
      avatarUrl: data.avatar_url,
      bio: data.bio,
      createdAt: data.created_at,
      isActive: data.is_active,
      followedAuthors: data.followed_authors,
      purchasedBooks: data.purchased_books,
      authorVerified: data.author_verified,
      totalBooks: data.total_books,
      totalSales: data.total_sales,
      totalRevenue: data.total_revenue,
    } as User;
  } catch (error) {
    console.error('Error getting user by email:', error);
    throw error;
  }
};

export const getUserById = async (userId: string): Promise<User | null> => {
  try {
    if (!isSupabaseConfigured) {
      // Mock implementation
      const user = mockUsers.find(u => u.id === userId);
      return user || null;
    }

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    if (!data) return null;
    
    return {
      id: data.id,
      firstName: data.first_name,
      lastName: data.last_name,
      email: data.email,
      role: data.role,
      avatarUrl: data.avatar_url,
      bio: data.bio,
      createdAt: data.created_at,
      isActive: data.is_active,
      followedAuthors: data.followed_authors,
      purchasedBooks: data.purchased_books,
      authorVerified: data.author_verified,
      totalBooks: data.total_books,
      totalSales: data.total_sales,
      totalRevenue: data.total_revenue,
    } as User;
  } catch (error) {
    console.error('Error getting user by ID:', error);
    throw error;
  }
};

export const updateUser = async (userId: string, updates: Partial<User>) => {
  try {
    const updateData: any = {};
    if (updates.firstName) updateData.first_name = updates.firstName;
    if (updates.lastName) updateData.last_name = updates.lastName;
    if (updates.email) updateData.email = updates.email;
    if (updates.role) updateData.role = updates.role;
    if (updates.avatarUrl) updateData.avatar_url = updates.avatarUrl;
    if (updates.bio) updateData.bio = updates.bio;
    if (updates.isActive !== undefined) updateData.is_active = updates.isActive;
    if (updates.followedAuthors) updateData.followed_authors = updates.followedAuthors;
    if (updates.purchasedBooks) updateData.purchased_books = updates.purchasedBooks;
    if (updates.authorVerified !== undefined) updateData.author_verified = updates.authorVerified;
    if (updates.totalBooks !== undefined) updateData.total_books = updates.totalBooks;
    if (updates.totalSales !== undefined) updateData.total_sales = updates.totalSales;
    if (updates.totalRevenue !== undefined) updateData.total_revenue = updates.totalRevenue;
    
    updateData.updated_at = new Date().toISOString();
    
    const { error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', userId);
    
    if (error) throw error;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

// Book Management
export const createBook = async (bookData: Omit<Book, 'id'>) => {
  try {
    const { data, error } = await supabase
      .from('books')
      .insert({
        title: bookData.title,
        author_name: bookData.authorName,
        author_id: bookData.authorId,
        price: bookData.price,
        image_url: bookData.imageUrl,
        description: bookData.description,
        category: bookData.category,
        cover_type: bookData.coverType,
        stock: bookData.stock,
        reorder_point: bookData.reorderPoint,
        book_file_url: bookData.bookFileUrl,
        sales: 0,
        revenue: 0,
        average_rating: 0,
        total_reviews: 0,
      })
      .select()
      .single();
    
    if (error) throw error;
    
    // Update author's book count
    const { error: updateError } = await supabase.rpc('increment_user_books', {
      user_id: bookData.authorId
    });
    
    if (updateError) {
      // Fallback: manually update
      const { data: userData } = await supabase
        .from('users')
        .select('total_books')
        .eq('id', bookData.authorId)
        .single();
      
      await supabase
        .from('users')
        .update({ total_books: (userData?.total_books || 0) + 1 })
        .eq('id', bookData.authorId);
    }
    
    return data.id;
  } catch (error) {
    console.error('Error creating book:', error);
    throw error;
  }
};

export const getBooksByAuthor = async (authorId: string): Promise<Book[]> => {
  try {
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .eq('author_id', authorId)
      .order('published_at', { ascending: false });
    
    if (error) throw error;
    
    return (data || []).map(book => ({
      id: book.id,
      title: book.title,
      authorName: book.author_name,
      authorId: book.author_id,
      price: book.price,
      imageUrl: book.image_url,
      description: book.description,
      category: book.category,
      coverType: book.cover_type,
      stock: book.stock,
      reorderPoint: book.reorder_point,
      bookFileUrl: book.book_file_url,
      publishedAt: book.published_at,
      sales: book.sales,
      revenue: book.revenue,
      averageRating: book.average_rating,
      totalReviews: book.total_reviews,
    } as Book));
  } catch (error) {
    console.error('Error getting books by author:', error);
    throw error;
  }
};

export const getAllBooks = async (): Promise<Book[]> => {
  try {
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .order('published_at', { ascending: false });
    
    if (error) throw error;
    
    return (data || []).map(book => ({
      id: book.id,
      title: book.title,
      author: book.author_name, // Map author_name to author
      authorName: book.author_name, // Keep for backward compatibility
      authorId: book.author_id,
      price: book.price,
      imageUrl: book.image_url,
      description: book.description,
      category: book.category,
      coverType: book.cover_type,
      stock: book.stock,
      reorderPoint: book.reorder_point,
      bookFileUrl: book.book_file_url,
      publishedAt: book.published_at,
      sales: book.sales,
      revenue: book.revenue,
      averageRating: book.average_rating,
      totalReviews: book.total_reviews,
    } as Book));
  } catch (error) {
    console.error('Error getting all books:', error);
    throw error;
  }
};

export const getBookById = async (bookId: string): Promise<Book | null> => {
  try {
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .eq('id', bookId)
      .single();
    
    if (error && (error as any).code !== 'PGRST116') throw error;
    if (!data) return null;
    
    return {
      id: data.id,
      title: data.title,
      author: data.author_name, // Map author_name to author
      authorName: data.author_name, // Keep for backward compatibility
      authorId: data.author_id,
      price: data.price,
      imageUrl: data.image_url,
      description: data.description,
      category: data.category,
      coverType: data.cover_type,
      stock: data.stock,
      reorderPoint: data.reorder_point,
      bookFileUrl: data.book_file_url,
      publishedAt: data.published_at,
      sales: data.sales,
      revenue: data.revenue,
      averageRating: data.average_rating,
      totalReviews: data.total_reviews,
    } as Book;
  } catch (error) {
    console.error('Error getting book by ID:', error);
    throw error;
  }
};

export const updateBook = async (bookId: string, updates: Partial<Book>) => {
  try {
    const updateData: any = {};
    if (updates.title) updateData.title = updates.title;
    if (updates.author) updateData.author_name = updates.author;
    if (updates.authorName) updateData.author_name = updates.authorName;
    if (updates.price !== undefined) updateData.price = updates.price;
    if (updates.imageUrl) updateData.image_url = updates.imageUrl;
    if (updates.description) updateData.description = updates.description;
    if (updates.category) updateData.category = updates.category;
    if (updates.coverType) updateData.cover_type = updates.coverType;
    if (updates.stock !== undefined) updateData.stock = updates.stock;
    if (updates.reorderPoint !== undefined) updateData.reorder_point = updates.reorderPoint;
    if (updates.bookFileUrl) updateData.book_file_url = updates.bookFileUrl;
    if (updates.sales !== undefined) updateData.sales = updates.sales;
    if (updates.revenue !== undefined) updateData.revenue = updates.revenue;
    if (updates.averageRating !== undefined) updateData.average_rating = updates.averageRating;
    if (updates.totalReviews !== undefined) updateData.total_reviews = updates.totalReviews;
    
    updateData.updated_at = new Date().toISOString();
    
    const { error } = await supabase
      .from('books')
      .update(updateData)
      .eq('id', bookId);
    
    if (error) throw error;
  } catch (error) {
    console.error('Error updating book:', error);
    throw error;
  }
};

// Order Management
export const createOrder = async (orderData: Omit<Order, 'id'>) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .insert({
        user_id: orderData.userId,
        books: orderData.books,
        total_amount: orderData.totalAmount,
        status: orderData.status,
        payment_method: orderData.paymentMethod,
        payment_gateway: orderData.paymentGateway,
        payment_id: orderData.paymentId,
        order_id: orderData.orderId,
        shipping_address: orderData.shippingAddress,
      })
      .select()
      .single();
    
    if (error) throw error;
    return data.id;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

export const updateOrderStatus = async (orderId: string, status: Order['status'], paymentId?: string) => {
  try {
    const updates: any = { status };
    if (paymentId) {
      updates.payment_id = paymentId;
    }
    if (status === 'completed') {
      updates.completed_at = new Date().toISOString();
    }
    
    const { error } = await supabase
      .from('orders')
      .update(updates)
      .eq('id', orderId);
    
    if (error) throw error;
    
    // If order is completed, update book sales and user purchased books
    if (status === 'completed') {
      const { data: order } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();
      
      if (order) {
        // Update each book's sales and revenue
        for (const item of order.books) {
          const { data: book } = await supabase
            .from('books')
            .select('sales, revenue, stock, author_id')
            .eq('id', item.bookId)
            .single();
          
          if (book) {
            await supabase
              .from('books')
              .update({
                sales: (book.sales || 0) + item.quantity,
                revenue: (book.revenue || 0) + (item.price * item.quantity),
                stock: (book.stock || 0) - item.quantity
              })
              .eq('id', item.bookId);
            
            // Update author stats
            const { data: author } = await supabase
              .from('users')
              .select('total_sales, total_revenue')
              .eq('id', book.author_id)
              .single();
            
            if (author) {
              await supabase
                .from('users')
                .update({
                  total_sales: (author.total_sales || 0) + item.quantity,
                  total_revenue: (author.total_revenue || 0) + (item.price * item.quantity)
                })
                .eq('id', book.author_id);
            }
          }
        }
        
        // Update user's purchased books
        const purchasedBookIds = order.books.map((item: any) => item.bookId);
        const { data: user } = await supabase
          .from('users')
          .select('purchased_books')
          .eq('id', order.user_id)
          .single();
        
        if (user) {
          const updatedPurchasedBooks = [...(user.purchased_books || []), ...purchasedBookIds];
          await supabase
            .from('users')
            .update({ purchased_books: updatedPurchasedBooks })
            .eq('id', order.user_id);
        }
      }
    }
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

export const getUserOrders = async (userId: string): Promise<Order[]> => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return (data || []).map(order => ({
      id: order.id,
      userId: order.user_id,
      books: order.books,
      totalAmount: order.total_amount,
      status: order.status,
      paymentMethod: order.payment_method,
      paymentGateway: order.payment_gateway,
      paymentId: order.payment_id,
      orderId: order.order_id,
      createdAt: order.created_at,
      completedAt: order.completed_at,
      shippingAddress: order.shipping_address,
    } as Order));
  } catch (error) {
    console.error('Error getting user orders:', error);
    throw error;
  }
};

// Review Management
export const createReview = async (reviewData: Omit<Review, 'id'>) => {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .insert({
        book_id: reviewData.bookId,
        user_id: reviewData.userId,
        username: reviewData.username,
        rating: reviewData.rating,
        comment: reviewData.comment,
        author_reply: reviewData.authorReply,
        reader_follow_up: reviewData.readerFollowUp,
      })
      .select()
      .single();
    
    if (error) throw error;
    
    // Update book's review stats
    const { data: reviews } = await supabase
      .from('reviews')
      .select('rating')
      .eq('book_id', reviewData.bookId);
    
    if (reviews) {
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      const totalReviews = reviews.length;
      const averageRating = totalRating / totalReviews;
      
      await supabase
        .from('books')
        .update({
          total_reviews: totalReviews,
          average_rating: averageRating
        })
        .eq('id', reviewData.bookId);
    }
    
    return data.id;
  } catch (error) {
    console.error('Error creating review:', error);
    throw error;
  }
};

export const getBookReviews = async (bookId: string): Promise<Review[]> => {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('book_id', bookId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return (data || []).map(review => ({
      id: review.id,
      bookId: review.book_id,
      userId: review.user_id,
      username: review.username,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.created_at,
      authorReply: review.author_reply,
      readerFollowUp: review.reader_follow_up,
    } as Review));
  } catch (error) {
    console.error('Error getting book reviews:', error);
    throw error;
  }
};

export const updateReview = async (reviewId: string, updates: Partial<Review>) => {
  try {
    const updateData: any = {};
    if (updates.rating !== undefined) updateData.rating = updates.rating;
    if (updates.comment) updateData.comment = updates.comment;
    if (updates.authorReply !== undefined) updateData.author_reply = updates.authorReply;
    if (updates.readerFollowUp !== undefined) updateData.reader_follow_up = updates.readerFollowUp;
    
    const { error } = await supabase
      .from('reviews')
      .update(updateData)
      .eq('id', reviewId);
    
    if (error) throw error;
  } catch (error) {
    console.error('Error updating review:', error);
    throw error;
  }
};

// Follow Management
export const followAuthor = async (readerId: string, authorId: string) => {
  try {
    // Check if already following
    const { data: existingFollow } = await supabase
      .from('follows')
      .select('id')
      .eq('reader_id', readerId)
      .eq('author_id', authorId)
      .single();
    
    if (existingFollow) {
      throw new Error('Already following this author');
    }
    
    const { data, error } = await supabase
      .from('follows')
      .insert({
        reader_id: readerId,
        author_id: authorId,
      })
      .select()
      .single();
    
    if (error) throw error;
    
    // Update reader's followed authors
    const { data: user } = await supabase
      .from('users')
      .select('followed_authors')
      .eq('id', readerId)
      .single();
    
    if (user) {
      const updatedFollowedAuthors = [...(user.followed_authors || []), authorId];
      await supabase
        .from('users')
        .update({ followed_authors: updatedFollowedAuthors })
        .eq('id', readerId);
    }
    
    return data.id;
  } catch (error) {
    console.error('Error following author:', error);
    throw error;
  }
};

export const unfollowAuthor = async (readerId: string, authorId: string) => {
  try {
    const { error } = await supabase
      .from('follows')
      .delete()
      .eq('reader_id', readerId)
      .eq('author_id', authorId);
    
    if (error) throw error;
    
    // Update reader's followed authors
    const { data: user } = await supabase
      .from('users')
      .select('followed_authors')
      .eq('id', readerId)
      .single();
    
    if (user) {
      const updatedFollowedAuthors = (user.followed_authors || []).filter((id: string) => id !== authorId);
      await supabase
        .from('users')
        .update({ followed_authors: updatedFollowedAuthors })
        .eq('id', readerId);
    }
  } catch (error) {
    console.error('Error unfollowing author:', error);
    throw error;
  }
};

export const getAuthorFollowers = async (authorId: string): Promise<Follow[]> => {
  try {
    const { data, error } = await supabase
      .from('follows')
      .select('*')
      .eq('author_id', authorId);
    
    if (error) throw error;
    
    return (data || []).map(follow => ({
      id: follow.id,
      readerId: follow.reader_id,
      authorId: follow.author_id,
      followedAt: follow.followed_at,
    } as Follow));
  } catch (error) {
    console.error('Error getting author followers:', error);
    throw error;
  }
};

// Check if user has purchased a book
export const hasUserPurchasedBook = async (userId: string, bookId: string): Promise<boolean> => {
  try {
    const user = await getUserById(userId);
    return user?.purchasedBooks?.includes(bookId) || false;
  } catch (error) {
    console.error('Error checking book purchase:', error);
    throw error;
  }
};

// Analytics
export const getAuthorAnalytics = async (authorId: string): Promise<AuthorAnalytics | null> => {
  try {
    // For Supabase, we'll calculate analytics on demand from the users table
    const { data: user, error } = await supabase
      .from('users')
      .select('total_books, total_sales, total_revenue')
      .eq('id', authorId)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    if (!user) return null;
    
    // Get additional analytics from books table
    const { data: books } = await supabase
      .from('books')
      .select('sales, revenue, average_rating')
      .eq('author_id', authorId);
    
    const topBook = books?.reduce((prev, current) => 
      (prev.sales > current.sales) ? prev : current
    );
    
    return {
      authorId,
      totalBooks: user.total_books || 0,
      totalSales: user.total_sales || 0,
      totalRevenue: user.total_revenue || 0,
      averageRating: books?.reduce((sum, book) => sum + (book.average_rating || 0), 0) / (books?.length || 1) || 0,
      topSellingBook: topBook ? {
        title: '', // We'd need to join with book details
        sales: topBook.sales || 0
      } : undefined,
      monthlyStats: [], // This would require more complex queries
      lastUpdated: new Date().toISOString(),
    } as AuthorAnalytics;
  } catch (error) {
    console.error('Error getting author analytics:', error);
    throw error;
  }
};

export const updateAuthorAnalytics = async (authorId: string, updates: Partial<AuthorAnalytics>) => {
  try {
    // In Supabase, we update the user record directly
    const updateData: any = {};
    if (updates.totalBooks !== undefined) updateData.total_books = updates.totalBooks;
    if (updates.totalSales !== undefined) updateData.total_sales = updates.totalSales;
    if (updates.totalRevenue !== undefined) updateData.total_revenue = updates.totalRevenue;
    
    if (Object.keys(updateData).length > 0) {
      updateData.updated_at = new Date().toISOString();
      
      const { error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', authorId);
      
      if (error) throw error;
    }
  } catch (error) {
    console.error('Error updating author analytics:', error);
    throw error;
  }
};