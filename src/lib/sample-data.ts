
import type { Book, BookAccess, Transaction, User } from "./types";

export const allBooks: Book[] = [
  {
    id: "1",
    title: "The Midnight Library",
    author: "Matt Haig",
    price: 14.99,
    imageUrl: "https://placehold.co/400x600.png",
    description:
      "Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived.",
    category: "Fiction",
    coverType: "Paperback",
    stock: 25,
  },
  {
    id: "2",
    title: "Project Hail Mary",
    author: "Andy Weir",
    price: 18.5,
    imageUrl: "https://placehold.co/400x600.png",
    description:
      "Ryland Grace is the sole survivor on a desperate, last-chance mission—and if he fails, humanity and the earth itself will perish.",
    category: "Science",
    coverType: "Hardcover",
    stock: 15,
  },
  {
    id: "3",
    title: "Dune",
    author: "Frank Herbert",
    price: 12.0,
    imageUrl: "https://placehold.co/400x600.png",
    description:
      "Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides, heir to a noble family tasked with ruling an inhospitable world where the only thing of value is the 'spice' melange.",
    category: "Fantasy",
    coverType: "Paperback",
    stock: 30,
  },
  {
    id: "4",
    title: "Sapiens: A Brief History of Humankind",
    author: "Yuval Noah Harari",
    price: 22.0,
    imageUrl: "https://placehold.co/400x600.png",
    description:
      "A groundbreaking narrative of humanity’s creation and evolution—a #1 international bestseller that explores the ways in which biology and history have defined us and enhanced our understanding of what it means to be 'human.'",
    category: "History",
    coverType: "Hardcover",
    stock: 20,
  },
  {
    id: "5",
    title: "The Four Winds",
    author: "Kristin Hannah",
    price: 16.99,
    imageUrl: "https://placehold.co/400x600.png",
    description:
      "An epic novel of love and heroism and hope, set against the backdrop of one of America’s most defining eras—the Great Depression.",
    category: "Fiction",
    coverType: "Paperback",
    stock: 18,
  },
  {
    id: "6",
    title: "Educated: A Memoir",
    author: "Tara Westover",
    price: 17.99,
    imageUrl: "https://placehold.co/400x600.png",
    description:
      "An unforgettable memoir about a young girl who, kept out of school, leaves her survivalist family and goes on to earn a PhD from Cambridge University.",
    category: "Biography",
    coverType: "Hardcover",
    stock: 12,
  },
  {
    id: "7",
    title: "The Song of Achilles",
    author: "Madeline Miller",
    price: 11.5,
    imageUrl: "https://placehold.co/400x600.png",
    description:
      "A tale of gods, kings, immortal fame, and the human heart, The Song of Achilles is a dazzling literary feat that brilliantly reimagines Homer’s enduring masterwork, The Iliad.",
    category: "Fantasy",
    coverType: "Paperback",
    stock: 40,
  },
  {
    id: "8",
    title: "Atomic Habits",
    author: "James Clear",
    price: 20.0,
    imageUrl: "https://placehold.co/400x600.png",
    description:
      "An easy and proven way to build good habits and break bad ones. Tiny changes, remarkable results.",
    category: "Non-Fiction",
    coverType: "Hardcover",
    stock: 50,
  },
];

export const bookCategories = [
  "All",
  "Fiction",
  "Non-Fiction",
  "Science",
  "Fantasy",
  "History",
  "Biography"
];

export const userBookAccess: BookAccess[] = [
  { userId: 'reader1', bookId: '2', purchaseDate: new Date() },
  { userId: 'reader1', bookId: '7', purchaseDate: new Date() },
];

export const transactions: Transaction[] = [
    { id: 'txn1', userId: 'reader1', bookId: '2', amount: 18.50, status: 'success', createdAt: new Date() },
    { id: 'txn2', userId: 'reader1', bookId: '7', amount: 11.50, status: 'success', createdAt: new Date() },
];
