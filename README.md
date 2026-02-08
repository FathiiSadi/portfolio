# Fathi Al-Saadi - Developer Portfolio

<div align="center">

**Modern, Animated, High-Performance Portfolio**

A technical portfolio showcasing software engineering expertise through interactive 3D visuals and smooth animations.

[Live Demo](#) • [Report Issue](#) • [Request Feature](#)

</div>

---

## ✨ Features

- 🎨 **3D Animated Loading Screen** - Rotating geometric cubes with Three.js
- 🌐 **Interactive Hero Section** - Wireframe sphere with particle system
- 📊 **Animated Statistics** - Real-time counter animations
- 🎯 **Horizontal Scroll Services** - GSAP-powered smooth scrolling
- 💼 **Project Showcase** - Featured work with technology stacks
- 🧩 **Competitive Programming** - Algorithm strength visualization
- 📱 **Fully Responsive** - Optimized for all devices
- ⚡ **Performance Optimized** - Hardware-accelerated animations

## 🛠️ Tech Stack

### Core
- **[Vite](https://vitejs.dev/)** - Next-generation frontend tooling
- **[React 18](https://react.dev/)** - UI library
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development

### Animation & 3D
- **[Three.js](https://threejs.org/)** - WebGL 3D graphics library
- **[GSAP](https://greensock.com/gsap/)** - Professional animation platform
- **[ScrollTrigger](https://greensock.com/scrolltrigger/)** - Scroll-based animations

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
# Clone the repository
git clone https://github.com/fathi-alsadi/fathi-portfolio.git

# Navigate to directory
cd fathi-portfolio

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📦 Build & Deploy

### Production Build
```bash
npm run build
```

Output will be in the `dist/` directory, ready for deployment to any static hosting service.

### Type Checking
```bash
npm run type-check
```

## 🎨 Color Palette

The portfolio uses a strict, modern color palette:

| Color | Hex | Usage |
|-------|-----|-------|
| Background | `#0F172A` | Main background, footer |
| Primary Blue | `#3B82F6` | Accents, buttons, links |
| Secondary Purple | `#A78BFA` | Gradients, highlights |
| Text Light | `#F8FAFC` | Primary text |
| Border Gray | `#94A3B8` | Borders, secondary text |

## 📂 Project Structure

```
fathi-portfolio/
├── src/
│   ├── components/          # React components
│   │   ├── LoadingScreen.tsx
│   │   ├── Hero.tsx
│   │   ├── About.tsx
│   │   ├── Skills.tsx
│   │   ├── Projects.tsx
│   │   ├── CompetitiveProgramming.tsx
│   │   └── Footer.tsx
│   ├── utils/              # Utility functions
│   │   ├── three.ts        # Three.js helpers
│   │   └── animations.ts   # GSAP helpers
│   ├── types/              # TypeScript types
│   ├── styles/             # Global styles
│   ├── App.tsx             # Main app component
│   └── main.tsx            # Entry point
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 🎯 Sections

### 1. Loading Screen
3D rotating cubes with animated progress bar that seamlessly transitions to the main content.

### 2. Hero
Full-screen section featuring:
- Interactive 3D wireframe sphere
- Particle system (1500 particles)
- Mouse-following camera
- Gradient animated background

### 3. About
Professional introduction with:
- Animated statistics cards
- System thinking narrative
- Floating geometric shapes

### 4. Skills/Services
Horizontal scrolling showcase of:
- Application Development
- System Design
- Performance Optimization
- Problem Solving

### 5. Projects
Featured projects with detailed cards:
- **Qalam** - Automated scheduling system
- **FruitsShop** - E-commerce platform
- **Athar** - Content management blog

### 6. Competitive Programming
Codeforces-inspired section with:
- Animated stat counters
- Progress bars for algorithmic skills
- Direct link to profile

### 7. Footer
Minimal design with centered branding.

## ⚙️ Configuration

### Updating Content

**Social Media Links** - [`src/components/Hero.tsx`](src/components/Hero.tsx#L76-L88)
```tsx
<a href="YOUR_GITHUB_URL" ...>
<a href="YOUR_LINKEDIN_URL" ...>
<a href="YOUR_TWITTER_URL" ...>
```

**Competitive Programming** - [`src/components/CompetitiveProgramming.tsx`](src/components/CompetitiveProgramming.tsx#L14-L16)
```tsx
animateCounter(ratingRef.current, YOUR_RATING, ...);
animateCounter(solvedRef.current, YOUR_PROBLEMS_SOLVED, ...);
```

**Projects** - [`src/components/Projects.tsx`](src/components/Projects.tsx#L13-L43)
```tsx
const projectsData: Project[] = [
  // Update with your actual projects
];
```

## 🌐 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
# Drag & drop 'dist' folder to Netlify
```

### GitHub Pages
```bash
npm install -g gh-pages
npm run build
gh-pages -d dist
```

## 📊 Performance

- **Bundle Size**: 234.66 KB (gzipped)
- **Lighthouse Score**: 90+ (Performance)
- **Frame Rate**: 60fps (3D animations)
- **First Load**: < 3s on fast connection

## 🤝 Contributing

While this is a personal portfolio, suggestions and feedback are welcome!

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**Fathi Al-Saadi**

- 🎓 Computer Science Student @ Al-Hussein Technical University (HTU)
- 💼 Software Engineer @ AtTubi
- 💻 Full-Stack Web Developer @ TechQueen
- 🏆 Competitive Programmer @ Codeforces

## 🙏 Acknowledgments

- [Three.js](https://threejs.org/) for 3D graphics capabilities
- [GSAP](https://greensock.com/) for professional animations
- [Vite](https://vitejs.dev/) for blazing-fast development

---

<div align="center">

**Built with ❤️ and TypeScript**

⭐ Star this repo if you found it helpful!

</div>
