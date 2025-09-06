# 🚀 ShelfWise - Environment Variables Guide

## Required for Full Functionality (Optional)

### 📦 Database (Supabase) - Optional
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 💳 Payment Gateway (Razorpay) - Optional
```env
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_your_key_id
```

### 🔐 Authentication - Optional
```env
NEXTAUTH_SECRET=your_random_secret_string
NEXTAUTH_URL=https://your-app.vercel.app
```

### 🤖 AI Features - Optional
```env
GOOGLE_GENAI_API_KEY=your_google_genai_key
```

## 🎯 For Vercel Deployment

1. **Deploy first without any environment variables** (app works with mock data)
2. **Add environment variables later** in Vercel dashboard under:
   - Project Settings → Environment Variables

## 📝 Important Notes

- ✅ **App works perfectly without any environment variables**
- ✅ **Mock data provides full functionality demo**
- ✅ **Add real services later for production use**
- ✅ **All features are pre-configured with fallbacks**

## 🌟 Demo Features (No Setup Required)

- 📚 Browse sample books
- 🔍 Search and filtering
- 🛒 Shopping cart simulation
- 👤 Mock authentication
- 📱 Responsive design
- ⭐ Review system
- 📊 Dashboard analytics