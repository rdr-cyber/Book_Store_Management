
"use client";

import { useState, useEffect } from 'react';
import Link from "next/link";
import { BookOpenCheck } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"


const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
);

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const ClashOfClansIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg 
    {...props}
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="#D4AF37"
    strokeWidth="1"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 2L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-3z" fill="#4a4a4a"/>
    <path d="M12 2L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-3z" stroke="#C0C0C0" strokeWidth="0.5" fill="none"/>
    <path d="M12 12l3-1.5-3-1.5-3 1.5 3 1.5z" fill="#D4AF37" />
    <path d="M12 12v4l3 1.5v-4l-3-1.5z" fill="#B8860B" />
    <path d="M12 12v4l-3 1.5v-4l3-1.5z" fill="#DAA520" />
 </svg>
);


export default function Footer() {
  const [year, setYear] = useState(new Date().getFullYear());
  
  useEffect(() => {
      setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="bg-secondary border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-between md:flex-row">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <BookOpenCheck className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold font-headline">ShelfWise</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {year} ShelfWise. All rights reserved.
          </p>
          <TooltipProvider>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Link
                            href="https://link.clashofclans.com/en?action=OpenPlayerProfile&tag=G0LPLP8J0"
                            className="text-muted-foreground hover:text-foreground transition-transform duration-300 hover:scale-110"
                        >
                            <ClashOfClansIcon className="h-5 w-5" />
                            <span className="sr-only">Clash of Clans</span>
                        </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>My Clash Of Clans Account....</p>
                    </TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                         <Link
                            href="https://www.instagram.com/debadyutidey7?igsh=eGdlYm93c3ZxYjUy"
                            className="text-muted-foreground hover:text-foreground transition-transform duration-300 hover:scale-110"
                            >
                            <InstagramIcon className="h-5 w-5" />
                            <span className="sr-only">Instagram</span>
                        </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>My Instagram Account....</p>
                    </TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Link
                            href="https://github.com/debadyutidey007/Book_Store_Management"
                            className="text-muted-foreground hover:text-foreground transition-transform duration-300 hover:scale-110"
                        >
                            <GithubIcon className="h-5 w-5" />
                            <span className="sr-only">GitHub</span>
                        </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>My GitHub Account....</p>
                    </TooltipContent>
                </Tooltip>
            </div>
          </TooltipProvider>
        </div>
      </div>
    </footer>
  );
}