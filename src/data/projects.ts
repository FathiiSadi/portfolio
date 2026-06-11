import type { Project } from '../types';

import qalamLogo from '../assets/images/projects/qalam-logo.jpeg';
import qalamBg from '../assets/images/projects/qalam-background.png';
import fruitsLogo from '../assets/images/projects/fruits-shops-logo.png';
import fruitsBg from '../assets/images/projects/fruits-shop-background.png';
import atharLogo from '../assets/images/projects/athar-logo.png';
import atharBg from '../assets/images/projects/athar-background.png';
import amalLogo from '../assets/images/projects/amal.png';
import amalBg from '../assets/images/projects/amal-background.png';

export interface PortfolioProject extends Project {
  year: string;
}

export const projectsData: PortfolioProject[] = [
  {
    id: 'qalam',
    title: 'Qalam',
    year: '2025',
    description:
      'An intelligent academic scheduling system that automates instructor and course section assignments using rule-based logic and institutional constraints.',
    detailedDescription:
      'Qalam is a comprehensive scheduling system built to automate the assignment of university course sections to instructors fairly and efficiently. The system applies structured academic rules including instructor availability, section limits, course capacities, and priority ordering. Using deterministic scheduling logic instead of random assignment, it generates repeatable and explainable timetables while preventing conflicts. An admin panel built with Filament enables full control over rules, instructors, courses, and sections. The architecture emphasizes modular backend design, validation layers, and scalable frontend workflows.',
    logo: qalamLogo,
    technologies: ['Laravel', 'PHP', 'MySQL', 'FilamentPHP', 'Vite', 'Bootstrap 5', 'Scheduling Algorithms'],
    category: 'Academic Systems · Scheduling · Web Application',
    links: {},
    images: [qalamBg],
    backgroundImage: qalamBg,
    videoUrl: 'https://drive.google.com/file/d/1B2pfat2WSClWp6WAu8YBUPci4rJJTt-r/view?usp=sharing',
  },
  {
    id: 'amal',
    title: 'Amal',
    year: '2025',
    description:
      'A Retrieval-Augmented Generation (RAG) powered AI historian focused on Palestinian history and cultural preservation.',
    detailedDescription:
      'Amal is an AI-powered digital historian built using a Retrieval-Augmented Generation (RAG) architecture. Instead of relying solely on general model knowledge, it retrieves relevant passages from a curated historical source document and generates grounded responses. The system integrates vector embeddings, semantic similarity search, and large language model orchestration to ensure accurate, context-aware answers. It features an interactive chat interface, topic management system using SQLite, and a culturally themed UI. The architecture separates embedding, retrieval, and generation layers for transparency and extensibility.',
    logo: amalLogo,
    technologies: ['Python', 'Streamlit', 'LangChain', 'Google Gemini API', 'FAISS', 'HuggingFace Embeddings', 'SQLite', 'RAG Architecture'],
    category: 'Artificial Intelligence · RAG Systems · Educational Technology',
    links: {},
    images: [amalBg],
    backgroundImage: amalBg,
    videoUrl: 'https://drive.google.com/file/d/16kV6_1w0VrZxXE-47TX371KJ0dilsHYN/view?usp=sharing',
  },
  {
    id: 'frutia',
    title: 'FRUTIA',
    year: '2024',
    description:
      'A full-stack e-commerce platform for selling fresh produce online with secure payments and performance optimization.',
    detailedDescription:
      'FRUTIA is a full-featured e-commerce web application designed for online fruit sales. The system includes product browsing, category management, cart functionality, secure checkout, and order confirmation via email. Security features include CAPTCHA protection and cookie-based session handling. Performance optimizations such as caching were implemented to enhance responsiveness. Payments are integrated using Checkout.com sandbox APIs for secure transaction simulation. The project follows MVC architecture using Yii2 to maintain clean separation between logic and presentation.',
    logo: fruitsLogo,
    technologies: ['Yii2', 'PHP', 'MySQL', 'Bootstrap 5', 'Checkout.com API', 'Caching', 'Cookies', 'CAPTCHA'],
    category: 'E-Commerce · Web Security · Payment Integration',
    links: {},
    images: [fruitsBg],
    backgroundImage: fruitsBg,
  },
  {
    id: 'athar',
    title: 'Athar',
    year: '2023',
    description:
      'A custom-built blogging platform developed from scratch in PHP to deeply understand backend fundamentals.',
    detailedDescription:
      'Athar is a blogging platform built using core PHP without relying on frameworks. Core backend features such as routing, pagination, authentication, and email handling were implemented manually to gain low-level understanding of web architecture. The system integrates cron jobs and queue processing for background tasks such as scheduled emails. Mailtrap was used for safe email testing during development. The project demonstrates strong backend fundamentals, structured code organization, and system-level thinking.',
    logo: atharLogo,
    technologies: ['PHP (Vanilla)', 'MySQL', 'Bootstrap 5', 'Cron Jobs', 'Queue System', 'Mailtrap', 'Custom Routing', 'Pagination'],
    category: 'Content Platform · Backend Engineering',
    links: {},
    images: [atharBg],
    backgroundImage: atharBg,
  },
];
