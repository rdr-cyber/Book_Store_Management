#!/bin/bash

# ShelfWise Deployment Check Script
echo "🚀 ShelfWise Deployment Readiness Check"
echo "======================================"

# Check if required files exist
echo "📁 Checking project structure..."
if [ -f "package.json" ]; then
    echo "✅ package.json found"
else
    echo "❌ package.json missing"
    exit 1
fi

if [ -f "next.config.ts" ]; then
    echo "✅ next.config.ts found"
else
    echo "❌ next.config.ts missing"
    exit 1
fi

# Check for environment variables
echo "🔧 Checking environment setup..."
if [ -f ".env.example" ]; then
    echo "✅ .env.example found"
else
    echo "⚠️  .env.example not found"
fi

# Build the project
echo "🔨 Building project..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "🌐 Your ShelfWise application is ready for deployment!"
    echo ""
    echo "Next steps:"
    echo "1. Push changes to GitHub"
    echo "2. Deploy to Vercel, Netlify, or your preferred platform"
    echo "3. Configure environment variables in your hosting platform"
    echo "4. Test your live application"
    echo ""
    echo "Environment variables needed:"
    echo "- NEXT_PUBLIC_SUPABASE_URL"
    echo "- NEXT_PUBLIC_SUPABASE_ANON_KEY"
    echo "- JWT_SECRET"
    echo ""
else
    echo "❌ Build failed! Please check the errors above."
    exit 1
fi