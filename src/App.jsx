import React, {useEffect} from 'react'
import Header from '/components/Header'
import Footer from '/components/Footer'
import Hero from '../components/Hero'
import Expertise from '../components/Expertise';
import Work from '../components/Work';

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
    <>
      <Header />

      <Hero />
      <Expertise />
      <Work />
      
      <Footer />
    </>
  )
}

export default App
