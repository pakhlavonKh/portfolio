import React, { useEffect, Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'

// Lazy load route components for code splitting
const Home = lazy(() => import('./pages/Home'))
const About = lazy(() => import('./pages/About'))
const Portfolio = lazy(() => import('./pages/Portfolio'))
const Contact = lazy(() => import('./pages/Contact'))

function App() {

  useEffect(() => {
      const handleMouseMove = (e) => {
        document.body.style.setProperty("--x", `${(e.clientX / window.innerWidth) * 100}%`);
        document.body.style.setProperty("--y", `${(e.clientY / window.innerHeight) * 100}%`);
      };

      window.addEventListener("mousemove", handleMouseMove);
      return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);
  
  return (
    <div className="app-wrapper">
      <Router>
        <ScrollToTop />
        <Header />
        <Suspense fallback={<div style={{ minHeight: '100vh', backgroundColor: '#0a0a0a' }} />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </Suspense>
        <Footer />
      </Router>
    </div>
  )
}

export default App
