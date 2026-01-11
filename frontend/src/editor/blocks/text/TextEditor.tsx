import type { TextBlock } from '../../types'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

export function TextEditor({
  block,
  onChange,
}: {
  block: TextBlock
  onChange: (b: TextBlock) => void
}) {
  return (
    <div className="space-y-3 p-4">
      <Label>Title</Label>
      <Input value={block.title} onChange={(e) => onChange({ ...block, title: e.target.value })} />

      <Label>Body</Label>
      <Textarea value={block.body} onChange={(e) => onChange({ ...block, body: e.target.value })} />
    </div>
  )
}
