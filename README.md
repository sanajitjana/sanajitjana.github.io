# Sanajit Jana's Personal Website

[![Hugo](https://img.shields.io/badge/Hugo-0.120+-blue.svg)](https://gohugo.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub Pages](https://img.shields.io/badge/Hosted%20on-GitHub%20Pages-blue.svg)](https://sanajitjana.github.io/)

## 🌟 Overview

Welcome to my personal portfolio and blog website! This site showcases my journey as a Full Stack Software Developer specializing in Java, Spring Boot, and Microservices. I build scalable and high-performance web applications using technologies like MySQL, PostgreSQL, Kafka, Docker, and AWS.

The website features a clean, modern design powered by Hugo and the Hugo Narrow theme, with sections dedicated to my work experience, projects, and technical blog posts covering various topics in software development.

**Live Site:** [https://sanajitjana.github.io/](https://sanajitjana.github.io/)

## ✨ Features

- **Responsive Design**: Optimized for all devices with a mobile-first approach
- **Dark/Light Mode**: Built-in theme switcher with multiple color schemes
- **Fast Performance**: Static site generation with Hugo for blazing-fast load times
- **SEO Optimized**: Meta tags, structured data, and search engine friendly
- **Blog Section**: Technical posts on modern development topics including:
  - Hugo and Static Site Generation
  - React Hooks and Frontend Development
  - AWS Cloud Computing
  - Docker and Containerization
  - DevOps and CI/CD Pipelines
  - Microservices Architecture
  - Database Design and SQL Optimization
  - API Design and RESTful Services
  - Cybersecurity and Secure Coding
  - Machine Learning Fundamentals
  - Mobile App Development with React Native
- **Portfolio Sections**: Work experience and personal projects showcase
- **Social Integration**: LinkedIn, GitHub, and email contact links
- **PWA Ready**: Progressive Web App manifest for app-like experience
- **Accessibility**: WCAG compliant design and navigation

## 🛠️ Tech Stack

- **Static Site Generator**: [Hugo](https://gohugo.io/) (v0.120+)
- **Theme**: [Hugo Narrow](https://github.com/tom2almighty/hugo-narrow) (submodule)
- **Content**: Markdown with Goldmark extensions
- **Styling**: CSS with multiple theme variants
- **JavaScript**: Vanilla JS for interactive features
- **Icons**: Custom SVG icon set
- **Deployment**: GitHub Pages
- **Version Control**: Git with GitHub

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Hugo Extended** (v0.120 or later): [Installation Guide](https://gohugo.io/getting-started/installing/)
- **Git**: For cloning and version control
- **Go** (optional): For Hugo development

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/sanajitjana/sanajitjana.github.io.git
   cd sanajitjana.github.io
   ```

2. **Initialize submodules** (for the Hugo Narrow theme):
   ```bash
   git submodule update --init --recursive
   ```

3. **Install dependencies** (if any):
   ```bash
   # No additional dependencies required for basic Hugo sites
   ```

## 🏗️ Building and Running Locally

1. **Start the development server:**
   ```bash
   hugo server -D
   ```

2. **Open your browser** and navigate to `http://localhost:1313/`

3. **Build for production:**
   ```bash
   hugo --minify
   ```

The generated static files will be in the `public/` directory.

### Development Commands

- `hugo server`: Start development server with live reload
- `hugo server -D`: Include draft content in development
- `hugo --minify`: Build optimized production files
- `hugo --gc`: Build with garbage collection for smaller output

## 📝 Content Management

### Adding Blog Posts

1. Create a new Markdown file in `content/posts/`:
   ```bash
   hugo new posts/your-post-title.md
   ```

2. Edit the front matter and content in the generated file

### Adding Pages

1. Create content files in `content/` directory
2. Use archetypes for consistent front matter: `hugo new your-page.md`

### Custom Layouts

- Modify layouts in `layouts/` directory
- Override theme layouts by placing files in corresponding paths

## 🚀 Deployment

This site is automatically deployed to GitHub Pages using GitHub Actions.

### Manual Deployment

1. **Build the site:**
   ```bash
   hugo --minify
   ```

2. **Deploy to GitHub Pages:**
   - Push the `public/` directory contents to the `gh-pages` branch, or
   - Use GitHub Actions for automated deployment

### GitHub Pages Setup

The repository includes:
- `.nojekyll` file to bypass Jekyll processing
- GitHub Actions workflow for automated builds (if configured)

## 🤝 Contributing

While this is primarily a personal portfolio site, contributions for bug fixes, improvements, or feature suggestions are welcome!

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

**Content License**: Blog posts and articles are licensed under [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/).

## 📞 Contact

**Sanajit Jana**
- **Email**: sanajitjana01@gmail.com
- **LinkedIn**: [linkedin.com/in/sanajitjana01](https://linkedin.com/in/sanajitjana01)
- **GitHub**: [github.com/sanajitjana](https://github.com/sanajitjana)
- **Website**: [https://sanajitjana.github.io/](https://sanajitjana.github.io/)

## 🙏 Acknowledgments

- **Hugo Narrow Theme**: Thanks to the creators of the beautiful Hugo Narrow theme
- **Hugo Community**: For the amazing static site generator
- **Open Source**: All the libraries and tools that make this possible

---

*Built with ❤️ using Hugo and hosted on GitHub Pages*