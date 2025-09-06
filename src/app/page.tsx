'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ArrowRight, 
  BookOpen, 
  Users, 
  Star, 
  TrendingUp, 
  Zap, 
  Shield, 
  Crown,
  Sparkles,
  Play,
  Check,
  Heart,
  Award,
  Globe,
  Palette,
  Coffee,
  Lightbulb,
  Layers,
  Cpu,
  Infinity as InfinityIcon,
  Hexagon,
  Triangle,
  Circle
} from "lucide-react";
import Image from "next/image";
// import HomePageLogo from "@/home_page_logo.png"; // Commented out - file not found
import { motion, useMotionValue, useTransform } from "framer-motion";
import { useState, useEffect, useRef } from 'react';

const fadeUp = {
  initial: { opacity: 0, y: 50, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1 },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.12
    }
  }
};

export default function Home() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Pre-defined particle positions to avoid hydration mismatch
  const particlePositions = [
    { left: 24.8, top: 23.5 },
    { left: 30.3, top: 11.6 },
    { left: 77.6, top: 71.3 },
    { left: 75.7, top: 14.2 },
    { left: 7.7, top: 74.2 },
    { left: 54.2, top: 32.0 },
    { left: 66.8, top: 67.8 },
    { left: 49.6, top: 75.8 },
    { left: 80.4, top: 57.9 },
    { left: 80.4, top: 99.3 },
    { left: 89.6, top: 58.8 },
    { left: 98.8, top: 70.1 },
    { left: 55.0, top: 57.3 },
    { left: 20.7, top: 26.0 },
    { left: 11.1, top: 31.4 },
    { left: 48.5, top: 3.7 },
    { left: 64.4, top: 46.5 },
    { left: 39.5, top: 5.7 },
    { left: 81.0, top: 98.0 },
    { left: 11.4, top: 99.9 }
  ];
  
  const cursorXSpring = useTransform(mouseX, (value) => value);
  const cursorYSpring = useTransform(mouseY, (value) => value);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setMousePosition({ x, y });
        mouseX.set(x);
        mouseY.set(y);
      }
    };

    if (containerRef.current) {
      containerRef.current.addEventListener('mousemove', handleMouseMove);
      return () => {
        if (containerRef.current) {
          containerRef.current.removeEventListener('mousemove', handleMouseMove);
        }
      };
    }
  }, [mouseX, mouseY]);
  
  const testimonials = [
    { 
      name: "Dr. Sarah Chen", 
      role: "New York Times Bestselling Author", 
      text: "ShelfWise revolutionized how I connect with my readers. The AI insights are phenomenal!", 
      avatar: "👩‍💻",
      rating: 5,
      badge: "Verified Author"
    },
    { 
      name: "Prof. Michael Roberts", 
      role: "Literary Critic & Book Curator", 
      text: "The most sophisticated book discovery platform I've ever encountered. Absolutely brilliant!", 
      avatar: "👨‍🎓",
      rating: 5,
      badge: "Expert Reviewer"
    },
    { 
      name: "Emma Thompson", 
      role: "Independent Publisher & Author", 
      text: "From struggling indie to bestseller - ShelfWise made my publishing dreams reality!", 
      avatar: "👩‍🎨",
      rating: 5,
      badge: "Success Story"
    }
  ];

  const features = [
    {
      icon: Cpu,
      title: "Neural Discovery",
      description: "Advanced AI that learns your literary DNA to curate perfect matches",
      color: "from-cyan-400 via-blue-500 to-indigo-600",
      gradient: "bg-gradient-to-br from-cyan-400/20 to-blue-600/20"
    },
    {
      icon: InfinityIcon,
      title: "Infinite Community",
      description: "Connect across dimensions with readers and authors in our metaverse",
      color: "from-purple-400 via-pink-500 to-red-500",
      gradient: "bg-gradient-to-br from-purple-400/20 to-pink-600/20"
    },
    {
      icon: Crown,
      title: "Elite Access",
      description: "VIP portal to exclusive content, early releases, and author meetups",
      color: "from-amber-400 via-orange-500 to-red-500",
      gradient: "bg-gradient-to-br from-amber-400/20 to-orange-600/20"
    }
  ];

  const stats = [
    { number: "2.5M+", label: "Global Readers", icon: Globe, glow: "shadow-blue-500/50" },
    { number: "150K+", label: "Premium Books", icon: BookOpen, glow: "shadow-purple-500/50" },
    { number: "99.9%", label: "AI Accuracy", icon: Cpu, glow: "shadow-cyan-500/50" },
    { number: "24/7", label: "Neural Support", icon: Zap, glow: "shadow-amber-500/50" }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white relative overflow-hidden">
      {/* Advanced Background System */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated Gradient Mesh */}
        <motion.div 
          className="absolute inset-0 opacity-30"
          style={{
            background: `
              radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, rgba(147, 51, 234, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 40% 60%, rgba(6, 182, 212, 0.2) 0%, transparent 50%)
            `
          }}
          animate={{
            transform: ['scale(1) rotate(0deg)', 'scale(1.1) rotate(180deg)', 'scale(1) rotate(360deg)'],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: 'linear'
          }}
        />
        
        {/* Geometric Floating Elements */}
        <motion.div 
          className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl"
          animate={{
            y: [-20, 20, -20],
            rotate: [0, 5, -5, 0]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.8, 0.3]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Interactive Cursor Light */}
        <motion.div
          className="absolute w-96 h-96 rounded-full pointer-events-none z-10"
          style={{
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
            left: cursorXSpring,
            top: cursorYSpring,
            transform: 'translate(-50%, -50%)',
          }}
          animate={{
            scale: isHovering ? 1.5 : 1,
            opacity: isHovering ? 0.8 : 0.4
          }}
        />
        
        {/* Neural Network Grid */}
        <div className="absolute inset-0 opacity-5">
          <div className="h-full w-full" style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.5) 1px, transparent 1px)
            `,
            backgroundSize: '100px 100px'
          }} />
        </div>
      </div>
      {/* Revolutionary Hero Section */}
      <section className="relative z-20 pt-20 pb-32 min-h-screen flex items-center">
        <div className="container mx-auto px-6 relative z-30">
          <motion.div
            initial="initial"
            animate="animate"
            variants={stagger}
            className="max-w-7xl mx-auto"
          >
            {/* Premium Badge */}
            <motion.div variants={fadeUp} className="flex justify-center mb-8">
              <motion.div 
                className="inline-flex items-center px-8 py-4 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-500 group"
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                onHoverStart={() => setIsHovering(true)}
                onHoverEnd={() => setIsHovering(false)}
              >
                <motion.div
                  className="w-3 h-3 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full mr-3"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.7, 1, 0.7]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <Sparkles className="w-5 h-5 mr-3 text-cyan-400" />
                <span className="text-white font-semibold text-lg tracking-wide">
                  Next-Generation Reading Platform
                </span>
                <motion.div
                  className="ml-3 px-3 py-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-xs font-bold text-white"
                  animate={{
                    boxShadow: [
                      '0 0 20px rgba(6, 182, 212, 0.3)',
                      '0 0 40px rgba(6, 182, 212, 0.6)',
                      '0 0 20px rgba(6, 182, 212, 0.3)'
                    ]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  BETA 2.0
                </motion.div>
              </motion.div>
            </motion.div>
            
            {/* Revolutionary Title */}
            <motion.div variants={fadeUp} className="text-center mb-12">
              <motion.h1 
                className="text-6xl md:text-8xl lg:text-9xl font-black mb-8 leading-[0.85] tracking-tight"
                style={{
                  background: 'linear-gradient(135deg, #ffffff 0%, #60a5fa 25%, #a78bfa 50%, #06b6d4 75%, #ffffff 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                  backgroundSize: '400% 400%'
                }}
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: 'linear'
                }}
              >
                <motion.span 
                  className="block"
                  initial={{ opacity: 0, y: 100, rotateX: -90 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                >
                  SHELFWISE
                </motion.span>
                <motion.span 
                  className="block bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent"
                  initial={{ opacity: 0, y: 100, rotateX: -90 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  REVOLUTION
                </motion.span>
              </motion.h1>
              
              <motion.p 
                variants={fadeUp}
                className="text-xl md:text-3xl text-gray-300 mb-16 max-w-5xl mx-auto leading-relaxed font-light"
                style={{
                  textShadow: '0 0 30px rgba(255, 255, 255, 0.1)'
                }}
              >
                Experience the future of literature through
                <motion.span 
                  className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 font-semibold"
                  animate={{
                    textShadow: [
                      '0 0 20px rgba(6, 182, 212, 0.5)',
                      '0 0 40px rgba(6, 182, 212, 0.8)',
                      '0 0 20px rgba(6, 182, 212, 0.5)'
                    ]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  {" "}Neural AI Discovery
                </motion.span>
                {" "}and immersive digital experiences that transcend traditional reading.
              </motion.p>
            </motion.div>
            
            {/* Revolutionary Action Buttons */}
            <motion.div 
              variants={fadeUp}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20"
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="group"
              >
                <Button 
                  asChild 
                  size="lg" 
                  className="relative overflow-hidden bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:via-blue-500 hover:to-purple-500 text-white px-12 py-6 rounded-2xl text-xl font-bold shadow-2xl transition-all duration-500 border-0"
                  style={{
                    boxShadow: '0 20px 40px rgba(6, 182, 212, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                  }}
                >
                  <Link href="/login?role=reader" className="flex items-center relative z-10">
                    <motion.div
                      className="absolute inset-0 bg-white/20 rounded-2xl"
                      initial={{ scale: 0, opacity: 0 }}
                      whileHover={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                    <Layers className="mr-3 w-6 h-6" />
                    Enter the Matrix
                    <motion.div
                      className="ml-3"
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight className="w-6 h-6" />
                    </motion.div>
                  </Link>
                </Button>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="group"
              >
                <Button 
                  asChild 
                  variant="outline" 
                  size="lg" 
                  className="relative overflow-hidden border-2 border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10 backdrop-blur-xl text-white px-12 py-6 rounded-2xl text-xl font-bold transition-all duration-500"
                  style={{
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <Link href="/login?role=author" className="flex items-center relative z-10">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 rounded-2xl"
                      initial={{ scale: 0, opacity: 0 }}
                      whileHover={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                    <Crown className="mr-3 w-6 h-6" />
                    Create Legacy
                    <Hexagon className="ml-3 w-6 h-6" />
                  </Link>
                </Button>
              </motion.div>
            </motion.div>

            {/* 3D Interactive Stats */}
            <motion.div 
              variants={fadeUp}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  variants={fadeUp}
                  className="group perspective-1000"
                  whileHover={{ 
                    scale: 1.1,
                    rotateY: 10,
                    z: 50
                  }}
                  onHoverStart={() => setIsHovering(true)}
                  onHoverEnd={() => setIsHovering(false)}
                  transition={{ duration: 0.5, ease: "backOut" }}
                >
                  <motion.div
                    className={`relative p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-500 group-hover:shadow-2xl ${stat.glow}`}
                    style={{
                      transformStyle: 'preserve-3d',
                      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                    }}
                    animate={{
                      rotateY: [0, 5, 0, -5, 0],
                    }}
                    transition={{
                      duration: 6,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: index * 0.5
                    }}
                  >
                    {/* Glow Effect */}
                    <motion.div
                      className="absolute inset-0 rounded-3xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 blur-xl"
                      animate={{
                        opacity: [0.3, 0.7, 0.3],
                        scale: [0.9, 1.1, 0.9]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: index * 0.3
                      }}
                    />
                    
                    <div className="relative z-10 text-center">
                      <motion.div
                        className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-2xl flex items-center justify-center"
                        animate={{
                          rotateX: [0, 360],
                          scale: [1, 1.1, 1]
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: index * 0.2
                        }}
                        style={{
                          boxShadow: '0 10px 30px rgba(6, 182, 212, 0.4)'
                        }}
                      >
                        <stat.icon className="w-8 h-8 text-white" />
                      </motion.div>
                      
                      <motion.div 
                        className="text-4xl font-black text-white mb-2"
                        style={{
                          textShadow: '0 0 20px rgba(255, 255, 255, 0.5)'
                        }}
                        animate={{
                          scale: [1, 1.05, 1]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: index * 0.1
                        }}
                      >
                        {stat.number}
                      </motion.div>
                      
                      <div className="text-sm text-gray-300 font-medium tracking-wide uppercase">
                        {stat.label}
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Neural Features Section */}
      <section className="py-32 relative z-20">
        {/* Section Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/50 to-transparent" />
        
        <div className="container mx-auto px-6 relative z-30">
          <motion.div 
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-24"
          >
            <motion.div
              variants={fadeUp}
              className="inline-flex items-center px-6 py-3 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 mb-8"
            >
              <Cpu className="w-5 h-5 mr-3 text-cyan-400" />
              <span className="text-white font-semibold">Powered by Advanced AI</span>
            </motion.div>
            
            <motion.h2 
              variants={fadeUp}
              className="text-6xl md:text-7xl font-black mb-8 text-white"
              style={{
                textShadow: '0 0 40px rgba(255, 255, 255, 0.3)'
              }}
            >
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                Neural
              </span>
              {" "}
              <span className="text-white">
                Features
              </span>
            </motion.h2>
            
            <motion.p 
              variants={fadeUp}
              className="text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
            >
              Discover capabilities that redefine what's possible in digital literature
            </motion.p>
          </motion.div>
          
          <motion.div 
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="grid lg:grid-cols-3 gap-12 max-w-7xl mx-auto"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeUp}
                className="group perspective-1000"
                whileHover={{ 
                  scale: 1.05,
                  rotateY: index % 2 === 0 ? 5 : -5,
                  z: 100
                }}
                transition={{ duration: 0.6, ease: "backOut" }}
              >
                <Card className="h-full bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-700 relative overflow-hidden group-hover:shadow-2xl">
                  {/* Animated Background Gradient */}
                  <motion.div
                    className={`absolute inset-0 ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700`}
                    animate={{
                      background: [
                        'linear-gradient(45deg, rgba(6, 182, 212, 0.1), rgba(147, 51, 234, 0.1))',
                        'linear-gradient(225deg, rgba(147, 51, 234, 0.1), rgba(6, 182, 212, 0.1))',
                        'linear-gradient(45deg, rgba(6, 182, 212, 0.1), rgba(147, 51, 234, 0.1))'
                      ]
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />
                  
                  {/* Holographic Border Effect */}
                  <motion.div
                    className="absolute inset-0 rounded-3xl"
                    style={{
                      background: `linear-gradient(90deg, 
                        transparent 0%, 
                        rgba(6, 182, 212, 0.3) 50%, 
                        transparent 100%
                      )`,
                      transform: 'translateX(-100%)'
                    }}
                    animate={{
                      transform: ['translateX(-100%)', 'translateX(100%)']
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear",
                      delay: index * 0.7
                    }}
                  />
                  
                  <CardContent className="p-10 relative z-10">
                    <motion.div
                      className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-3xl flex items-center justify-center mb-8 mx-auto"
                      style={{
                        boxShadow: '0 20px 40px rgba(6, 182, 212, 0.4)'
                      }}
                      animate={{
                        rotateY: [0, 360],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: index * 0.5
                      }}
                      whileHover={{
                        scale: 1.2,
                        rotateY: 180
                      }}
                    >
                      <feature.icon className="w-10 h-10 text-white" />
                    </motion.div>
                    
                    <h3 className="text-3xl font-bold text-white mb-6 text-center">
                      {feature.title}
                    </h3>
                    
                    <p className="text-gray-300 leading-relaxed text-center text-lg">
                      {feature.description}
                    </p>
                    
                    {/* Interactive Hover Elements */}
                    <motion.div
                      className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 to-purple-600"
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.5 }}
                    />
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Immersive Experience Showcase */}
      <section className="py-32 relative z-20 overflow-hidden">
        {/* Dynamic Background */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-slate-800 via-slate-900 to-black"
            animate={{
              background: [
                'linear-gradient(45deg, #1e293b, #0f172a, #000000)',
                'linear-gradient(225deg, #0f172a, #000000, #1e293b)',
                'linear-gradient(45deg, #1e293b, #0f172a, #000000)'
              ]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          
          {/* Floating Geometric Elements */}
          <motion.div 
            className="absolute top-20 left-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          <motion.div 
            className="absolute bottom-20 right-10 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"
            animate={{
              x: [0, -80, 0],
              y: [0, 60, 0],
              scale: [1, 0.8, 1]
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
        
        <div className="container mx-auto px-6 relative z-30">
          <motion.div 
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="grid lg:grid-cols-2 gap-20 items-center max-w-7xl mx-auto"
          >
            <motion.div variants={fadeUp} className="space-y-8">
              <motion.div
                className="inline-flex items-center px-6 py-3 rounded-full bg-white/5 backdrop-blur-xl border border-white/10"
                whileHover={{ scale: 1.05 }}
              >
                <InfinityIcon className="w-5 h-5 mr-3 text-purple-400" />
                <span className="text-white font-semibold">Infinite Possibilities</span>
              </motion.div>
              
              <h2 className="text-5xl md:text-6xl font-black leading-tight text-white">
                <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                  Transform
                </span>
                <br />
                <span className="text-white">
                  Your Literary
                </span>
                <br />
                <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
                  Universe
                </span>
              </h2>
              
              <div className="space-y-6">
                {[
                  {
                    icon: Cpu,
                    title: "Quantum-Enhanced AI Curation",
                    description: "Neural networks that understand your literary soul"
                  },
                  {
                    icon: Globe,
                    title: "Metaverse Reading Communities",
                    description: "Connect in virtual literary worlds beyond imagination"
                  },
                  {
                    icon: Zap,
                    title: "Instant Neural Sync",
                    description: "Seamless cross-reality book synchronization"
                  },
                  {
                    icon: Crown,
                    title: "Elite Author Analytics",
                    description: "Advanced insights that revolutionize publishing"
                  }
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    variants={fadeUp}
                    className="flex items-start space-x-6 group"
                    whileHover={{ x: 10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.div
                      className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-2xl flex items-center justify-center flex-shrink-0"
                      whileHover={{ 
                        scale: 1.2,
                        rotate: 360
                      }}
                      transition={{ duration: 0.5 }}
                      style={{
                        boxShadow: '0 10px 30px rgba(6, 182, 212, 0.4)'
                      }}
                    >
                      <feature.icon className="w-6 h-6 text-white" />
                    </motion.div>
                    
                    <div>
                      <h4 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors duration-300">
                        {feature.title}
                      </h4>
                      <p className="text-gray-300 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <motion.div variants={fadeUp} className="pt-8">
                <motion.div
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    asChild 
                    size="lg" 
                    className="bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:via-blue-500 hover:to-purple-500 text-white px-10 py-5 rounded-2xl text-xl font-bold shadow-2xl transition-all duration-500"
                    style={{
                      boxShadow: '0 20px 40px rgba(6, 182, 212, 0.3)'
                    }}
                  >
                    <Link href="/register" className="flex items-center">
                      Experience the Future
                      <motion.div
                        className="ml-3"
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <ArrowRight className="w-6 h-6" />
                      </motion.div>
                    </Link>
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
            
            <motion.div 
              variants={fadeUp}
              className="relative"
            >
              <motion.div 
                className="relative z-10 bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10"
                whileHover={{ 
                  rotateY: 5,
                  scale: 1.02
                }}
                transition={{ duration: 0.5 }}
                style={{
                  transformStyle: 'preserve-3d'
                }}
              >
                <motion.div
                  animate={{
                    rotateY: [0, 5, 0, -5, 0]
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  {/* Placeholder for ShelfWise Platform Showcase */}
                  <div className="w-full h-80 bg-gradient-to-br from-cyan-500/20 via-blue-600/20 to-purple-600/20 rounded-2xl shadow-2xl border border-white/10 backdrop-blur-xl flex items-center justify-center">
                    <div className="text-center">
                      <BookOpen className="w-20 h-20 text-cyan-400 mx-auto mb-4" />
                      <h3 className="text-2xl font-bold text-white mb-2">ShelfWise Platform</h3>
                      <p className="text-gray-300">Revolutionary Book Marketplace</p>
                    </div>
                  </div>
                </motion.div>
                
                {/* Holographic Overlay */}
                <motion.div
                  className="absolute inset-0 rounded-3xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20"
                  animate={{
                    opacity: [0.2, 0.6, 0.2]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </motion.div>
              
              {/* Floating UI Elements */}
              <motion.div
                className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center"
                animate={{
                  y: [0, -20, 0],
                  rotateZ: [0, 360]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                style={{
                  boxShadow: '0 20px 40px rgba(6, 182, 212, 0.4)'
                }}
              >
                <Star className="w-10 h-10 text-white" />
              </motion.div>
              
              <motion.div
                className="absolute -bottom-6 -left-6 w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-600 rounded-full flex items-center justify-center"
                animate={{
                  y: [0, 15, 0],
                  rotateZ: [0, -360]
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                style={{
                  boxShadow: '0 20px 40px rgba(147, 51, 234, 0.4)'
                }}
              >
                <Heart className="w-8 h-8 text-white" />
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Revolutionary Testimonials */}
      <section className="py-32 relative z-20">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-800/30 to-transparent" />
        
        <div className="container mx-auto px-6 relative z-30">
          <motion.div 
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-20"
          >
            <motion.div
              variants={fadeUp}
              className="inline-flex items-center px-6 py-3 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 mb-8"
            >
              <Award className="w-5 h-5 mr-3 text-amber-400" />
              <span className="text-white font-semibold">Trusted by Legends</span>
            </motion.div>
            
            <motion.h2 
              variants={fadeUp}
              className="text-6xl md:text-7xl font-black mb-8 text-white"
              style={{
                textShadow: '0 0 40px rgba(255, 255, 255, 0.3)'
              }}
            >
              <span className="bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
                Elite
              </span>
              {" "}
              <span className="text-white">
                Testimonials
              </span>
            </motion.h2>
            
            <motion.p 
              variants={fadeUp}
              className="text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
            >
              Stories from visionaries who've embraced the future of reading
            </motion.p>
          </motion.div>
          
          <motion.div 
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeUp}
            className="max-w-6xl mx-auto"
          >
            <motion.div
              key={currentTestimonial}
              initial={{ opacity: 0, scale: 0.8, rotateY: -20 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              exit={{ opacity: 0, scale: 0.8, rotateY: 20 }}
              transition={{ duration: 0.8, ease: "backOut" }}
              className="relative"
            >
              <Card className="bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-700 p-16 text-center relative overflow-hidden group">
                {/* Dynamic Background Pattern */}
                <motion.div
                  className="absolute inset-0 opacity-20"
                  style={{
                    background: `
                      radial-gradient(circle at 30% 30%, rgba(59, 130, 246, 0.3) 0%, transparent 50%),
                      radial-gradient(circle at 70% 70%, rgba(147, 51, 234, 0.3) 0%, transparent 50%)
                    `
                  }}
                  animate={{
                    rotate: [0, 360],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
                
                {/* Holographic Scan Line */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent"
                  style={{
                    transform: 'translateX(-100%) skewX(-15deg)',
                    width: '200%'
                  }}
                  animate={{
                    transform: ['translateX(-100%) skewX(-15deg)', 'translateX(100%) skewX(-15deg)']
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear",
                    repeatDelay: 2
                  }}
                />
                
                <div className="relative z-10">
                  {/* Rating Stars with Animation */}
                  <div className="flex justify-center mb-8">
                    {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0, rotate: -180 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{ 
                          duration: 0.5, 
                          delay: i * 0.1,
                          type: "spring",
                          stiffness: 500
                        }}
                      >
                        <Star className="w-8 h-8 text-amber-400 fill-current mx-1" />
                      </motion.div>
                    ))}
                  </div>
                  
                  {/* Testimonial Text */}
                  <motion.blockquote 
                    className="text-3xl md:text-4xl text-white mb-12 font-light leading-relaxed"
                    style={{
                      textShadow: '0 0 20px rgba(255, 255, 255, 0.2)'
                    }}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                  >
                    "{testimonials[currentTestimonial].text}"
                  </motion.blockquote>
                  
                  {/* Author Info */}
                  <motion.div
                    className="flex items-center justify-center space-x-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                  >
                    <motion.div
                      className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-full flex items-center justify-center text-3xl"
                      whileHover={{ 
                        scale: 1.2,
                        rotate: 360
                      }}
                      transition={{ duration: 0.5 }}
                      style={{
                        boxShadow: '0 20px 40px rgba(6, 182, 212, 0.4)'
                      }}
                    >
                      {testimonials[currentTestimonial].avatar}
                    </motion.div>
                    
                    <div className="text-left">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="text-2xl font-bold text-white">
                          {testimonials[currentTestimonial].name}
                        </h4>
                        <motion.div
                          className="px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full text-xs font-bold text-white"
                          animate={{
                            boxShadow: [
                              '0 0 20px rgba(245, 158, 11, 0.3)',
                              '0 0 40px rgba(245, 158, 11, 0.6)',
                              '0 0 20px rgba(245, 158, 11, 0.3)'
                            ]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        >
                          {testimonials[currentTestimonial].badge}
                        </motion.div>
                      </div>
                      
                      <p className="text-gray-300 text-lg">
                        {testimonials[currentTestimonial].role}
                      </p>
                    </div>
                  </motion.div>
                </div>
              </Card>
            </motion.div>
            
            {/* Navigation Dots */}
            <div className="flex justify-center mt-12 space-x-4">
              {testimonials.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`relative w-4 h-4 rounded-full transition-all duration-300 ${
                    index === currentTestimonial
                      ? 'bg-cyan-400 scale-125'
                      : 'bg-white/30 hover:bg-white/50'
                  }`}
                  whileHover={{ scale: 1.3 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {index === currentTestimonial && (
                    <motion.div
                      className="absolute inset-0 bg-cyan-400 rounded-full"
                      animate={{
                        boxShadow: [
                          '0 0 20px rgba(6, 182, 212, 0.5)',
                          '0 0 40px rgba(6, 182, 212, 0.8)',
                          '0 0 20px rgba(6, 182, 212, 0.5)'
                        ]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Revolutionary CTA Section */}
      <section className="py-32 relative z-20 overflow-hidden">
        {/* Epic Background System */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute inset-0"
            style={{
              background: `
                linear-gradient(135deg, 
                  #0f172a 0%, 
                  #1e293b 25%, 
                  #0f172a 50%, 
                  #1e1b4b 75%, 
                  #0f172a 100%
                )
              `
            }}
            animate={{
              background: [
                'linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #0f172a 50%, #1e1b4b 75%, #0f172a 100%)',
                'linear-gradient(225deg, #1e1b4b 0%, #0f172a 25%, #1e293b 50%, #0f172a 75%, #1e1b4b 100%)',
                'linear-gradient(315deg, #1e293b 0%, #1e1b4b 25%, #0f172a 50%, #1e293b 75%, #0f172a 100%)',
                'linear-gradient(45deg, #0f172a 0%, #1e1b4b 25%, #1e293b 50%, #0f172a 75%, #1e293b 100%)'
              ]
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          
          {/* Epic Floating Elements */}
          <motion.div 
            className="absolute top-0 left-0 w-full h-full"
            style={{
              background: `
                radial-gradient(circle at 20% 20%, rgba(6, 182, 212, 0.3) 0%, transparent 50%),
                radial-gradient(circle at 80% 80%, rgba(147, 51, 234, 0.3) 0%, transparent 50%),
                radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.2) 0%, transparent 50%)
              `
            }}
            animate={{
              rotate: [0, 360],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          
          {/* Particle System */}
          {isMounted && particlePositions.map((particle, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-cyan-400 rounded-full opacity-30"
              style={{
                left: `${particle.left}%`,
                top: `${particle.top}%`,
              }}
              animate={{
                y: [-20, 20, -20],
                x: [-10, 10, -10],
                opacity: [0.3, 0.8, 0.3],
                scale: [1, 1.5, 1]
              }}
              transition={{
                duration: 3 + (i % 3) * 0.5, // Varied duration based on index
                repeat: Infinity,
                ease: "easeInOut",
                delay: (i % 5) * 0.4 // Varied delay based on index
              }}
            />
          ))}
        </div>
        
        <div className="container mx-auto px-6 text-center relative z-30">
          <motion.div 
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="max-w-6xl mx-auto"
          >
            {/* Final Call Badge */}
            <motion.div variants={fadeUp} className="mb-12">
              <motion.div 
                className="inline-flex items-center px-8 py-4 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-500"
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <motion.div
                  className="w-4 h-4 bg-gradient-to-r from-cyan-400 to-purple-600 rounded-full mr-4"
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.7, 1, 0.7]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <Crown className="w-6 h-6 mr-3 text-amber-400" />
                <span className="text-white font-bold text-xl tracking-wide">
                  Join the Literary Revolution
                </span>
                <motion.div
                  className="ml-4 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full text-sm font-bold text-white"
                  animate={{
                    boxShadow: [
                      '0 0 20px rgba(245, 158, 11, 0.4)',
                      '0 0 40px rgba(245, 158, 11, 0.7)',
                      '0 0 20px rgba(245, 158, 11, 0.4)'
                    ]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  LIMITED ACCESS
                </motion.div>
              </motion.div>
            </motion.div>
            
            {/* Epic Title */}
            <motion.h2 
              variants={fadeUp}
              className="text-6xl md:text-8xl lg:text-9xl font-black mb-12 leading-[0.85] tracking-tight"
            >
              <motion.span 
                className="block"
                style={{
                  background: 'linear-gradient(135deg, #ffffff 0%, #06b6d4 25%, #8b5cf6 50%, #f59e0b 75%, #ffffff 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                  backgroundSize: '400% 400%',
                  textShadow: '0 0 40px rgba(255, 255, 255, 0.3)'
                }}
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: 'linear'
                }}
              >
                READY TO
              </motion.span>
              
              <motion.span 
                className="block bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent"
                animate={{
                  scale: [1, 1.02, 1],
                  textShadow: [
                    '0 0 20px rgba(6, 182, 212, 0.5)',
                    '0 0 40px rgba(6, 182, 212, 0.8)',
                    '0 0 20px rgba(6, 182, 212, 0.5)'
                  ]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                TRANSCEND?
              </motion.span>
            </motion.h2>
            
            <motion.p 
              variants={fadeUp}
              className="text-2xl md:text-3xl text-gray-300 mb-16 max-w-4xl mx-auto leading-relaxed font-light"
              style={{
                textShadow: '0 0 30px rgba(255, 255, 255, 0.1)'
              }}
            >
              Step into the future of literature where
              <motion.span 
                className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600 font-semibold"
                animate={{
                  textShadow: [
                    '0 0 20px rgba(6, 182, 212, 0.5)',
                    '0 0 40px rgba(6, 182, 212, 0.8)',
                    '0 0 20px rgba(6, 182, 212, 0.5)'
                  ]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                {" "}quantum AI meets infinite imagination
              </motion.span>
              {" "}and every story becomes your reality.
            </motion.p>
            
            {/* Epic Action Buttons */}
            <motion.div 
              variants={fadeUp}
              className="flex flex-col lg:flex-row gap-8 justify-center items-center"
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -10 }}
                whileTap={{ scale: 0.95 }}
                className="group relative"
              >
                <motion.div
                  className="absolute -inset-2 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 rounded-3xl blur-lg opacity-70 group-hover:opacity-100 transition-opacity duration-500"
                  animate={{
                    scale: [1, 1.05, 1],
                    rotate: [0, 1, 0]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                
                <Button 
                  asChild 
                  size="lg" 
                  className="relative bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:via-blue-500 hover:to-purple-500 text-white px-16 py-8 rounded-3xl text-2xl font-bold shadow-2xl transition-all duration-500 border-0"
                  style={{
                    boxShadow: '0 25px 50px rgba(6, 182, 212, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
                  }}
                >
                  <Link href="/register?as=reader" className="flex items-center relative z-10">
                    <Globe className="mr-4 w-8 h-8" />
                    Enter the Matrix
                    <motion.div
                      className="ml-4"
                      animate={{ x: [0, 10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <ArrowRight className="w-8 h-8" />
                    </motion.div>
                  </Link>
                </Button>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05, y: -10 }}
                whileTap={{ scale: 0.95 }}
                className="group relative"
              >
                <motion.div
                  className="absolute -inset-2 bg-gradient-to-r from-amber-500 via-orange-600 to-red-600 rounded-3xl blur-lg opacity-70 group-hover:opacity-100 transition-opacity duration-500"
                  animate={{
                    scale: [1, 1.05, 1],
                    rotate: [0, -1, 0]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5
                  }}
                />
                
                <Button 
                  asChild 
                  size="lg" 
                  className="relative bg-gradient-to-r from-amber-500 via-orange-600 to-red-600 hover:from-amber-400 hover:via-orange-500 hover:to-red-500 text-white px-16 py-8 rounded-3xl text-2xl font-bold shadow-2xl transition-all duration-500 border-0"
                  style={{
                    boxShadow: '0 25px 50px rgba(245, 158, 11, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
                  }}
                >
                  <Link href="/register?as=author" className="flex items-center relative z-10">
                    <Crown className="mr-4 w-8 h-8" />
                    Create Legacy
                    <InfinityIcon className="ml-4 w-8 h-8" />
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
            
            {/* Final Stats */}
            <motion.div 
              variants={fadeUp}
              className="mt-20 pt-16 border-t border-white/10"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                {[
                  { icon: Circle, label: "∞ Possibilities", desc: "Unlimited" },
                  { icon: Triangle, label: "AI Precision", desc: "99.9%" },
                  { icon: Hexagon, label: "Global Reach", desc: "195 Countries" },
                  { icon: Layers, label: "Neural Speed", desc: "< 1ms" }
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    className="text-center group"
                    whileHover={{ scale: 1.1, y: -5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.div
                      className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4"
                      animate={{
                        rotateZ: [0, 360]
                      }}
                      transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: "linear",
                        delay: index * 0.5
                      }}
                      style={{
                        boxShadow: '0 15px 30px rgba(6, 182, 212, 0.4)'
                      }}
                    >
                      <stat.icon className="w-8 h-8 text-white" />
                    </motion.div>
                    
                    <div className="text-2xl font-black text-white mb-1">
                      {stat.desc}
                    </div>
                    
                    <div className="text-sm text-gray-400 uppercase tracking-wider">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
