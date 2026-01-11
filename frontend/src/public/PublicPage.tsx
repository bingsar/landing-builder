import { useEffect } from "react"
import { useParams } from "react-router-dom"
import { useGetPublicPageQuery } from "@/api/pages"
import type { PageDoc } from "@/editor/types"
import { Loading } from "@/components/ui/loading"
import { PublicBlockRenderer } from "./PublicBlockRenderer"

export function PublicPage() {
  const { slug } = useParams()
  const { data, isLoading, isFetching } = useGetPublicPageQuery(slug ?? "", {
    skip: !slug,
  })

  useEffect(() => {
    if (data?.title) {
      document.title = data.title
    }
  }, [data?.title])

  if (!slug) {
    return <div className="p-6">Page not found.</div>
  }

  if (isLoading || isFetching) {
    return <Loading />
  }

  if (!data) {
    return <div className="p-6">Page not found.</div>
  }

  const published = data.published_json as PageDoc | null

  if (!published || !Array.isArray(published.blocks)) {
    return <div className="p-6">Page is not published yet.</div>
  }

  return (
    <main className="min-h-dvh bg-muted/30">
      <div className="max-w-3xl mx-auto p-6 space-y-6">
        {published.blocks.map((block) => (
          <PublicBlockRenderer key={block.id} block={block} />
        ))}
      </div>
    </main>
  )
}
