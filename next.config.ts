import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: false, // Enable TypeScript checking for better code quality
  },
  eslint: {
    ignoreDuringBuilds: true, // Temporarily disable ESLint during builds for deployment
  },
  // Fix workspace root warning
  outputFileTracingRoot: __dirname,
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  
  // Optimize for production
  poweredByHeader: false,
  compress: true,
  
  // Performance optimizations
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@radix-ui/react-icons', 'lucide-react'],
  },
  
  // Handle webpack configuration for AI dependencies
  webpack: (config: any, { isServer }: { isServer: boolean }) => {
    // Ignore AI-related modules that cause warnings in production
    config.externals = config.externals || [];
    
    if (isServer) {
      config.externals.push({
        '@opentelemetry/exporter-jaeger': 'commonjs @opentelemetry/exporter-jaeger',
        '@genkit-ai/firebase': 'commonjs @genkit-ai/firebase',
      });
    }
    
    // Handle handlebars warnings
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      crypto: false,
    };
    
    return config;
  },
  
  // Handle missing environment variables gracefully
  env: {
    CUSTOM_BUILD_ID: process.env.NODE_ENV || 'development',
  },
};

export default nextConfig;
