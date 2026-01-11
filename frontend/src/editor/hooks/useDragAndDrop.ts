import { PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core'
import type { Block } from '../types'

export function useDragAndDrop(blocks: Block[], onChange: (blocks: Block[]) => void) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
  )

  function stripDragId(id: string) {
    if (id.startsWith('list-')) return id.slice(5)
    if (id.startsWith('preview-')) return id.slice(8)
    return id
  }

  function handleDragEnd(e: DragEndEvent) {
    const { active, over } = e
    if (!over) return

    const activeId = stripDragId(String(active.id))
    const overId = stripDragId(String(over.id))
    if (activeId === overId) return

    const oldIndex = blocks.findIndex((b) => b.id === activeId)
    const newIndex = blocks.findIndex((b) => b.id === overId)
    if (oldIndex < 0 || newIndex < 0) return

    const copy = [...blocks]
    const [item] = copy.splice(oldIndex, 1)
    copy.splice(newIndex, 0, item)
    onChange(copy)
  }

  return { sensors, handleDragEnd }
}
