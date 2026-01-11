import type { Block } from './types'
import { HeroEditor } from './blocks/hero/HeroEditor'
import { TextEditor } from './blocks/text/TextEditor'
import { ImageEditor } from './blocks/image/ImageEditor'

export function BlockEditor({
  block,
  onChange,
}: {
  block: Block | null
  onChange: (b: Block) => void
}) {
  if (!block) return <div className="p-4 text-muted-foreground">Select a block</div>

  if (block.type === 'hero') {
    return <HeroEditor block={block} onChange={onChange} />
  }

  if (block.type === 'text') {
    return <TextEditor block={block} onChange={onChange} />
  }

  return <ImageEditor block={block} onChange={onChange} />
}
