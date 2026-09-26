import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { projects } from '../data/projects';
import { 
  ArrowLeft, 
  ArrowUpRight, 
  Github, 
  ExternalLink, 
  Lock, 
  Sparkles, 
  Layers, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';

function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const projectId = parseInt(id, 10);
  const currentIndex = projects.findIndex(p => p.id === projectId);
  const project = currentIndex !== -1 ? projects[currentIndex] : null;

  const prevProject = project 
    ? (currentIndex > 0 ? projects[currentIndex - 1] : projects[projects.length - 1])
    : null;
  const nextProject = project
    ? (currentIndex < projects.length - 1 ? projects[currentIndex + 1] : projects[0])
    : null;

  const projectNumber = project ? String(project.id).padStart(2, '0') : '';
  const totalProjects = String(projects.length).padStart(2, '0');

  const cleanUrl = project?.link 
    ? project.link.replace(/^https?:\/\//, '').replace(/\/$/, '')
    : 'localhost:3000';

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (!project) {
    return (
      <main className="project-detail">
        <div className="project-detail__not-found">
          <h1 className="project-detail__not-found-title">{t('project.notFound')}</h1>
          <button 
            onClick={() => navigate('/portfolio')}
            className="project-detail__btn-primary"
            style={{ cursor: 'pointer', border: 'none' }}
          >
            ← {t('project.backToPortfolio')}
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="project-detail">
      <div className="project-detail__ambient-glow" aria-hidden="true" />

      {/* Topbar: Back button & Quick switcher */}
      <div className="project-detail__topbar">
        <Link to="/portfolio" className="project-detail__back-btn">
          <ArrowLeft size={16} /> {t('project.backToPortfolio')}
        </Link>

        <div className="project-detail__switcher">
          <span className="project-detail__switcher-counter">
            {projectNumber} / {totalProjects}
          </span>
          {prevProject && (
            <Link 
              to={`/project/${prevProject.id}`} 
              className="project-detail__switcher-btn"
              title={`${t('project.prevProject')}: ${t(prevProject.titleKey)}`}
              aria-label={t('project.prevProject')}
            >
              <ChevronLeft size={16} />
            </Link>
          )}
          {nextProject && (
            <Link 
              to={`/project/${nextProject.id}`} 
              className="project-detail__switcher-btn"
              title={`${t('project.nextProject')}: ${t(nextProject.titleKey)}`}
              aria-label={t('project.nextProject')}
            >
              <ChevronRight size={16} />
            </Link>
          )}
        </div>
      </div>

      {/* Header section: Title, Category & Live/Dev Badge, Action Buttons */}
      <div className="project-detail__header">
        <div className="project-detail__header-main">
          <div className="project-detail__badge-strip">
            <span className="project-detail__category-badge">
              {project.category}
            </span>
            <span className={`project-detail__status-badge ${project.live ? '' : 'project-detail__status-badge--dev'}`}>
              <span className="project-detail__status-dot" />
              {project.live ? t('project.liveStatus') : t('project.devStatus')}
            </span>
          </div>

          <h1 className="project-detail__title">
            {t(project.titleKey)}
          </h1>
        </div>

        <div className="project-detail__header-actions">
          {project.live && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="project-detail__btn-primary"
            >
              {t('project.viewLiveDemo')} <ArrowUpRight size={18} />
            </a>
          )}
          {project.githubLink && (
            <a
              href={project.githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="project-detail__btn-secondary"
            >
              <Github size={18} /> {t('project.viewOnGitHub')}
            </a>
          )}
        </div>
      </div>

      {/* Main 2-column grid */}
      <div className="project-detail__grid">
        {/* Left Column: Browser Mockup Showcase + Specs */}
        <div>
          <div className="project-mockup">
            <div className="project-mockup__header">
              <div className="project-mockup__dots">
                <span className="project-mockup__dot project-mockup__dot--red" />
                <span className="project-mockup__dot project-mockup__dot--yellow" />
                <span className="project-mockup__dot project-mockup__dot--green" />
              </div>
              <div className="project-mockup__address-bar">
                <Lock size={11} style={{ opacity: 0.7 }} />
                <span className="project-mockup__url">{cleanUrl}</span>
              </div>
              <div className="project-mockup__actions">
                {project.live && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="project-mockup__link-icon"
                    title={t('project.visitSite')}
                  >
                    <ExternalLink size={14} />
                  </a>
                )}
              </div>
            </div>
            <div className="project-mockup__screen">
              <img 
                src={project.image} 
                alt={project.imageAlt || t(project.titleKey)}
                className="project-mockup__img"
                loading="eager"
              />
            </div>
          </div>

          <div className="project-detail__specs-strip">
            <div className="project-detail__spec-card">
              <span className="project-detail__spec-label">{t('project.category')}</span>
              <span className="project-detail__spec-value">{project.category}</span>
            </div>
            <div className="project-detail__spec-card">
              <span className="project-detail__spec-label">{t('project.platform')}</span>
              <span className="project-detail__spec-value">{t('project.webApp')}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Deep-dive & Tech Stack */}
        <div className="project-detail__info-col">
          <div className="project-detail__card">
            <h2 className="project-detail__section-title">
              <Sparkles size={16} /> {t('project.overview')}
            </h2>
            <p className="project-detail__description">
              {t(project.descriptionKey)}
            </p>
          </div>

          <div className="project-detail__card">
            <h2 className="project-detail__section-title">
              <Layers size={16} /> {t('project.technologies')}
            </h2>
            <div className="project-detail__tech-list">
              {project.technologies.map((tech, idx) => (
                <span key={idx} className="project-detail__tech-pill">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation between Projects */}
      <nav className="project-detail__nav-footer" aria-label="Project Navigation">
        {prevProject && (
          <Link to={`/project/${prevProject.id}`} className="project-detail__nav-card project-detail__nav-card--prev">
            <div className="project-detail__nav-icon">
              <ChevronLeft size={20} />
            </div>
            <div className="project-detail__nav-content">
              <div className="project-detail__nav-sub">← {t('project.prevProject')}</div>
              <div className="project-detail__nav-name">{t(prevProject.titleKey)}</div>
            </div>
          </Link>
        )}

        {nextProject && (
          <Link to={`/project/${nextProject.id}`} className="project-detail__nav-card project-detail__nav-card--next">
            <div className="project-detail__nav-icon">
              <ChevronRight size={20} />
            </div>
            <div className="project-detail__nav-content">
              <div className="project-detail__nav-sub">{t('project.nextProject')} →</div>
              <div className="project-detail__nav-name">{t(nextProject.titleKey)}</div>
            </div>
          </Link>
        )}
      </nav>
    </main>
  );
}

export default ProjectDetail;
