import React, { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { useTranslation, Trans } from "react-i18next";
import project1 from "/public/assets/project1.webp";
import project2 from "/public/assets/project2.webp";

function Work() {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className={`work ${isVisible ? "in-view" : ""}`}
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
              {t("link")} <ArrowUpRight className="arrow"/>
            </a>
          </div>
        </div>

        <div className="work__card work__card--2">
          <img src={project2}  alt="project 2" className="work__card-image" />
          <div className="work__card-text">
            <h3 className="work__card-title">{t("works.project2.title")}</h3>
            <p className="work__card-description">{t("works.project2.description")}</p>
            <a href="https://mazzo-premium.netlify.app/" target="_blank" rel="noopener noreferrer">
              {t("link")} <ArrowUpRight className="arrow"/>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Work;
