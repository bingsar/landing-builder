import type { Block } from './types'
import { HeroBlock } from './blocks/hero/HeroBlock'
import { TextBlock } from './blocks/text/TextBlock'
import { ImageBlock } from './blocks/image/ImageBlock'

export function BlockRenderer({
  block,
  dndId,
  selected,
  onSelect,
}: {
  block: Block
  dndId: string
  selected: boolean
  onSelect: () => void
}) {
  if (block.type === 'hero') {
    return <HeroBlock block={block} dndId={dndId} selected={selected} onSelect={onSelect} />
  }

  if (block.type === 'text') {
    return <TextBlock block={block} dndId={dndId} selected={selected} onSelect={onSelect} />
  }

  return <ImageBlock block={block} dndId={dndId} selected={selected} onSelect={onSelect} />
}
