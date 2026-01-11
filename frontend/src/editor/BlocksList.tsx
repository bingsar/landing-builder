import type { Block } from './types'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useState } from 'react'

function Item({
  block,
  selected,
  index,
  total,
  onSelect,
  onMove,
  onDelete,
}: {
  block: Block
  selected: boolean
  index: number
  total: number
  onSelect: () => void
  onMove: (dir: 'up' | 'down') => void
  onDelete: () => void
}) {
  const { setNodeRef, attributes, listeners, transform, transition } = useSortable({ id: block.id })

  const adjustedTransform = transform ? { ...transform, scaleX: 1, scaleY: 1 } : null
  const style = { transform: CSS.Transform.toString(adjustedTransform), transition }

  return (
    <div ref={setNodeRef} style={style}>
      <Card
        onClick={onSelect}
        {...attributes}
        {...listeners}
        className={`py-2 px-4 mb-2 cursor-pointer flex justify-between items-center capitalize ${selected ? 'ring-2 ring-primary' : ''}`}
      >
        <div className="font-medium">{block.type}</div>
        <div className="flex gap-1">
          <Button
            size="sm"
            variant="outline"
            disabled={index === 0}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation()
              onMove('up')
            }}
          >
            ↑
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={index === total - 1}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation()
              onMove('down')
            }}
          >
            ↓
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
          >
            ✕
          </Button>
        </div>
      </Card>
    </div>
  )
}

export function BlocksList({
  blocks,
  selectedId,
  onSelect,
  onChange,
}: {
  blocks: Block[]
  selectedId: string | null
  onSelect: (id: string) => void
  onChange: (blocks: Block[]) => void
}) {
  const [deleteTarget, setDeleteTarget] = useState<Block | null>(null)

  function move(id: string, dir: 'up' | 'down') {
    const i = blocks.findIndex((b) => b.id === id)
    const j = dir === 'up' ? i - 1 : i + 1
    if (j < 0 || j >= blocks.length) return

    const copy = [...blocks]
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
    onChange(copy)
  }

  return (
    <>
      <SortableContext
        items={blocks.map((b) => `list-${b.id}`)}
        strategy={verticalListSortingStrategy}
      >
        {blocks.map((b, i) => (
          <Item
            key={b.id}
            block={{ ...b, id: `list-${b.id}` }}
            index={i}
            total={blocks.length}
            selected={b.id === selectedId}
            onSelect={() => onSelect(b.id)}
            onMove={(d) => move(b.id, d)}
            onDelete={() => setDeleteTarget(b)}
          />
        ))}
      </SortableContext>
      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete block?</DialogTitle>
            <DialogDescription>
              This will permanently delete the{' '}
              <span className="font-medium text-foreground">{deleteTarget?.type ?? 'block'}</span>.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (!deleteTarget) return
                onChange(blocks.filter((x) => x.id !== deleteTarget.id))
                setDeleteTarget(null)
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
