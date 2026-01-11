import type { HeroBlock } from '../../types'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

export function HeroEditor({
  block,
  onChange,
}: {
  block: HeroBlock
  onChange: (b: HeroBlock) => void
}) {
  return (
    <div className="space-y-3 p-4">
      <Label>Title</Label>
      <Input value={block.title} onChange={(e) => onChange({ ...block, title: e.target.value })} />

      <Label>Subtitle</Label>
      <Textarea
        value={block.subtitle}
        onChange={(e) => onChange({ ...block, subtitle: e.target.value })}
      />

      <Label>Button text</Label>
      <Input
        value={block.buttonText}
        onChange={(e) => onChange({ ...block, buttonText: e.target.value })}
      />

      <Label>Button url</Label>
      <Input
        value={block.buttonUrl}
        onChange={(e) => onChange({ ...block, buttonUrl: e.target.value })}
      />

      <Label>Background</Label>
      <Input
        value={block.backgroundColor}
        onChange={(e) => onChange({ ...block, backgroundColor: e.target.value })}
      />
    </div>
  )
}
