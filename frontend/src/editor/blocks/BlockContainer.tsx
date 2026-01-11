import type React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

export function BlockContainer({
  dndId,
  selected,
  onSelect,
  className,
  style,
  children,
}: {
  dndId: string
  selected: boolean
  onSelect: () => void
  className?: string
  style?: React.CSSProperties
  children: React.ReactNode
}) {
  const { setNodeRef, attributes, listeners, transform, transition } = useSortable({ id: dndId })
  const adjustedTransform = transform ? { ...transform, scaleX: 1, scaleY: 1 } : null
  const dragStyle = { transform: CSS.Transform.toString(adjustedTransform), transition }
  const ringClass = selected ? 'ring-2 ring-indigo-500' : ''

  const handlePointerDown = (event: React.PointerEvent<HTMLElement>) => {
    listeners?.onPointerDown?.(event)
    if (event.button !== 0) return
    onSelect()
  }

  return (
    <section
      {...attributes}
      ref={setNodeRef}
      style={{ ...dragStyle, ...style }}
      {...listeners}
      onPointerDown={handlePointerDown}
      className={`${className ?? ''} cursor-pointer ${ringClass}`}
    >
      {children}
    </section>
  )
}
