+++
title = 'Hugo Theme Customization'
date = '2025-09-15T16:45:00+05:30'
draft = false
categories = ["Tutorial", "Design"]
tags = ["Hugo", "Themes", "CSS", "JavaScript", "Customization"]
+++

# Hugo Theme Customization

The Hugo Narrow theme is highly customizable. Let's explore how to modify and extend the theme to match your specific needs and branding.

## Theme Structure

Understanding the theme structure is key to customization:

```
themes/hugo-narrow/
├── layouts/          # Template files
├── assets/           # SCSS, JS, and other assets
├── static/           # Static files (images, fonts)
├── data/             # Data files
└── i18n/             # Internationalization
```

## Customizing Colors

The theme supports multiple color schemes. You can add your own:

```scss
// assets/scss/custom.scss
:root {
  --primary-color: #your-color;
  --secondary-color: #your-color;
  --text-color: #your-color;
  --background-color: #your-color;
}
```

## Adding Custom CSS

Create custom styles in `assets/scss/custom.scss`:

```scss
// Custom styles
.hero-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.custom-button {
  border-radius: 8px;
  transition: all 0.3s ease;
}

.custom-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}
```

## Custom JavaScript

Add custom functionality in `assets/js/custom.js`:

```javascript
// Custom JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize custom features
    initCustomFeatures();
});

function initCustomFeatures() {
    // Add smooth scrolling
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', smoothScroll);
    });
}

function smoothScroll(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}
```

## Overriding Templates

Create custom layouts in your site's `layouts/` directory:

```
layouts/
├── _default/
│   ├── baseof.html
│   ├── single.html
│   └── list.html
├── partials/
│   ├── header.html
│   └── footer.html
└── posts/
    └── single.html
```

## Performance Considerations

When customizing your theme:

- Minimize CSS and JavaScript
- Optimize images
- Use Hugo's asset pipeline
- Enable caching headers
- Test across devices

## Best Practices

- Keep customizations organized
- Document your changes
- Test thoroughly
- Use version control
- Plan for updates

Theme customization allows you to create a unique site while maintaining the benefits of a well-structured theme. The Hugo Narrow theme provides an excellent foundation for customization.