import type { Page } from '@/api/pages'
import { EditorLayout } from './components/EditorLayout'
import { useDragAndDrop } from './hooks/useDragAndDrop'
import { useEditorState } from './hooks/useEditorState'

type EditorPageProps = {
  initialPage?: Page | null
}

export function EditorPage({ initialPage }: EditorPageProps) {
  const editor = useEditorState(initialPage)
  const { sensors, handleDragEnd } = useDragAndDrop(editor.doc.blocks, editor.setBlocks)

  return (
    <EditorLayout
      doc={editor.doc}
      selectedId={editor.selectedId}
      setSelectedId={editor.setSelectedId}
      addBlock={editor.addBlock}
      updateBlock={editor.updateBlock}
      setBlocks={editor.setBlocks}
      sensors={sensors}
      onDragEnd={handleDragEnd}
      headerProps={{
        slug: editor.slug,
        title: editor.title,
        onSlugChange: editor.handleSlugChange,
        onTitleChange: editor.handleTitleChange,
        onSaveDraft: editor.handleSaveDraft,
        onPublish: editor.handlePublish,
        onNewPage: editor.handleNewPage,
        onDeletePage: editor.handleDeletePage,
        isDeleting: editor.isDeleting,
        pages: editor.pagesList ?? [],
        publishedUrl: editor.publishedUrl,
        saveStatus: editor.saveStatus,
        isDirty: editor.dirty,
        error: editor.errorMessage,
        isSaving: editor.isSaving,
        isPublishing: editor.isPublishing,
      }}
    />
  )
}
