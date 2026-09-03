# Lavish Rahangdale — AI/ML & Full-Stack Portfolio

Personal portfolio for **Lavish Rahangdale**, an AI/ML & Full-Stack Developer focused on building practical machine-learning systems, real-time applications, and production-oriented web software.

## Live Portfolio

**Portfolio:** https://lavishrahangdale.vercel.app

> If the live deployment URL changes, update this link before sharing the repository publicly.

## What this project is

This portfolio is a React-based interactive personal site designed to showcase selected engineering work, technical skills, experience, and project case studies.

Rather than using a static template, the site combines a conventional React UI with lightweight motion and WebGL effects to create an interactive engineering-focused experience.

## Highlights

- Interactive React portfolio with responsive layouts
- Three.js / React Three Fiber neural-network visualisation
- Smooth scrolling with Lenis
- Framer Motion animations and micro-interactions
- Responsive navigation and mobile layouts
- Project case studies with problem → solution → architecture context
- Interactive experience / journey timeline
- Technical skill taxonomy across full-stack, ML, data, and DevOps
- Reduced-motion and visibility-aware handling for animated backgrounds
- Dark graphite visual system with restrained amber accents

## Tech Stack

| Area | Technologies |
| --- | --- |
| Frontend | React, JavaScript, HTML5, CSS3 |
| Motion | Framer Motion, Lenis |
| 3D / WebGL | Three.js, React Three Fiber |
| Icons | Lucide React |
| Build | Vite |
| Deployment | Vercel |

## Featured Work

### Interview Copilot AI
Real-time AI interview practice platform using React, Node.js, Socket.io, and Gemini API.

**Focus:** real-time communication, low-latency AI interaction, modular backend architecture.

### AURA AI
Multimodal recommendation application combining facial-expression signals and text-based analysis.

**Focus:** computer vision, NLP, feature fusion, and user-aware recommendations.

### SRRIS
Stroke Risk & Recovery Intelligence System combining imaging, extracted text, and structured data for AI-assisted risk assessment.

**Focus:** ML ensembles, computer vision, OCR/NLP pipelines, and decision-support workflows.

### Additional Projects

- **VoteChain** — blockchain-based e-voting system
- **ProLab Equipment** — laboratory inventory and booking platform
- **Trader Behavior Insights** — sentiment and trading-behavior analytics

## Project Structure

```text
src/
├── components/      # Reusable UI, animation and visual components
├── data/            # Portfolio content and project data
├── sections/        # Main portfolio sections
├── App.jsx          # Application composition
└── main.jsx         # React entry point
```

## Run Locally

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
git clone https://github.com/Lavish911/portfolioo.git
cd portfolioo
npm install
npm run dev
```

The development server will print the local URL in the terminal.

### Production build

```bash
npm run build
```

### Preview the production build

```bash
npm run preview
```

## Design Direction

The visual system intentionally uses a restrained palette:

- Black / graphite backgrounds
- Warm white typography
- Amber as the primary accent
- Monospace typography for selected technical details

The site keeps motion and WebGL effects purposeful rather than making the portfolio itself the visual gimmick.

## Performance & Accessibility Considerations

The interactive background and WebGL layers are implemented with several safeguards, including reduced-motion handling and visibility-aware animation behavior. The interface is also designed to remain usable across desktop and mobile screen sizes.

## Author

**Lavish Rahangdale**  
AI/ML & Full-Stack Developer  
Nagpur, India

- GitHub: https://github.com/Lavish911
- LinkedIn: https://linkedin.com/in/lavish-rahangdale
- Email: lavishr213@gmail.com

## License

This repository is a personal portfolio project. Unless otherwise stated, the source code and original design/content are not licensed for reuse as a personal portfolio template.