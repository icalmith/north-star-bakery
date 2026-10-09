# North Star Bakery Interactive Features Implementation

## Goal
This project adds one meaningful interactive feature to improve the shopping experience: a product favorites tracker. It helps customers save items they want to reorder later, without requiring a full login system. The feature also includes form validation and browser storage so the experience feels more polished and user-friendly.

## Feature 1: Product Favorites Tracker

### User need
Customers often return to favorite bakery items such as their signature sourdough or favorite pastries. A favorites list helps them quickly identify products they want to buy again or compare later.

### Interaction behavior
- Users click the Favorite button on a product card.
- The button updates immediately to show the product is favorited.
- The favorites count updates dynamically.
- A filter button lets the user switch between viewing all products and only favorites.

### JavaScript structure
The implementation uses functions to organize behavior:
- `getStoredFavorites()` reads the saved array from localStorage.
- `saveFavorites()` saves the current favorites array.
- `toggleFavorite(productId)` adds or removes a product ID.
- `applyFavoriteState()` updates each button’s visual state.
- `hideNonFavorites()` hides non-favorite items when the filter is active.

### Data usage
The feature stores favorite product IDs in an array:
- Example: `["signature-sourdough", "pain-au-chocolat"]`
- This is saved in localStorage so the list persists across refreshes and browser sessions.

## Feature 2: Form Validation

### User need
Customers filling out the contact or pre-order form should get immediate feedback before submitting. This reduces confusion and prevents invalid submissions.

### Rules implemented
The validation checks:
- required fields such as name, email, request type, and item details
- email format
- minimum length for names and item descriptions
- pickup date is not in the past
- consent checkbox must be checked

### Error handling
When an input is invalid:
- the field receives a red border
- a message appears directly under the field
- the form is blocked from submitting until the issues are fixed

## Feature 3: Browser Storage

### Why it matters
The favorites list is stored using localStorage, which supports a meaningful user experience without requiring a backend database. Customers do not lose their selected favorites when the page refreshes.

### Data saved
The application stores only the product IDs that the customer favorites. This keeps the data lightweight and easy to manage.

## Summary
This feature is useful because it supports a real customer behavior: saving products they love and revisiting them later. It combines interaction, storage, and validation in a way that feels purposeful and practical for a bakery website.
