import type { TextBlock as TextBlockType } from '../../types'
import { BlockContainer } from '../BlockContainer'

export function TextBlock({
  block,
  dndId,
  selected,
  onSelect,
}: {
  block: TextBlockType
  dndId: string
  selected: boolean
  onSelect: () => void
}) {
  return (
    <BlockContainer dndId={dndId} selected={selected} onSelect={onSelect} className="p-6">
      <h2 className="text-2xl font-bold">{block.title}</h2>
      <p className="mt-2 whitespace-pre-wrap">{block.body}</p>
    </BlockContainer>
  )
}
