import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import type { Block, BlockType } from './types'
import { createBlock } from './blocks/createBlock'
import { Image, Sparkles, Type } from 'lucide-react'

const blockTypes: BlockType[] = ['hero', 'text', 'image']
const blockLabels: Record<BlockType, string> = {
  hero: 'Hero',
  text: 'Text',
  image: 'Image',
}
const blockIcons: Record<BlockType, typeof Sparkles> = {
  hero: Sparkles,
  text: Type,
  image: Image,
}

export function AddBlockDialog({ onAdd }: { onAdd: (b: Block) => void }) {
  function add(type: BlockType) {
    onAdd(createBlock(type))
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm">+ Add block</Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-4">
        <DialogTitle className="absolute top-4 left-4">Add block</DialogTitle>
        <div className="flex justify-center items-center gap-4 w-auto flex-wrap">
          {blockTypes.map((type) => {
            const Icon = blockIcons[type]
            return (
              <Button
                key={type}
                variant="outline"
                onClick={() => add(type)}
                className="h-24 w-24 flex-col gap-2"
              >
                <Icon className="h-6 w-6" />
                <span className="text-xs font-medium">{blockLabels[type]}</span>
              </Button>
            )
          })}
        </div>
      </DialogContent>
    </Dialog>
  )
}
