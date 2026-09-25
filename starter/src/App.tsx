import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import { LightboxProvider } from './context/LightboxContext'
import { FilterProvider } from './context/FilterContext'
import HomePage from './pages/HomePage'
import WorkPage from './pages/WorkPage'
import SeriesPage from './pages/SeriesPage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'

export default function App() {
  return (
    <LightboxProvider>
      <FilterProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/work" element={<WorkPage />} />
              <Route path="/work/:seriesId" element={<SeriesPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="*" element={<HomePage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </FilterProvider>
    </LightboxProvider>
  )
}
