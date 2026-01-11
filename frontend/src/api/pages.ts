import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { PageDoc } from '@/editor/types'

export type Page = {
  id: number
  slug: string
  title: string
  draft_json: PageDoc | null
  published_json: PageDoc | null
  created_at: string
  updated_at: string
}

export type PageSummary = {
  id: number
  slug: string
  title: string
  has_published: boolean
  updated_at: string
}

export const pagesApi = createApi({
  reducerPath: 'pagesApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '',
  }),
  tagTypes: ['Page', 'PublicPage', 'PageBySlug'],
  endpoints: (builder) => ({
    getPages: builder.query<PageSummary[], void>({
      query: () => '/api/pages',
      transformResponse: (response: { data: PageSummary[] }) => response.data,
      providesTags: ['Page'],
    }),
    createPage: builder.mutation<Page, { title: string; slug?: string; draft_json?: PageDoc }>({
      query: (body) => ({
        url: '/api/pages',
        method: 'POST',
        body,
      }),
      transformResponse: (response: { data: Page }) => response.data,
      invalidatesTags: (result) => (result ? [{ type: 'Page', id: result.id }, 'Page'] : ['Page']),
    }),
    getPage: builder.query<Page, number>({
      query: (id) => `/api/pages/${id}`,
      transformResponse: (response: { data: Page }) => response.data,
      providesTags: (result) => (result ? [{ type: 'Page', id: result.id }] : []),
    }),
    getPageBySlug: builder.query<Page, string>({
      query: (slug) => `/api/pages/slug/${slug}`,
      transformResponse: (response: { data: Page }) => response.data,
      providesTags: (_result, _error, slug) => [{ type: 'PageBySlug', id: slug }],
    }),
    deletePage: builder.mutation<boolean, number>({
      query: (id) => ({
        url: `/api/pages/${id}`,
        method: 'DELETE',
      }),
      transformResponse: (response: { data: boolean }) => response.data,
      invalidatesTags: ['Page'],
    }),
    updatePage: builder.mutation<
      Page,
      { id: number; title?: string; slug?: string; draft_json?: PageDoc | null }
    >({
      query: ({ id, ...body }) => ({
        url: `/api/pages/${id}`,
        method: 'PUT',
        body,
      }),
      transformResponse: (response: { data: Page }) => response.data,
      invalidatesTags: (result) => (result ? [{ type: 'Page', id: result.id }, 'Page'] : ['Page']),
    }),
    publishPage: builder.mutation<Page, { id: number; published_json?: PageDoc | null }>({
      query: ({ id, ...body }) => ({
        url: `/api/pages/${id}/publish`,
        method: 'POST',
        body,
      }),
      transformResponse: (response: { data: Page }) => response.data,
      invalidatesTags: (result) =>
        result
          ? [{ type: 'Page', id: result.id }, { type: 'PublicPage', id: result.slug }, 'Page']
          : ['Page'],
    }),
    getPublicPage: builder.query<
      {
        id: number
        slug: string
        title: string
        published_json: PageDoc
        created_at: string
        updated_at: string
      },
      string
    >({
      query: (slug) => `/api/pages/public/${slug}`,
      transformResponse: (response: {
        data: {
          id: number
          slug: string
          title: string
          published_json: PageDoc
          created_at: string
          updated_at: string
        }
      }) => response.data,
      providesTags: (_result, _error, slug) => [{ type: 'PublicPage', id: slug }],
    }),
  }),
})

export const {
  useGetPagesQuery,
  useCreatePageMutation,
  useGetPageQuery,
  useGetPageBySlugQuery,
  useUpdatePageMutation,
  usePublishPageMutation,
  useDeletePageMutation,
  useGetPublicPageQuery,
} = pagesApi
