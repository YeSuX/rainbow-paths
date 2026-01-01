"use client";

import Link from "next/link";
import { Github, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

/**
 * Footer component
 * Design: Simple, clean footer with copyright and links
 */
export function Footer() {
  return (
    <footer className="w-full border-t border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 sm:py-12">
          <div className="flex flex-col items-center justify-center">
            <p className="text-xs text-[#787774] flex items-center gap-1">
              © 2026 Cooper Studio. All rights reserved.
            </p>
            <p className="text-xs text-[#787774] flex items-center gap-1">
              Made with <Heart className="w-3 h-3 text-red-400 fill-red-400" />{" "}
              for equality and love
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
