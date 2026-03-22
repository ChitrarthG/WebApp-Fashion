# Configuration Guide

## Google Maps Feature

The Google Maps feature can be easily enabled or disabled through environment configuration.

### To Disable Google Maps
Set the following in `frontend/.env`:
```env
REACT_APP_MAPS_ENABLED=false
```

## Branding

- `Vayu Clinic` is used as the site name.
- Update `frontend/src/components/Hero.js`, `Footer.js`, and `Header.js` to change labels and contact details as needed.

### To Enable Google Maps
Set the following in `frontend/.env`:
```env
REACT_APP_MAPS_ENABLED=true
```

### Requirements for Google Maps
When enabled, make sure you have:
1. A valid Google Maps API key in `REACT_APP_GOOGLE_MAPS_API_KEY`
2. The Maps Embed API enabled in your Google Cloud Console
3. Restart the frontend application after changes

### Default Behavior
- Maps are **disabled** by default (`REACT_APP_MAPS_ENABLED=false`)
- When disabled, the app shows location information without the interactive map
- When enabled, users see the full Google Maps integration

## Context Menu Configuration

You can disable right-click context menu in the app using:
```env
REACT_APP_DISABLE_CONTEXT_MENU=true
```
Set to `false` to allow normal browser context menu:
```env
REACT_APP_DISABLE_CONTEXT_MENU=false
```

## Other Configuration Options

### API URLs
- `REACT_APP_API_URL`: Backend API URL (default: http://localhost:5000/api)

### Database (Backend)
- `DB_USER`: PostgreSQL username
- `DB_PASSWORD`: PostgreSQL password
- `DB_HOST`: Database host
- `DB_PORT`: Database port
- `DB_NAME`: Database name