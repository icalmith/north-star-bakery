# North Star Bakery Website

A fully responsive, semantic HTML website for North Star Bakery with professional styling and media elements.

## 📄 Pages

- **index.html** - Home page with welcome, highlights, featured video, and hours
- **products.html** - Product catalog (breads, pastries, cakes) with pricing
- **about.html** - Bakery story, sourcing, team, and community commitment
- **contact.html** - Hours, location, contact form, and catering info

## ✅ Features Implemented

### Semantic HTML Structure
- ✓ One `<h1>` per page
- ✓ `<header>`, `<nav>`, `<main>`, `<footer>` on each page
- ✓ Consistent navigation with relative paths
- ✓ Semantic elements: `<section>`, `<article>`, `<figure>`, `<figcaption>`

### Media Elements
- ✓ SVG logo on all pages
- ✓ `<video>` element with fallback text (Featured Item section)
- ✓ `<audio>` element with fallback text (Behind the Scenes)
- ✓ `<picture>` element for responsive images (Products page)
- ✓ Meaningful alt text on all images

### Complete Contact Form
- ✓ Name (required, text)
- ✓ Email (required, email validation)
- ✓ Phone (optional, tel)
- ✓ Pickup Date (required, date picker)
- ✓ Request Type dropdown (required)
- ✓ Item Details textarea (required)
- ✓ Allergy Notes textarea (optional)
- ✓ Consent checkbox (required)
- ✓ Submit and Reset buttons
- ✓ Proper labels, fieldset, and legend

### Professional Styling
- ✓ Warm bakery color palette (browns, tans, cream)
- ✓ Responsive design (mobile, tablet, desktop)
- ✓ Smooth transitions and hover effects
- ✓ Accessible form inputs with focus states
- ✓ Sticky navigation bar

## 📁 Directory Structure

```
north-star-bakery/
├── index.html
├── products.html
├── about.html
├── contact.html
├── styles.css
├── README.md
├── media/
│   ├── bakery-video.mp4        (to be uploaded)
│   └── welcome-message.mp3     (to be uploaded)
```

## 🎬 Upload Your Media

To add your video and audio:

1. Go to: https://github.com/icalmith/north-star-bakery/upload/main
2. Create a `media` folder
3. Upload:
   - `bakery-video.mp4` - Your bakery/sourdough video
   - `welcome-message.mp3` - Audio welcome from the team

## 🌐 View Live

Your site is deployed on GitHub Pages:
**https://icalmith.github.io/north-star-bakery/**

## 📝 Notes

- All form inputs include HTML5 validation attributes
- No JavaScript required (uses native HTML form validation)
- Images use embedded SVG placeholders until real images are uploaded
- Video and audio paths reference the `media/` folder
- Fully accessible with proper semantic markup
