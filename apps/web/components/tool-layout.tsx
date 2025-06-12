"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

interface ToolLayoutProps {
  children: React.ReactNode
  title: string
}

export function ToolLayout({ children, title }: ToolLayoutProps) {
  const [comment, setComment] = React.useState("")
  const [comments, setComments] = React.useState<Array<{ text: string; author: string; date: string }>>([])

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (comment.trim()) {
      setComments([
        ...comments,
        {
          text: comment,
          author: "Anonymous", // This would be replaced with actual user info
          date: new Date().toLocaleDateString(),
        },
      ])
      setComment("")
    }
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-[1400px]">
      <h1 className="text-4xl font-bold mb-12 text-center">{title}</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <div className="flex-1 max-w-3xl mx-auto lg:mx-0">
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              {children}
            </div>
            
            {/* Comments Section */}
            <Card className="shadow-lg">
              <CardHeader className="border-b">
                <CardTitle className="text-2xl">Comments</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handleSubmitComment} className="space-y-4">
                  <Textarea
                    placeholder="Share your thoughts..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="min-h-[120px] text-base"
                  />
                  <div className="flex justify-end">
                    <Button type="submit" size="lg">Post Comment</Button>
                  </div>
                </form>

                <div className="mt-8 space-y-6">
                  {comments.map((comment, index) => (
                    <div key={index} className="border-b pb-6 last:border-0">
                      <div className="flex justify-between text-sm text-muted-foreground mb-3">
                        <span className="font-medium">{comment.author}</span>
                        <span>{comment.date}</span>
                      </div>
                      <p className="text-base leading-relaxed">{comment.text}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Related Information */}
        <div className="lg:w-[300px] shrink-0">
          <Card className="shadow-lg sticky top-8">
            <CardHeader className="border-b">
              <CardTitle className="text-2xl">Related Information</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div className="border-b pb-6">
                  <h3 className="font-semibold text-lg mb-3">OSRS Wiki Guides</h3>
                  <ul className="space-y-3 text-base">
                    <li>
                      <a href="https://oldschool.runescape.wiki/w/Skilling" className="text-blue-600 hover:underline hover:text-blue-800 transition-colors">
                        Skilling Guide
                      </a>
                    </li>
                    <li>
                      <a href="https://oldschool.runescape.wiki/w/Experience" className="text-blue-600 hover:underline hover:text-blue-800 transition-colors">
                        Experience Guide
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="border-b pb-6">
                  <h3 className="font-semibold text-lg mb-3">Community Resources</h3>
                  <ul className="space-y-3 text-base">
                    <li>
                      <a href="https://www.reddit.com/r/2007scape/" className="text-blue-600 hover:underline hover:text-blue-800 transition-colors">
                        r/2007scape
                      </a>
                    </li>
                    <li>
                      <a href="https://discord.gg/2007scape" className="text-blue-600 hover:underline hover:text-blue-800 transition-colors">
                        OSRS Discord
                      </a>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-3">Training Methods</h3>
                  <ul className="space-y-3 text-base">
                    <li>
                      <a href="https://oldschool.runescape.wiki/w/Efficient_Skilling_Guide" className="text-blue-600 hover:underline hover:text-blue-800 transition-colors">
                        Efficient Skilling Guide
                      </a>
                    </li>
                    <li>
                      <a href="https://oldschool.runescape.wiki/w/Money_making_guide" className="text-blue-600 hover:underline hover:text-blue-800 transition-colors">
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
    </div>
  )
} 