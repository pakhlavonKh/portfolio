import React from "react";
import { useRef, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import BinaryRain from "../components/BinaryRain";
import { projects } from "../data/projects";
import { Code, Globe, Server, ArrowUpRight } from "lucide-react";
import AnimatedWireframeBg from "../components/FlowingLinesBg";
import LiquidBinaryField from "../components/LiquidBinaryField";

function Home() {
  const expertiseRef = useRef(null);
  const workRef = useRef(null);
  const [visibleSections, setVisibleSections] = useState({
    expertise: false,
    work: false,
  });
  const [randomProjects, setRandomProjects] = useState([]);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef(null);
  const { t } = useTranslation();

  // Throttle scroll events to pause animations during scrolling
  useEffect(() => {
    let isScrolling = false;
    
    const handleScroll = () => {
      if (!isScrolling) {
        setIsScrolling(true);
      }
      
      clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 200); // Increased from 150ms to 200ms
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    // Select 3 random projects using Fisher-Yates shuffle
    const shuffled = [...projects];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setRandomProjects(shuffled.slice(0, 3));
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            setVisibleSections((prev) => ({
              ...prev,
              [id]: true,
            }));
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 },
    );

    if (expertiseRef.current) observer.observe(expertiseRef.current);
    if (workRef.current) observer.observe(workRef.current);

    return () => observer.disconnect();
  }, []);
  return (
    <main>
      <section className="hero" id="hero">
        <AnimatedWireframeBg showParticles={true} />
        <div className="center">
          <h1 id="name">Khamidov Pakhlavon</h1>
          <h2 id="title">{t("hero__title")}</h2>
        </div>

        <a href="#expertise">
          <div className="mouse"></div>
        </a>
      </section>
      <section
        ref={expertiseRef}
        className={`expertise ${visibleSections.expertise ? "in-view" : ""}`}
        id="expertise"
      >
        <h2 className="expertise__title">
          {t("title")} <span>{t("titleHighlight")}</span>
        </h2>

        <div className="expertise__cards">
          <div className="expertise__card expertise__card--1">
            <div className="expertise__headline">
              <Code
                className="expertise__icon"
                title={t("cards.software.icon")}
                strokeWidth={1.5}
                size={32}
              />
              <h3>
                {t("cards.software.prefix")} <span>{t("cards.software.titleHighlight")}</span>
              </h3>
            </div>
            <div className="expertise__text">
              <p>{t("cards.software.text")}</p>
            </div>
          </div>

          <div className="expertise__card expertise__card--2">
            <div className="expertise__headline">
              <Globe
                className="expertise__icon"
                title={t("cards.fullstack.icon")}
                strokeWidth={1.5}
                size={32}
              />

              <h3>
                {t("cards.fullstack.prefix")} <span>{t("cards.fullstack.titleHighlight")}</span>
              </h3>
            </div>
            <div className="expertise__text">
              <p>{t("cards.fullstack.text")}</p>
            </div>
          </div>

          <div className="expertise__card expertise__card--3">
            <div className="expertise__headline">
              <Server
                className="expertise__icon"
                title={t("cards.database.icon")}
                strokeWidth={1.5}
                size={32}
              />
              <h3>
                {t("cards.database.prefix")} <span>{t("cards.database.titleHighlight")}</span>
              </h3>
            </div>
            <div className="expertise__text">
              <p>{t("cards.database.text")}</p>
            </div>
          </div>
        </div>

        <div 
          className="expertise__image-container"
          style={{
            position: "relative",
            zIndex: 1,
          }}
        >
          <div style={{ position: "relative", height: "100%", marginTop: "-100px" }}>
            <BinaryRain paused={isScrolling} />
          </div>
        </div>
      </section>
      <section
        ref={workRef}
        className={`work ${visibleSections.work ? "in-view" : ""}`}
        id="work"
      >
      <h2 className="work__title">
        {t("works.title")} <span>{t("works.titleHighlight")}</span>
      </h2>

      <div className="work__cards">
        {randomProjects.map((project) => (
          <a key={project.id} href={`/project/${project.id}`} className={`work__card work__card--${project.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="work__card-image-wrapper">
              <img src={project.image} alt={project.imageAlt} className="work__card-image"/>
              {project.live && (
                <div className="work__card-live-badge" onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.open(project.link, '_blank'); }}>
                  Live <ArrowUpRight size={18} className="live-badge-arrow" />
                </div>
              )}
            </div>
            <div className="work__card-text">
              <p className="work__card-description">{t(project.shortDescriptionKey)}</p>
            </div>
          </a>
        ))}
      </div>
      <div className="work__view-all">
        <a href="/portfolio" className="work__view-all-link">
          View all projects
        </a>
      </div>
    </section>
    </main>
  );
}

export default Home;
