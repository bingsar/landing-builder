import type { Block } from "@/editor/types"
import { Button } from "@/components/ui/button"

export function PublicBlockRenderer({ block }: { block: Block }) {
  if (block.type === "hero") {
    return (
      <section className="p-8" style={{ background: block.backgroundColor }}>
        <h1 className="text-4xl font-bold">{block.title}</h1>
        <p className="mt-3">{block.subtitle}</p>
        <a href={block.buttonUrl} className="inline-block mt-4">
          <Button variant="secondary">{block.buttonText}</Button>
        </a>
      </section>
    )
  }

  if (block.type === "text") {
    return (
      <section className="p-6">
        <h2 className="text-2xl font-bold">{block.title}</h2>
        <p className="mt-2 whitespace-pre-wrap">{block.body}</p>
      </section>
    )
  }

  return (
    <section>
      <img src={block.imageUrl} className="w-full" />
      <p className="mt-2 opacity-70">{block.caption}</p>
    </section>
  )
}
