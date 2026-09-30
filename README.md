# North Star Bakery Website

A semantic HTML website for North Star Bakery, a neighborhood bakery promoting handmade bread, pastries, and custom cakes.

## Pages

- **index.html** - Home page with welcome message, bakery highlights, featured item, and hours
- **products.html** - Product catalog featuring breads, pastries, and cakes with pricing
- **about.html** - Bakery story, sourcing philosophy, staff highlights, and community commitment
- **contact.html** - Contact information, hours, location, and pre-order/inquiry form

## Features

### Semantic HTML
- Each page includes `<header>`, `<nav>`, `<main>`, and `<footer>` elements
- One `<h1>` heading per page
- Consistent navigation using relative paths

### Media Elements
- Logo and product images with meaningful alt text (signature loaf, storefront)
- `<figure>` element with caption for Signature Loaf (index.html)
- `<picture>` element for responsive storefront image (products.html)
- Audio element with fallback text for welcome message (index.html)

### Form
The contact page includes a complete pre-order/inquiry form with:
- Name field (required)
- Email field (required)
- Phone number field
- Pickup date field (required)
- Request type dropdown (required) - options: pre-order, custom order, general question, catering
- Item details textarea (required)
- Allergy notes textarea
- Consent checkbox (required)
- Submit and reset buttons
- Proper labels, fieldset, legend, and built-in validation attributes

## File Structure

```
north-star-bakery/
├── index.html
├── products.html
├── about.html
├── contact.html
├── README.md
├── images/
│   ├── logo.svg
│   ├── signature-loaf.jpg
│   ├── storefront-full.jpg
│   ├── storefront-medium.jpg
│   └── storefront-small.jpg
└── media/
    └── welcome-message.mp3
```

## Notes

- No CSS or JavaScript included (pure semantic HTML)
- All form inputs include built-in HTML validation
- Image sources reference provided media files
- Audio file provides welcome message from the baking team
