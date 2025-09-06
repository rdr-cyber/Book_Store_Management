

export type Book = {
  id: string;
  title: string;
  author: string; // Author's name for display
  authorName?: string; // Alias for database compatibility
  authorId: string; // This would be the author's user ID
  price: number;
  imageUrl: string;
  description: string;
  category: "Fiction" | "Non-Fiction" | "Science" | "Fantasy" | "History" | "Biography" | "Other";
  coverType: "Paperback" | "Hardcover";
  stock: number; // Represents physical copies
  reorderPoint: number; // The stock level at which to reorder
  bookFileUrl?: string; // Data URL for the readable book file (PDF, etc.)
  publishedAt: Date;
  sales: number; // Total number of copies sold
  revenue: number; // Total revenue generated
  averageRating: number; // Average rating from reviews
  totalReviews: number; // Total number of reviews
};

export type UserRole = "reader" | "author" | "admin";

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string; // Password might not always be present on the client
  role: UserRole;
  createdAt: Date;
  isActive: boolean;
  profilePicture?: string;
  bio?: string;
  // Author specific fields
  authorVerified?: boolean;
  totalBooks?: number;
  totalSales?: number;
  totalRevenue?: number;
  // Reader specific fields
  followedAuthors?: string[]; // Array of author IDs
  purchasedBooks?: string[]; // Array of book IDs
}

// Represents a user's ownership of a book
export type BookAccess = {
  userId: string;
  bookId: string;
  purchaseDate: Date;
};

// Represents a financial transaction for a book purchase
export type Transaction = {
  id: string;
  userId: string;
  bookId: string;
  authorId?: string;
  quantity: number;
  amount: number;
  status: "pending" | "success" | "failed";
  createdAt: Date;
  paymentGatewayId?: string;
};

// Represents a review for a book
export type Review = {
    id: string;
    bookId: string;
    userId: string;
    username: string; // e.g., "John D."
    rating: number; // 1-10
    comment: string;
    createdAt: string; // ISO 8601 date string
    authorReply?: string; // Author's reply to the review
    readerFollowUp?: string; // Reader's follow-up to the author's reply
}

// Represents a gifted book transaction
export type Gift = {
  id: string;
  bookId: string;
  giverUserId: string;
  recipientEmail: string;
  recipientUserId: string; 
  amount: number;
  status: "sent" | "claimed";
  createdAt: Date;
}

// Represents a follow relationship between reader and author
export type Follow = {
  id: string;
  readerId: string;
  authorId: string;
  followedAt: Date;
}

// Represents an order containing multiple books
export type Order = {
  id: string;
  userId: string;
  books: {
    bookId: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  status: "pending" | "processing" | "completed" | "cancelled" | "failed";
  paymentMethod: "upi" | "credit_card" | "debit_card";
  paymentGateway: "razorpay" | "googlepay" | "phonepe";
  paymentId?: string;
  orderId?: string;
  createdAt: Date;
  completedAt?: Date;
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

// Represents a review conversation thread
export type ReviewConversation = {
  id: string;
  reviewId: string;
  messages: {
    id: string;
    senderId: string;
    senderRole: "reader" | "author";
    message: string;
    timestamp: Date;
  }[];
  isActive: boolean;
  lastUpdated: Date;
}

// Authentication related types
export type AuthUser = {
  uid: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
}

// VPN Detection result
export type VPNDetectionResult = {
  isVPN: boolean;
  country?: string;
  isp?: string;
  risk: "low" | "medium" | "high";
}

// Payment integration types
export type PaymentIntent = {
  id: string;
  amount: number;
  currency: string;
  orderId: string;
  userId: string;
  status: "created" | "attempted" | "paid" | "failed";
  paymentMethod: string;
  createdAt: Date;
}

// Analytics data for authors
export type AuthorAnalytics = {
  authorId: string;
  totalBooks: number;
  totalSales: number;
  totalRevenue: number;
  monthlyData: {
    month: string;
    sales: number;
    revenue: number;
  }[];
  topBooks: {
    bookId: string;
    title: string;
    sales: number;
    revenue: number;
  }[];
  readerStats: {
    totalFollowers: number;
    newFollowersThisMonth: number;
  };
  lastUpdated: Date;
}