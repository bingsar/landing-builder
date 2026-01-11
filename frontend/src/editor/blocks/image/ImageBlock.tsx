import type { ImageBlock as ImageBlockType } from '../../types'
import { BlockContainer } from '../BlockContainer'

export function ImageBlock({
  block,
  dndId,
  selected,
  onSelect,
}: {
  block: ImageBlockType
  dndId: string
  selected: boolean
  onSelect: () => void
}) {
  return (
    <BlockContainer dndId={dndId} selected={selected} onSelect={onSelect} className="">
      <img src={block.imageUrl} className="w-full" />
      <p className="mt-2 opacity-70">{block.caption}</p>
    </BlockContainer>
  )
}
