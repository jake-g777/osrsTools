"use client"

import Link from "next/link"
import { ModeToggle } from "./mode-toggle"
import { Button } from "./ui/button"

export function Navbar() {
  return (
    <header className="rs-navbar sticky top-0 z-50 w-full backdrop-blur supports-[backdrop-filter]:bg-rs-brown/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-rs text-rs-gold text-xl">ToolScape</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
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