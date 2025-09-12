# My Blog

This is a personal blog built with Hugo, using the Hugo Narrow theme.

## Features

- Responsive design
- Dark/light mode toggle
- Search functionality
- Table of contents
- Gallery support
- Multilingual support (i18n)

## Setup

### Prerequisites

- [Hugo](https://gohugo.io/getting-started/installing/) (extended version recommended)
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd myblog
   ```

2. Initialize the theme submodule:
   ```bash
   git submodule update --init --recursive
   ```

### Development

1. Start the Hugo development server:
   ```bash
   hugo server -D
   ```

2. Open your browser to `http://localhost:1313`

### Building

To build the site for production:

```bash
hugo --minify
```

The generated files will be in the `public/` directory.

## Configuration

Edit `hugo.toml` to customize your blog settings, including:
- Site title and description
- Author information
- Menu items
- Theme parameters

## Content

- Add new posts in `content/posts/`
- Static assets go in `static/`
- Theme customization in `assets/`

## Deployment

This site can be deployed to any static hosting service like:
- Netlify
- Vercel
- GitHub Pages
- AWS S3 + CloudFront

## License

[Add your license here]