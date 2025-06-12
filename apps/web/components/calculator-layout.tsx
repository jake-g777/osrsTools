"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { tools } from "@/config/tools"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface CalculatorLayoutProps {
  children: React.ReactNode
  title: string
}

export function CalculatorLayout({ children, title }: CalculatorLayoutProps) {
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(true)
  const [comment, setComment] = React.useState("")
  const [comments, setComments] = React.useState<Array<{ text: string; author: string; date: string }>>([])
  const pathname = usePathname()

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (comment.trim()) {
      setComments([
        ...comments,
        {
          text: comment,
          author: "Anonymous",
          date: new Date().toLocaleDateString(),
        },
      ])
      setComment("")
    }
  }

  return (
    <div className="flex h-[calc(100vh-64px)] bg-parchment">
      {/* Left Drawer */}
      <div className={`bg-parchment/95 border-r-2 border-rs-brown/30 transition-all duration-300 ${isDrawerOpen ? 'w-64' : 'w-0'}`}>
        <div className="h-full flex flex-col">
          <div className="p-4 border-b-2 border-rs-brown/30">
            <h2 className={`font-rs text-rs-gold/90 ${isDrawerOpen ? 'block' : 'hidden'}`}>Calculators</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            <nav className="p-2">
              {tools.map((tool) => (
                <Link
                  key={tool.slug}
                  href={`/tools/${tool.slug}`}
                  className={`flex items-center gap-2 p-2 rounded-md hover:bg-rs-brown/15 hover:text-rs-gold/90 transition-colors ${
                    pathname === `/tools/${tool.slug}` ? 'bg-rs-brown/25 text-rs-gold/90' : 'text-white/80'
                  }`}
                >
                  <span className="text-lg">{tool.icon}</span>
                  <span className="font-medium">{tool.name}</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Drawer Toggle Button */}
      <button
        onClick={() => setIsDrawerOpen(!isDrawerOpen)}
        className="bg-rs-gold/90 hover:bg-rs-gold text-white p-1 rounded-r-md self-center -ml-3 z-10 transition-colors"
      >
        {isDrawerOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
      </button>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            {children}
          </div>

          {/* Comments Section */}
          <Card className="shadow-lg bg-parchment/95 border-2 border-rs-brown/30">
            <CardHeader className="border-b-2 border-rs-brown/30">
              <CardTitle className="text-2xl font-rs text-rs-gold/90">Comments</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmitComment} className="space-y-4">
                <Textarea
                  placeholder="Share your thoughts..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="min-h-[120px] text-base bg-white/60 border-2 border-rs-brown/30 focus:border-rs-gold/60 text-white/90"
                />
                <div className="flex justify-end">
                  <Button type="submit" size="lg" className="rs-button">Post Comment</Button>
                </div>
              </form>

              <div className="mt-8 space-y-6">
                {comments.map((comment, index) => (
                  <div key={index} className="border-b-2 border-rs-brown/30 pb-6 last:border-0">
                    <div className="flex justify-between text-sm text-white/80 mb-3">
                      <span className="font-medium text-rs-gold/90">{comment.author}</span>
                      <span>{comment.date}</span>
                    </div>
                    <p className="text-base leading-relaxed text-white/90">{comment.text}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-80 border-l-2 border-rs-brown/30 bg-parchment/95 p-6 overflow-y-auto">
        <Card className="shadow-lg bg-parchment/95 border-2 border-rs-brown/30">
          <CardHeader className="border-b-2 border-rs-brown/30">
            <CardTitle className="text-2xl font-rs text-rs-gold/90">Related Information</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div className="border-b-2 border-rs-brown/30 pb-6">
                <h3 className="font-rs text-lg mb-3 text-rs-gold/90">OSRS Wiki Guides</h3>
                <ul className="space-y-3 text-base">
                  <li>
                    <a href="https://oldschool.runescape.wiki/w/Skilling" className="text-white/80 hover:text-rs-gold/90 transition-colors">
                      Skilling Guide
                    </a>
                  </li>
                  <li>
                    <a href="https://oldschool.runescape.wiki/w/Experience" className="text-white/80 hover:text-rs-gold/90 transition-colors">
                      Experience Guide
                    </a>
                  </li>
                </ul>
              </div>
              <div className="border-b-2 border-rs-brown/30 pb-6">
                <h3 className="font-rs text-lg mb-3 text-rs-gold/90">Community Resources</h3>
                <ul className="space-y-3 text-base">
                  <li>
                    <a href="https://www.reddit.com/r/2007scape/" className="text-white/80 hover:text-rs-gold/90 transition-colors">
                      r/2007scape
                    </a>
                  </li>
                  <li>
                    <a href="https://discord.gg/2007scape" className="text-white/80 hover:text-rs-gold/90 transition-colors">
                      OSRS Discord
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-rs text-lg mb-3 text-rs-gold/90">Training Methods</h3>
                <ul className="space-y-3 text-base">
                  <li>
                    <a href="https://oldschool.runescape.wiki/w/Efficient_Skilling_Guide" className="text-white/80 hover:text-rs-gold/90 transition-colors">
                      Efficient Skilling Guide
                    </a>
                  </li>
                  <li>
                    <a href="https://oldschool.runescape.wiki/w/Money_making_guide" className="text-white/80 hover:text-rs-gold/90 transition-colors">
                      Money Making Guide
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 