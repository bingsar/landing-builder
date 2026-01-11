import type { HeroBlock as HeroBlockType } from '../../types'
import { Button } from '@/components/ui/button'
import { BlockContainer } from '../BlockContainer'

export function HeroBlock({
  block,
  dndId,
  selected,
  onSelect,
}: {
  block: HeroBlockType
  dndId: string
  selected: boolean
  onSelect: () => void
}) {
  return (
    <BlockContainer
      dndId={dndId}
      selected={selected}
      onSelect={onSelect}
      className="p-8"
      style={{ background: block.backgroundColor }}
    >
      <h1 className="text-4xl font-bold">{block.title}</h1>
      <p className="mt-3">{block.subtitle}</p>
      <a href={block.buttonUrl} className="inline-block mt-4">
        <Button variant="secondary">{block.buttonText}</Button>
      </a>
    </BlockContainer>
  )
}
