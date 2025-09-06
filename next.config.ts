import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: process.env.NODE_ENV === 'development', // Only ignore in dev
  },
  eslint: {
    ignoreDuringBuilds: process.env.NODE_ENV === 'development', // Only ignore in dev
  },
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
  // Handle missing environment variables gracefully
  env: {
    CUSTOM_BUILD_ID: process.env.NODE_ENV || 'development',
  },
};

export default nextConfig;
