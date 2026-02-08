// TypeScript type definitions for Portfolio

export interface Project {
    id: string;
    title: string;
    description: string;
    detailedDescription?: string;
    logo?: string;
    images?: string[];
    videoUrl?: string;
    technologies: string[];
    category: string;
    links: {
        demo?: string;
        github?: string;
        case_study?: string;
    };
    backgroundImage?: string;
}

export interface Skill {
    name: string;
    icon?: string;
    category: 'frontend' | 'backend' | 'tools' | 'other';
}

export interface Service {
    title: string;
    description: string;
    icon: string;
}

export interface CompetitiveProgrammingStats {
    platform: string;
    handle: string;
    rating: number;
    maxRating: number;
    rank: string;
    problemsSolved: number;
    contests: number;
}

export interface SocialLink {
    name: string;
    url: string;
    icon: string;
}
