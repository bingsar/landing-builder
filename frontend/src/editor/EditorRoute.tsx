import { useParams } from 'react-router-dom'
import { useGetPageBySlugQuery } from '@/api/pages'
import { Loading } from '@/components/ui/loading'
import { EditorPage } from './EditorPage'

export function EditorRoute() {
  const { slug } = useParams()
  const {
    currentData: pageBySlug,
    isLoading,
    isFetching,
    isError,
  } = useGetPageBySlugQuery(slug ?? '', {
    skip: !slug,
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
  })

  if (slug && (isLoading || isFetching) && !pageBySlug) {
    return <Loading />
  }

  if (slug && (isError || !pageBySlug)) {
    return <div className="p-6">Page not found.</div>
  }

  const initialPage = slug ? pageBySlug ?? null : null
  const editorKey = slug
    ? `${slug}:${pageBySlug?.updated_at ?? 'loading'}`
    : 'new'

  return <EditorPage key={editorKey} initialPage={initialPage} />
}
