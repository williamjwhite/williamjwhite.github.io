import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { Home } from '@/pages/Home'
import { Sheet } from '@/pages/Sheet'
import { Editor } from '@/pages/Editor'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/cheatsheets/" element={<Layout><Home /></Layout>} />
        <Route path="/cheatsheets/editor" element={<Layout><Editor /></Layout>} />
        <Route path="/cheatsheets/:slug" element={<Layout><Sheet /></Layout>} />
        {/* Catch-all for GitHub Pages deep links */}
        <Route path="*" element={<Layout><Home /></Layout>} />
      </Routes>
    </BrowserRouter>
  )
}
