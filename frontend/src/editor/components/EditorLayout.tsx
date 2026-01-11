import { useCallback, useEffect, useMemo, useRef, useState, type ComponentProps } from 'react'
import type { Block, PageDoc } from '../types'
import { BlocksList } from '../BlocksList'
import { BlockEditor } from '../BlockEditor'
import { BlockRenderer } from '../BlockRenderer'
import { AddBlockDialog } from '../AddBlockDialog'
import { Separator } from '@/components/ui/separator'
import { EditorHeader } from '@/components/layout/EditorHeader'
import { DndContext, closestCenter, type DragEndEvent } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'

type EditorLayoutProps = {
  doc: PageDoc
  selectedId: string | null
  setSelectedId: (id: string | null) => void
  addBlock: (block: Block) => void
  updateBlock: (block: Block) => void
  setBlocks: (blocks: Block[]) => void
  headerProps: ComponentProps<typeof EditorHeader>
  sensors: ReturnType<typeof import('@dnd-kit/core').useSensors>
  onDragEnd: (event: DragEndEvent) => void
}

export function EditorLayout({
  doc,
  selectedId,
  setSelectedId,
  addBlock,
  updateBlock,
  setBlocks,
  headerProps,
  sensors,
  onDragEnd,
}: EditorLayoutProps) {
  const [leftWidth, setLeftWidth] = useState(280)
  const [rightWidth, setRightWidth] = useState(360)
  const [dragging, setDragging] = useState<'left' | 'right' | null>(null)
  const [previewSize, setPreviewSize] = useState<{ width: number; height: number } | null>(null)
  const layoutRef = useRef<HTMLDivElement>(null)
  const previewRef = useRef<HTMLElement>(null)
  const handleWidth = 6
  const minLeft = 260
  const minRight = 280
  const minCenter = 420

  const updatePreviewSize = useCallback(() => {
    const preview = previewRef.current
    if (!preview) return
    const rect = preview.getBoundingClientRect()
    setPreviewSize({ width: Math.round(rect.width), height: Math.round(rect.height) })
  }, [])

  const selectedBlock = useMemo(
    () => doc.blocks.find((b) => b.id === selectedId) ?? null,
    [doc.blocks, selectedId],
  )

  useEffect(() => {
    if (!dragging) return

    const handleMove = (event: PointerEvent) => {
      const layout = layoutRef.current
      if (!layout) return

      const rect = layout.getBoundingClientRect()
      const totalWidth = rect.width
      const contentWidth = totalWidth - handleWidth * 2
      const x = event.clientX - rect.left

      if (dragging === 'left') {
        const nextLeft = Math.min(
          Math.max(x - handleWidth / 2, minLeft),
          contentWidth - rightWidth - minCenter,
        )
        setLeftWidth(nextLeft)
      } else {
        const nextRight = Math.min(
          Math.max(totalWidth - x - handleWidth / 2, minRight),
          contentWidth - leftWidth - minCenter,
        )
        setRightWidth(nextRight)
      }
    }

    const stopDrag = () => setDragging(null)
    window.addEventListener('pointermove', handleMove)
    window.addEventListener('pointerup', stopDrag)
    return () => {
      window.removeEventListener('pointermove', handleMove)
      window.removeEventListener('pointerup', stopDrag)
    }
  }, [dragging, leftWidth, rightWidth])

  useEffect(() => {
    if (!dragging) {
      setPreviewSize(null)
      return
    }
    updatePreviewSize()
  }, [dragging, leftWidth, rightWidth, updatePreviewSize])

  useEffect(() => {
    if (!dragging) return
    const previousCursor = document.body.style.cursor
    const previousSelect = document.body.style.userSelect
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
    return () => {
      document.body.style.cursor = previousCursor
      document.body.style.userSelect = previousSelect
    }
  }, [dragging])

  return (
    <div className="h-dvh grid grid-rows-[auto_1fr]">
      <EditorHeader {...headerProps} />

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <div
          ref={layoutRef}
          className="grid min-h-0"
          style={{
            gridTemplateColumns: `${leftWidth}px ${handleWidth}px 1fr ${handleWidth}px ${rightWidth}px`,
          }}
        >
          <aside className="border-r p-3 flex flex-col gap-3 min-h-0">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold">Page builder</div>
              <AddBlockDialog onAdd={addBlock} />
            </div>
            <Separator />
            <BlocksList
              blocks={doc.blocks}
              selectedId={selectedId}
              onSelect={setSelectedId}
              onChange={setBlocks}
            />
          </aside>

          <div
            role="separator"
            aria-orientation="vertical"
            onPointerDown={(event) => {
              event.preventDefault()
              setDragging('left')
            }}
            className="bg-border/60 hover:bg-border cursor-col-resize"
          />

          <main ref={previewRef} className="bg-muted/30 overflow-auto relative">
            {dragging && previewSize ? (
              <div className="absolute top-3 right-3 bg-background/90 text-foreground text-xs px-2 py-1 rounded border shadow-sm pointer-events-none">
                {previewSize.width} × {previewSize.height}
              </div>
            ) : null}

            <div className="max-w-3xl mx-auto p-6 space-y-6">
              {doc.blocks.length === 0 ? (
                <div className="text-sm text-muted-foreground border rounded-xl p-6 bg-background">
                  Добавьте блок слева, чтобы начать
                </div>
              ) : null}

              <SortableContext
                items={doc.blocks.map((b) => `preview-${b.id}`)}
                strategy={verticalListSortingStrategy}
              >
                {doc.blocks.map((b) => (
                  <BlockRenderer
                    key={b.id}
                    block={b}
                    dndId={`preview-${b.id}`}
                    selected={b.id === selectedId}
                    onSelect={() => setSelectedId(b.id)}
                  />
                ))}
              </SortableContext>
            </div>
          </main>

          <div
            role="separator"
            aria-orientation="vertical"
            onPointerDown={(event) => {
              event.preventDefault()
              setDragging('right')
            }}
            className="bg-border/60 hover:bg-border cursor-col-resize"
          />

          <aside className="border-l flex flex-col min-h-0">
            <div className="flex-1 overflow-auto">
              <BlockEditor block={selectedBlock} onChange={updateBlock} />
            </div>
          </aside>
        </div>
      </DndContext>
    </div>
  )
}
