import { Navigate, Route, Routes } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import { FilterProvider } from './context/FilterContext'
import { LightboxProvider } from './context/LightboxContext'
import Home from './pages/Home'
import Work from './pages/Work'
import Series from './pages/Series'
import About from './pages/About'
import Contact from './pages/Contact'

export default function App() {
  return (
    <FilterProvider>
      <LightboxProvider>
        <ScrollToTop />
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/work" element={<Work />} />
            <Route path="/work/:seriesId" element={<Series />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </LightboxProvider>
    </FilterProvider>
  )
}
