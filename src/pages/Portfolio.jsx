import React, { useRef, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { projects } from '../data/projects';
import { ArrowUpRight } from 'lucide-react';

function Portfolio() {
  const { t } = useTranslation();
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

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
    <main>
      <section
        ref={ref}
        className={`work ${isVisible ? 'in-view' : ''}`}
        id="work"
      >
        <h2 className="work__title">{t('works.title')} <span>{t('works.titleHighlight')}</span></h2>

        <div className="work__cards">
          {projects.map((project) => (
            <a key={project.id} href={`/project/${project.id}`} className={`work__card work__card--${project.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="work__card-image-wrapper">
                <img src={project.image} alt={project.imageAlt} className="work__card-image" />
                {project.live && (
                  <div className="work__card-live-badge" onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.open(project.link, '_blank'); }}>
                    Live <ArrowUpRight size={18} className="live-badge-arrow" />
                  </div>
                )}
              </div>
              <div className="work__card-text">
                <p className="work__card-description">
                  {t(project.descriptionKey)}
                </p>
              </div>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}

export default Portfolio;
