import React from "react";
import { useRef, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import binary from "/public/assets/binary.webp";
import project1 from "/public/assets/project1.webp";
import project2 from "/public/assets/project2.webp";
import { Code, Globe, Server, ExternalLink } from "lucide-react";
import { Trans } from "react-i18next";import AnimatedWireframeBg from "../components/FlowingLinesBg";

function Home() {
  const expertiseRef = useRef(null);
  const workRef = useRef(null);
  const [visibleSections, setVisibleSections] = useState({
    expertise: false,
    work: false,
  });
  const { t } = useTranslation();

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
      <AnimatedWireframeBg />
      <section className="hero" id="hero">
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
          <Trans i18nKey="title">
            My <span>Expertise</span>
          </Trans>
        </h2>

        <div className="expertise__cards">
          <div className="expertise__card expertise__card--1">
            <div className="expertise__headline">
              <Code
                className="expertise__icon"
                title="Code / Software Development"
                strokeWidth={1.5}
                size={32}
              />
              <h3>
                <Trans i18nKey="cards.software.title">
                  Software <span>Development</span>
                </Trans>
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
                title="Full Stack Development"
                strokeWidth={1.5}
                size={32}
              />

              <h3>
                <Trans i18nKey="cards.fullstack.title">
                  Full Stack <span>Development</span>
                </Trans>
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
                title="Database Systems"
                strokeWidth={1.5}
                size={32}
              />
              <h3>
                <Trans i18nKey="cards.database.title">
                  Database <span>Systems</span>
                </Trans>
              </h3>
            </div>
            <div className="expertise__text">
              <p>{t("cards.database.text")}</p>
            </div>
          </div>
        </div>

        <div className="expertise__image-container">
          <img src={binary} alt="binary code" className="expertise__image" />
        </div>
      </section>
      <section
        ref={workRef}
        className={`work ${visibleSections.work ? "in-view" : ""}`}
        id="work"
      >
      <h2 className="work__title">
        {t("works.title")}
      </h2>

      <div className="work__cards">
        <div className="work__card work__card--1">
          <img src={project1}  alt="project 1" className="work__card-image"/>
          <div className="work__card-text">
            <h3 className="work__card-title">{t("works.project1.title")}</h3>
            <p className="work__card-description">{t("works.project1.description")}</p>
            <a href="https://eco-life-etiqod.com/" target="_blank" rel="noopener noreferrer">
              {t("link")} <ExternalLink className="arrow" size={20} />
            </a>
          </div>
        </div>

        <div className="work__card work__card--2">
          <img src={project2}  alt="project 2" className="work__card-image" />
          <div className="work__card-text">
            <h3 className="work__card-title">{t("works.project2.title")}</h3>
            <p className="work__card-description">{t("works.project2.description")}</p>
            <a href="https://mazzo-premium.netlify.app/" target="_blank" rel="noopener noreferrer">
              {t("link")} <ExternalLink className="arrow" size={20} />
            </a>
          </div>
        </div>
      </div>
    </section>
    </main>
  );
}

export default Home;
