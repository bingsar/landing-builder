import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { PageSummary } from '@/api/pages'
import { CheckCircle2, ExternalLink, Loader2, Menu, Plus, Trash } from 'lucide-react'
import { Link } from 'react-router-dom'

export function EditorHeader({
  slug,
  title,
  onSlugChange,
  onTitleChange,
  onSaveDraft,
  onPublish,
  onNewPage,
  onDeletePage,
  isDeleting,
  pages,
  publishedUrl,
  saveStatus,
  isDirty,
  error,
  isSaving,
  isPublishing,
}: {
  slug?: string
  title?: string
  onSlugChange: (next: string | undefined) => void
  onTitleChange: (next: string) => void
  onSaveDraft?: () => void
  onPublish?: () => void
  onNewPage?: () => void
  onDeletePage?: (id: number) => void
  isDeleting?: boolean
  pages: PageSummary[]
  publishedUrl?: string | null
  saveStatus?: 'idle' | 'saving' | 'saved' | 'error'
  isDirty?: boolean
  error?: string | null
  isSaving?: boolean
  isPublishing?: boolean
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<PageSummary | null>(null)
  const menuRef = useRef<HTMLDivElement | null>(null)
  const [draft, setDraft] = useState('')

  useEffect(() => {
    if (!menuOpen) return
    const handleClickOutside = (event: MouseEvent) => {
      if (!menuRef.current) return
      const target = event.target as Node
      if (!menuRef.current.contains(target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [menuOpen])

  const commit = () => {
    const nextSlug = draft.trim()
    onSlugChange(nextSlug || undefined)
    setIsEditing(false)
  }

  const cancel = () => {
    setIsEditing(false)
  }

  return (
    <header className="border-b bg-background px-4 py-2 flex flex-col gap-2">
      <div className="flex items-center justify-between gap-4">
        <div className="relative" ref={menuRef}>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Open pages menu"
          >
            <Menu />
          </Button>
          {menuOpen ? (
            <div className="absolute left-0 top-full mt-2 w-80 rounded-lg border bg-background shadow-lg z-50">
              <div className="p-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => {
                    onNewPage?.()
                    setMenuOpen(false)
                  }}
                >
                  <Plus />
                  Build new page
                </Button>
              </div>
              <Separator />
              <div className="max-h-80 overflow-auto">
                {pages.length === 0 ? (
                  <div className="px-3 py-4 text-xs text-muted-foreground">No pages yet</div>
                ) : (
                  pages.map((page) => (
                    <div
                      key={page.id}
                      className="flex items-center justify-between gap-3 px-3 py-2 hover:bg-muted/40"
                    >
                      <Link
                        to={`/pages/${page.slug}`}
                        onClick={() => setMenuOpen(false)}
                        className="min-w-0 flex-1"
                      >
                        <div className="text-sm font-medium truncate">{page.title}</div>
                        <div className="text-xs text-muted-foreground truncate">{page.slug}</div>
                      </Link>
                      {page.has_published ? (
                        <Button variant="ghost" size="icon-sm" asChild>
                          <a
                            href={`/p/${page.slug}`}
                            target="_blank"
                            rel="noreferrer"
                            aria-label="Open published page"
                          >
                            <ExternalLink />
                          </a>
                        </Button>
                      ) : null}
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => setDeleteTarget(page)}
                        aria-label="Delete page"
                      >
                        <Trash />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : null}
        </div>
        <div className="flex items-center gap-3 text-sm font-semibold tracking-wide">
          <span>Title:</span>
          <Input
            value={title ?? ''}
            onChange={(event) => {
              const next = event.target.value
              onTitleChange(next)
            }}
            className="h-7 px-2 text-sm w-64"
            placeholder="Landing page"
          />
          <span className="text-muted-foreground">Slug:</span>
          {isEditing ? (
            <Input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onBlur={commit}
              onKeyDown={(event) => {
                if (event.key === 'Enter') commit()
                if (event.key === 'Escape') cancel()
              }}
              autoFocus
              className="h-7 px-2 text-sm w-64 w-fit"
              placeholder="untitled_page"
            />
          ) : (
            <button
              type="button"
              onClick={() => {
                setDraft(slug ?? '')
                setIsEditing(true)
              }}
              className="text-left hover:text-foreground/80 cursor-pointer"
            >
              {slug ? slug : 'untitled_page'}
            </button>
          )}
        </div>
        <div className="relative flex items-center gap-2">
          <span className="absolute h-5 w-5 -left-8">
            {saveStatus === 'saving' ? (
              <Loader2 className="absolute inset-0 m-auto h-4 w-4 animate-spin text-muted-foreground" />
            ) : null}
            {saveStatus === 'saved' && !isDirty ? (
              <CheckCircle2 className="absolute inset-0 m-auto h-4 w-4 text-emerald-500" />
            ) : null}
          </span>
          <Button
            variant="outline"
            onClick={onSaveDraft}
            disabled={!isDirty || isSaving || isPublishing}
            className="min-w-26"
          >
            {isSaving ? 'Saving...' : 'Save draft'}
          </Button>
          <Button
            onClick={onPublish}
            disabled={isSaving || isPublishing}
            className="min-w-30"
          >
            {isPublishing ? 'Publishing...' : 'Publish'}
          </Button>
          {publishedUrl ? (
            <Button variant="ghost" size="icon" asChild>
              <a
                href={publishedUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="Open published page"
              >
                <ExternalLink />
              </a>
            </Button>
          ) : null}
        </div>
      </div>
      {error ? <div className="text-xs text-destructive">{error}</div> : null}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete page?</DialogTitle>
            <DialogDescription>
              This will permanently delete{' '}
              <span className="font-medium text-foreground">
                {deleteTarget?.title ?? 'this page'}
              </span>
              .
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
                onDeletePage?.(deleteTarget.id)
                setDeleteTarget(null)
              }}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  )
}
