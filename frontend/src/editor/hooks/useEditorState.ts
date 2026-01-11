import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Block, PageDoc } from '../types'
import type { Page, PageSummary } from '@/api/pages'
import {
  useCreatePageMutation,
  useDeletePageMutation,
  useGetPagesQuery,
  usePublishPageMutation,
  useUpdatePageMutation,
} from '@/api/pages'

function normalizeDraft(draft: PageDoc | null | undefined): PageDoc {
  if (draft && Array.isArray((draft as PageDoc).blocks)) return draft as PageDoc
  return { blocks: [] }
}

function buildSnapshot(input: { title: string; slug?: string; blocks: Block[] }) {
  return JSON.stringify({
    title: input.title.trim(),
    slug: input.slug ?? '',
    blocks: input.blocks,
  })
}

export type EditorState = {
  doc: PageDoc
  setBlocks: (blocks: Block[]) => void
  addBlock: (block: Block) => void
  updateBlock: (block: Block) => void
  selectedId: string | null
  setSelectedId: (id: string | null) => void
  title: string
  slug?: string
  handleTitleChange: (next: string) => void
  handleSlugChange: (next: string | undefined) => void
  handleSaveDraft: () => Promise<void>
  handlePublish: () => Promise<void>
  handleNewPage: () => void
  handleDeletePage: (id: number) => Promise<void>
  pagesList: PageSummary[] | undefined
  hasPublished: boolean
  publishedUrl: string | null
  saveStatus: 'idle' | 'saving' | 'saved' | 'error'
  dirty: boolean
  errorMessage: string | null
  isSaving: boolean
  isPublishing: boolean
  isDeleting: boolean
}

export function useEditorState(initialPage?: Page | null): EditorState {
  const initialTitle = initialPage?.title ?? 'Untitled page'
  const initialSlug = initialPage?.slug
  const initialDraft = normalizeDraft(initialPage?.draft_json as PageDoc | null)

  const [doc, setDoc] = useState<PageDoc>(initialDraft)
  const [pageId, setPageId] = useState<number | null>(initialPage?.id ?? null)
  const [slug, setSlugValue] = useState<string | undefined>(initialSlug)
  const [title, setTitle] = useState<string>(initialTitle)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [hasPublished, setHasPublished] = useState(!!initialPage?.published_json)
  const [dirty, setDirty] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>(
    initialPage ? 'saved' : 'idle',
  )
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const snapshotRef = useRef<string>(
    buildSnapshot({
      title: initialTitle,
      slug: initialSlug,
      blocks: initialDraft.blocks,
    }),
  )
  const pendingRef = useRef<{ title: string; slug?: string; blocks: Block[] }>({
    title: initialTitle,
    slug: initialSlug,
    blocks: initialDraft.blocks,
  })
  const autoSaveTimerRef = useRef<number | null>(null)
  const navigate = useNavigate()

  const [createPage, { isLoading: isCreating }] = useCreatePageMutation()
  const [updatePage, { isLoading: isUpdating }] = useUpdatePageMutation()
  const [publishPage, { isLoading: isPublishing }] = usePublishPageMutation()
  const [deletePage, { isLoading: isDeleting }] = useDeletePageMutation()
  const { data: pagesList } = useGetPagesQuery()

  const isSaving = isCreating || isUpdating

  useEffect(() => {
    return () => {
      if (autoSaveTimerRef.current) {
        window.clearTimeout(autoSaveTimerRef.current)
      }
    }
  }, [])

  function extractErrorMessage(error: unknown) {
    if (!error || typeof error !== 'object') return 'Request failed.'
    const maybe = error as {
      data?: {
        errors?: { slug?: string[] }
        message?: string
      }
    }
    const data = maybe.data
    if (data?.errors?.slug?.length) return data.errors.slug[0]
    if (data?.message) return data.message
    return 'Request failed.'
  }

  function syncDirty(nextTitle: string, nextSlug: string | undefined, nextBlocks: Block[]) {
    const currentSnapshot = buildSnapshot({
      title: nextTitle,
      slug: nextSlug,
      blocks: nextBlocks,
    })
    const hasChanges = currentSnapshot !== snapshotRef.current
    setDirty(hasChanges)
    if (hasChanges && saveStatus === 'saved') {
      setSaveStatus('idle')
    }
  }

  function scheduleAutoSave() {
    if (!pageId) return
    if (isSaving || isPublishing || isDeleting) return
    if (autoSaveTimerRef.current) {
      window.clearTimeout(autoSaveTimerRef.current)
    }
    autoSaveTimerRef.current = window.setTimeout(async () => {
      const payload = pendingRef.current
      setSaveStatus('saving')
      try {
        const updated = await updatePage({
          id: pageId,
          title: payload.title.trim(),
          slug: payload.slug,
          draft_json: { blocks: payload.blocks },
        }).unwrap()
        snapshotRef.current = buildSnapshot({
          title: updated.title,
          slug: updated.slug,
          blocks: payload.blocks,
        })
        pendingRef.current = {
          title: updated.title,
          slug: updated.slug,
          blocks: payload.blocks,
        }
        setDirty(false)
        setSaveStatus('saved')
        if (updated.slug) {
          const nextPath = `/pages/${updated.slug}`
          if (window.location.pathname !== nextPath) {
            window.history.replaceState(null, '', nextPath)
          }
        }
        setSlugValue(updated.slug)
        setTitle(updated.title)
        setHasPublished(!!updated.published_json)
      } catch (err) {
        setSaveStatus('error')
        setErrorMessage(extractErrorMessage(err))
      }
    }, 1200)
  }

  function updatePending(nextTitle: string, nextSlug: string | undefined, nextBlocks: Block[]) {
    pendingRef.current = { title: nextTitle, slug: nextSlug, blocks: nextBlocks }
    syncDirty(nextTitle, nextSlug, nextBlocks)
    scheduleAutoSave()
  }

  function setBlocks(blocks: Block[]) {
    setDoc((prev) => ({ ...prev, blocks }))
    if (selectedId && !blocks.some((b) => b.id === selectedId)) setSelectedId(null)
    updatePending(title, slug, blocks)
  }

  function addBlock(block: Block) {
    const next = [...doc.blocks, block]
    setBlocks(next)
    setSelectedId(block.id)
  }

  function updateBlock(block: Block) {
    setBlocks(doc.blocks.map((b) => (b.id === block.id ? block : b)))
  }

  function handleSlugChange(next: string | undefined) {
    setSlugValue(next)
    updatePending(title, next, doc.blocks)
  }

  function handleTitleChange(next: string) {
    setTitle(next)
    updatePending(next, slug, doc.blocks)
  }

  async function handleSaveDraft() {
    setErrorMessage(null)
    const trimmedTitle = title.trim()
    if (!trimmedTitle) {
      setErrorMessage('Title is required.')
      return
    }

    try {
      if (autoSaveTimerRef.current) {
        window.clearTimeout(autoSaveTimerRef.current)
      }
      setSaveStatus('saving')
      if (pageId) {
        const updated = await updatePage({
          id: pageId,
          title: trimmedTitle,
          slug,
          draft_json: { blocks: doc.blocks },
        }).unwrap()
        snapshotRef.current = buildSnapshot({
          title: updated.title,
          slug: updated.slug,
          blocks: doc.blocks,
        })
        pendingRef.current = {
          title: updated.title,
          slug: updated.slug,
          blocks: doc.blocks,
        }
        setDirty(false)
        setSaveStatus('saved')
        setSlugValue(updated.slug)
        setTitle(updated.title)
        setHasPublished(!!updated.published_json)
        if (updated.slug) navigate(`/pages/${updated.slug}`)
      } else {
        const created = await createPage({
          title: trimmedTitle,
          slug,
          draft_json: { blocks: doc.blocks },
        }).unwrap()
        snapshotRef.current = buildSnapshot({
          title: created.title,
          slug: created.slug,
          blocks: doc.blocks,
        })
        pendingRef.current = {
          title: created.title,
          slug: created.slug,
          blocks: doc.blocks,
        }
        setDirty(false)
        setSaveStatus('saved')
        setPageId(created.id)
        setSlugValue(created.slug)
        setTitle(created.title)
        setHasPublished(!!created.published_json)
        if (created.slug) navigate(`/pages/${created.slug}`)
      }
    } catch (err) {
      setSaveStatus('error')
      setErrorMessage(extractErrorMessage(err))
    }
  }

  async function handlePublish() {
    setErrorMessage(null)
    const trimmedTitle = title.trim()
    if (!trimmedTitle) {
      setErrorMessage('Title is required.')
      return
    }

    try {
      let currentId = pageId
      if (currentId) {
        const updated = await updatePage({
          id: currentId,
          title: trimmedTitle,
          slug,
          draft_json: { blocks: doc.blocks },
        }).unwrap()
        snapshotRef.current = buildSnapshot({
          title: updated.title,
          slug: updated.slug,
          blocks: doc.blocks,
        })
        pendingRef.current = {
          title: updated.title,
          slug: updated.slug,
          blocks: doc.blocks,
        }
        setDirty(false)
        setSaveStatus('saved')
        setSlugValue(updated.slug)
        setTitle(updated.title)
        if (updated.slug) navigate(`/pages/${updated.slug}`)
      } else {
        const created = await createPage({
          title: trimmedTitle,
          slug,
          draft_json: { blocks: doc.blocks },
        }).unwrap()
        snapshotRef.current = buildSnapshot({
          title: created.title,
          slug: created.slug,
          blocks: doc.blocks,
        })
        pendingRef.current = {
          title: created.title,
          slug: created.slug,
          blocks: doc.blocks,
        }
        setDirty(false)
        setSaveStatus('saved')
        currentId = created.id
        setPageId(created.id)
        setSlugValue(created.slug)
        setTitle(created.title)
        if (created.slug) navigate(`/pages/${created.slug}`)
      }

      const published = await publishPage({ id: currentId! }).unwrap()
      setHasPublished(!!published.published_json)
    } catch (err) {
      setSaveStatus('error')
      setErrorMessage(extractErrorMessage(err))
    }
  }

  function handleNewPage() {
    navigate('/')
  }

  async function handleDeletePage(id: number) {
    setErrorMessage(null)
    try {
      await deletePage(id).unwrap()
      if (pageId === id) {
        handleNewPage()
      }
    } catch (err) {
      setErrorMessage(extractErrorMessage(err))
    }
  }

  return {
    doc,
    setBlocks,
    addBlock,
    updateBlock,
    selectedId,
    setSelectedId,
    title,
    slug,
    handleTitleChange,
    handleSlugChange,
    handleSaveDraft,
    handlePublish,
    handleNewPage,
    handleDeletePage,
    pagesList,
    hasPublished,
    publishedUrl: hasPublished && slug ? `/p/${slug}` : null,
    saveStatus,
    dirty,
    errorMessage,
    isSaving,
    isPublishing,
    isDeleting,
  }
}
