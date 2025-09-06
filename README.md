<div align="center">
  <h1>ShelfWise</h1>
  <p>A Modern Book Marketplace for Readers and Authors</p>
  <p>Created by <strong>rdr-cyber</strong></p>
  
  [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/rdr-cyber/Book_Store_Management)
  [![Live Demo](https://img.shields.io/badge/Live-Demo-success?style=for-the-badge&logo=vercel)](https://book-store-management-rdr-cyber.vercel.app)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](./LICENSE)
  [![Next.js](https://img.shields.io/badge/Next.js-15.3.3-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
</div>

## 🚀 Live Demo

**Experience ShelfWise live at**: [https://book-store-management-rdr-cyber.vercel.app](https://book-store-management-rdr-cyber.vercel.app)

### ✨ What You Can Do:
- 📚 Explore the stunning futuristic homepage
- 🔍 Browse books with AI-powered recommendations 
- 👤 Register as Reader or Author
- 🛒 Test the shopping cart functionality
- 💳 Experience the checkout process
- 📊 View author dashboards and analytics
- 📱 Enjoy responsive design on any device

## ⚡ Quick Deploy

### Deploy to Vercel (Recommended)

**Option 1: One-Click Deploy**
1. Click the deploy button above ↑
2. Connect your GitHub account
3. Deploy automatically

**Option 2: Manual Deploy**
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import `https://github.com/rdr-cyber/Book_Store_Management`
3. Click "Deploy"

**Option 3: CLI Deploy**
```bash
npm i -g vercel
vercel --prod
```

### Deploy to Netlify
1. Go to [netlify.com](https://netlify.com)
2. Connect GitHub repository
3. Build command: `npm run build`
4. Publish directory: `.next`

### Deploy to Railway
1. Go to [railway.app](https://railway.app)
2. Deploy from GitHub
3. Automatic configuration

## 🛠️ Environment Variables

**Required for full functionality:**
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
JWT_SECRET=your_random_secret
```

**Optional for advanced features:**
```env
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

> ℹ️ **Demo Mode**: App works perfectly without environment variables!

## Introduction

ShelfWise is a dynamic and user-friendly online platform designed to connect readers with a diverse range of books and empower authors to publish their work independently. Built with modern technologies and focusing on a clean, intuitive user experience, ShelfWise aims to be the go-to destination for discovering new stories and supporting independent authors.

The application boasts a clean and inviting aesthetic, characterized by a cohesive color palette that evokes a sense of warmth and sophistication. Typography is carefully chosen for readability and visual appeal, contributing to a pleasant browsing experience. The layout is designed to be intuitive and easy to navigate, ensuring users can find what they're looking for quickly and efficiently. High-quality imagery is used throughout the site to showcase books and enhance the visual appeal.

## Core Features

ShelfWise offers a comprehensive set of features catering to both readers and authors. These features are designed to provide a seamless and engaging experience for all users of the platform.

Here's a detailed breakdown of the core features:

### For Readers:

1.  **Intuitive Book Discovery:**
    *   **Browsing:** Users can easily browse books by genre, author, or popularity through a well-organized interface. The browsing experience is designed to be visually appealing, with book covers prominently displayed.
    *   **Search:** A powerful search function allows readers to find specific books by title, author, keywords, or ISBN. The search results are presented clearly and efficiently.
    *   **Personalized Recommendations:** Leveraging AI technology, ShelfWise provides personalized book recommendations based on a reader's browsing history, purchase behavior, and declared interests. This feature helps readers discover books they are likely to enjoy.

2.  **Detailed Book Information:**
    *   Each book listing provides comprehensive details, including the title, author, genre, description, cover image, price, and reader reviews. This allows readers to make informed decisions before purchasing.

3.  **Seamless Purchasing Experience:**
    *   **Shopping Cart:** Readers can add books to their shopping cart and manage their selections easily. The cart is persistent, allowing users to return and complete their purchase later.
    *   **Secure Checkout:** A secure and straightforward checkout process allows readers to purchase books using various payment methods.
    *   **Digital Library:** Purchased digital books are accessible through the reader's personal digital library on the platform, allowing them to read their books anytime, anywhere.

4.  **Community Interaction:**
    *   **Reviews and Ratings:** Readers can leave reviews and ratings for books they have read, contributing to the community and helping other readers discover new titles.

### For Authors:

1.  **Easy Book Publishing:**
    *   Authors can easily upload and publish their books through a guided process. The platform supports various e-book formats.
    *   Authors can provide all necessary book details, including title, genre, description, cover image, and pricing.

2.  **Sales Tracking and Analytics:** Authors have access to a dashboard where they can track their book sales, view analytics, and monitor their earnings. This provides valuable insights into their book's performance.

1.  **Royalty Management:** ShelfWise handles royalty calculations and payments to authors, providing a transparent and efficient system for authors to receive their earnings.

2. **Gifting:** Readers can share their favorite books with friends and family by gifting digital copies to other users on the platform.

3.  **Author Profile:** Authors can create a profile page to showcase their work, share information about themselves, and connect with readers.

### Shared Features:

1.  **User Authentication:** Secure login and registration processes for both readers and authors.
2.  **Role-Based Access:** The platform provides different interfaces and functionalities based on whether a user is a reader or an author.
3.  **Admin Panel:** An administrative panel for managing users, books, and platform settings (details of admin features are outlined in the blueprint).
