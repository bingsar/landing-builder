import type { ImageBlock } from '../../types'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function ImageEditor({
  block,
  onChange,
}: {
  block: ImageBlock
  onChange: (b: ImageBlock) => void
}) {
  return (
    <div className="space-y-3 p-4">
      <Label>Image url</Label>
      <Input
        value={block.imageUrl}
        onChange={(e) => onChange({ ...block, imageUrl: e.target.value })}
      />

      <Label>Caption</Label>
      <Input
        value={block.caption}
        onChange={(e) => onChange({ ...block, caption: e.target.value })}
      />
    </div>
  )
}
