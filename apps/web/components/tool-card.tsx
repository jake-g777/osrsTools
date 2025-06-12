import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface ToolCardProps {
  name: string
  description: string
  icon: string
  slug: string
  tags: string[]
}

export function ToolCard({ name, description, icon, slug, tags }: ToolCardProps) {
  return (
    <Link href={`/tools/${slug}`}>
      <Card className="rs-card h-full transition-colors hover:bg-rs-stone/50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{icon}</span>
            <CardTitle className="text-rs-gold">{name}</CardTitle>
          </div>
          <CardDescription className="text-rs-gold/80">{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="font-rs rounded-full bg-rs-stone px-2 py-1 text-xs text-rs-gold"
              >
                {tag}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
} 