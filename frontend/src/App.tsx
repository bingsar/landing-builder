import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { PublicPage } from '@/public/PublicPage'
import { EditorRoute } from '@/editor/EditorRoute'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<EditorRoute />} />
        <Route path="/pages/:slug" element={<EditorRoute />} />
        <Route path="/p/:slug" element={<PublicPage />} />
      </Routes>
    </BrowserRouter>
  )
}
