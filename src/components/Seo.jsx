import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { projects } from '../data/projects';

const SITE_NAME = 'Pakhlavon Khamidov';
const DEFAULT_IMAGE = 'https://pakhlavon.dev/assets/preview.png';

function ensureMetaTag(name, content, attr = 'name') {
  const selector = `meta[${attr}="${name}"]`;
  const existing = document.head.querySelector(selector);

  if (existing) {
    existing.setAttribute('content', content);
    return;
  }

  const tag = document.createElement('meta');
  tag.setAttribute(attr, name);
  tag.setAttribute('content', content);
  document.head.appendChild(tag);
}

function ensureLink(rel, href) {
  const existing = document.head.querySelector(`link[rel="${rel}"]`);

  if (existing) {
    existing.setAttribute('href', href);
    return;
  }

  const link = document.createElement('link');
  link.setAttribute('rel', rel);
  link.setAttribute('href', href);
  document.head.appendChild(link);
}

export default function Seo() {
  const location = useLocation();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const pathname = location.pathname || '/';
    const origin = window.location.origin;
    const canonicalUrl = `${origin}${pathname === '/' ? '' : pathname}`;
    const lang = (i18n.language || 'en').split('-')[0];
    const direction = ['ar', 'he', 'fa', 'ur'].includes(lang) ? 'rtl' : 'ltr';

    let title = t('seo.home.title', { siteName: SITE_NAME });
    let description = t('seo.home.description');
    let type = 'website';

    if (pathname.startsWith('/about')) {
      title = t('seo.about.title', { siteName: SITE_NAME });
      description = t('seo.about.description');
    } else if (pathname.startsWith('/portfolio')) {
      title = t('seo.portfolio.title', { siteName: SITE_NAME });
      description = t('seo.portfolio.description');
    } else if (pathname.startsWith('/contact')) {
      title = t('seo.contact.title', { siteName: SITE_NAME });
      description = t('seo.contact.description');
    } else if (pathname.startsWith('/project/')) {
      const projectId = pathname.split('/').pop();
      const project = projects.find((item) => String(item.id) === projectId);

      if (project) {
        const projectTitle = t(project.titleKey);
        title = t('seo.project.title', { project: projectTitle, siteName: SITE_NAME });
        description = `${t(project.descriptionKey).slice(0, 155)}...`;
        type = 'article';
      }
    }

    document.title = title;
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', direction);

    ensureMetaTag('description', description);
    ensureMetaTag('keywords', t('seo.keywords'));
    ensureMetaTag('author', SITE_NAME);
    ensureMetaTag('robots', 'index, follow');

    ensureMetaTag('og:title', title, 'property');
    ensureMetaTag('og:description', description, 'property');
    ensureMetaTag('og:type', type, 'property');
    ensureMetaTag('og:url', canonicalUrl, 'property');
    ensureMetaTag('og:image', DEFAULT_IMAGE, 'property');
    ensureMetaTag('og:site_name', SITE_NAME, 'property');

    ensureMetaTag('twitter:card', 'summary_large_image', 'name');
    ensureMetaTag('twitter:title', title, 'name');
    ensureMetaTag('twitter:description', description, 'name');
    ensureMetaTag('twitter:image', DEFAULT_IMAGE, 'name');

    ensureLink('canonical', canonicalUrl);
    ensureLink('alternate', canonicalUrl);
  }, [location.pathname, i18n.language, t]);

  return null;
}
