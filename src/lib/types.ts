

export type Book = {
  id: string;
  title: string;
  author: string; 
  authorId: string; // This would be the author's user ID
  price: number;
  imageUrl: string;
  description: string;
  category: "Fiction" | "Non-Fiction" | "Science" | "Fantasy" | "History" | "Biography" | "Other";
  coverType: "Paperback" | "Hardcover";
  stock: number; // Represents physical copies
  reorderPoint: number; // The stock level at which to reorder
  bookFileUrl?: string; // Data URL for the readable book file (PDF, etc.)
};

export type UserRole = "reader" | "author" | "admin";

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string; // Password might not always be present on the client
  role: UserRole;
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