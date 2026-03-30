import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { projects } from '../data/projects';
import { ArrowUpRight, Github } from 'lucide-react';

function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const project = projects.find(p => p.id === parseInt(id));

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!project) {
    return (
      <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '2rem' }}>Project not found</h1>
        <button 
          onClick={() => navigate('/portfolio')}
          style={{
            padding: '1rem 2rem',
            fontSize: '1.5rem',
            border: '2px solid var(--accent)',
            color: 'var(--accent)',
            background: 'transparent',
            borderRadius: '0.5rem',
            cursor: 'pointer'
          }}
        >
          Back to Portfolio
        </button>
      </main>
    );
  }

  return (
    <main style={{ padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <button 
        onClick={() => navigate('/portfolio')}
        style={{
          background: 'transparent',
          border: 'none',
          color: 'var(--accent)',
          fontSize: '1.5rem',
          cursor: 'pointer',
          marginBottom: '2rem',
          padding: 0
        }}
      >
        ← Back to Portfolio
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'start' }}>
        <div>
          <img 
            src={project.image} 
            alt={project.imageAlt}
            style={{ width: '100%', borderRadius: '1.5rem', objectFit: 'cover' }}
          />
          {project.live && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                marginTop: '2rem',
                padding: '1rem 2rem',
                background: 'var(--accent)',
                color: '#0f172a',
                textDecoration: 'none',
                borderRadius: '0.5rem',
                fontWeight: '600',
                fontSize: '1.2rem',
                cursor: 'pointer',
                marginRight: '1rem'
              }}
            >
              View Live Demo <ArrowUpRight style={{ display: 'inline', marginLeft: '0.5rem' }} size={20} />
            </a>
          )}
          {project.githubLink && (
            <a
              href={project.githubLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                marginTop: '2rem',
                padding: '1rem 2rem',
                background: 'transparent',
                border: '2px solid var(--accent)',
                color: 'var(--accent)',
                textDecoration: 'none',
                borderRadius: '0.5rem',
                fontWeight: '600',
                fontSize: '1.2rem',
                cursor: 'pointer'
              }}
            >
              <Github style={{ display: 'inline', marginRight: '0.5rem' }} size={20} /> View on GitHub
            </a>
          )}
        </div>

        <div>
          <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color: 'var(--accent)' }}>
            {t(project.titleKey)}
          </h1>
          
          <p style={{ fontSize: '1.6rem', lineHeight: '1.8', marginBottom: '2rem', color: '#ccc' }}>
            {t(project.descriptionKey)}
          </p>

          <div style={{ marginTop: '2rem' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--accent)' }}>Technologies</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
              {project.technologies.map((tech, idx) => (
                <span
                  key={idx}
                  style={{
                    padding: '0.5rem 1rem',
                    background: 'rgba(100, 255, 218, 0.1)',
                    border: '1px solid var(--accent)',
                    borderRadius: '0.5rem',
                    color: 'var(--accent)',
                    fontSize: '1.2rem'
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div style={{ marginTop: '3rem' }}>
            <p style={{ fontSize: '1.3rem', color: '#999' }}>
              <strong>Category:</strong> {project.category}
            </p>
            <p style={{ fontSize: '1.3rem', color: '#999', marginTop: '1rem' }}>
              <strong>Status:</strong> {project.live ? '🟢 Live' : '🔵 In Development'}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default ProjectDetail;
