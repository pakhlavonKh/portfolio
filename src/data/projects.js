import ecolife from '/assets/ecolife.webp';
import mazzo from '/assets/mazzo.webp';
import medicare from '/assets/medicare.png';
import manaku from '/assets/manaku.png';
import pitstop from '/assets/pitstop.png';
import modulbino from '/assets/modulbino.png';
import invito from '/assets/invito.png';
import leaf from '/assets/leaf.png';
import english from '/assets/english.png';

export const projects = [
  {
    id: 1,
    titleKey: 'works.project1.title',
    descriptionKey: 'works.project1.description',
    shortDescriptionKey: 'works.project1.shortDescription',
    image: ecolife,
    imageAlt: 'project1',
    link: 'https://eco-life-etiqod.com/',
    githubLink: 'https://github.com/pakhlavonKh/ecoLife',
    live: true,
    technologies: ['HTML', 'CSS', 'JavaScript', 'React'],
    category: 'Web Design'
  },
  {
    id: 2,
    titleKey: 'works.project2.title',
    descriptionKey: 'works.project2.description',
    shortDescriptionKey: 'works.project2.shortDescription',
    image: mazzo,
    imageAlt: 'project2',
    link: 'https://mazzo-premium.netlify.app/',
    githubLink: 'https://github.com/pakhlavonKh/mazzo-premium',
    live: true,
    technologies: ['HTML', 'CSS', 'JavaScript', 'React'],
    category: 'E-commerce'
  }, 
  {
    id: 3,
    titleKey: 'works.project3.title',
    descriptionKey: 'works.project3.description',
    shortDescriptionKey: 'works.project3.shortDescription',
    image: medicare,
    imageAlt: 'project3',
    link: 'https://medicare.uz/uz',
    githubLink: 'https://github.com/mukhsinus/medical_care',
    live: true,
    technologies: ['HTML', 'CSS', 'JavaScript', 'React'],
    category: 'Healthcare'
  },
  {
    id: 4,
    titleKey: 'works.project4.title',
    descriptionKey: 'works.project4.description',
    shortDescriptionKey: 'works.project4.shortDescription',
    image: manaku,
    imageAlt: 'project4',
    link: 'https://lux-furniture-demo.netlify.app/',
    githubLink: 'https://github.com/pakhlavonKh/lux-furniture',
    live: true,
    technologies: ['HTML', 'CSS', 'JavaScript', 'React'],
    category: 'E-commerce'
  },
  {
    id: 5,
    titleKey: 'works.project5.title',
    descriptionKey: 'works.project5.description',
    shortDescriptionKey: 'works.project5.shortDescription',
    image: pitstop,
    imageAlt: 'project5',
    link: 'https://pitstop-one.netlify.app/',
    githubLink: 'https://github.com/pakhlavonKh/autodealer',
    live: true,
    technologies: ['HTML', 'CSS', 'JavaScript', 'React'],
    category: 'Automotive'
  },
  {
    id: 6,
    titleKey: 'works.project6.title',
    descriptionKey: 'works.project6.description',
    shortDescriptionKey: 'works.project6.shortDescription',
    image: modulbino,
    imageAlt: 'project6',
    link: 'https://modulbino.netlify.app/',
    githubLink: 'https://github.com/pakhlavonKh/module-homes',
    live: true,
    technologies: ['HTML', 'CSS', 'JavaScript', 'React'],
    category: 'Landing Page'
  },
  {
    id: 7,
    titleKey: 'works.project7.title',
    descriptionKey: 'works.project7.description',
    shortDescriptionKey: 'works.project7.shortDescription',
    image: invito,
    imageAlt: 'project7',
    link: 'https://invito.live',
    githubLink: 'https://github.com/pakhlavonKh/priglashenie_uz',
    live: true,
    technologies: ['HTML', 'CSS', 'JavaScript', 'React'],
    category: 'Event Management'
  }, 
  {
    id: 8,
    titleKey: 'works.project8.title',
    descriptionKey: 'works.project8.description',
    shortDescriptionKey: 'works.project8.shortDescription',
    image: leaf,
    imageAlt: 'project8',
    githubLink: 'https://github.com/pakhlavonKh/local-sustainable-green-marketplace',
    live: false,
    technologies: ['HTML', 'CSS', 'JavaScript', 'PHP'],
    category: 'Sustainability'
  },
  {
    id: 9,
    titleKey: 'works.project9.title',
    descriptionKey: 'works.project9.description',
    shortDescriptionKey: 'works.project9.shortDescription',
    image: english,
    imageAlt: 'project9',
    githubLink: 'https://github.com/pakhlavonKh/adaptive-english-learning',
    live: false,
    technologies: ['HTML', 'CSS', 'JavaScript', 'React'],
    category: 'Education'
  }
];
