"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { tools } from "@/config/tools"
import { ModeToggle } from "./mode-toggle"
import { Button } from "./ui/button"
import { ChevronRight } from "lucide-react"

export function Navbar() {
  const pathname = usePathname()
  const currentTool = tools.find(tool => pathname === `/tools/${tool.slug}`)

  return (
    <header className="rs-navbar sticky top-0 z-50 w-full backdrop-blur supports-[backdrop-filter]:bg-rs-brown/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-rs text-xl">
              {currentTool ? (
                <span className="flex items-center gap-4">
                  <span className="text-rs-gold hover:text-rs-gold/80 transition-colors">ToolScape</span>
                  <ChevronRight className="w-5 h-5 text-rs-gold" />
                  <span className="text-white text-base font-medium [text-shadow:_-1px_-1px_0_#000,_1px_-1px_0_#000,_-1px_1px_0_#000,_1px_1px_0_#000]">{currentTool.name}</span>
                </span>
              ) : (
                <span className="text-rs-gold">ToolScape</span>
              )}
            </span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <nav className="flex items-center space-x-2">
            <Link href="/dev">
              <Button variant="ghost" className="rs-button">Dev Portal</Button>
            </Link>
            <Button variant="default" className="rs-button">Login</Button>
            <ModeToggle />
          </nav>
        </div>
      </div>
    </header>
  )
} 