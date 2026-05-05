# React SEO & Branding Guide for GoFlex Housing

## Modern React SEO Optimization

This guide provides React-specific SEO strategies for GoFlex Housing application.

### Core SEO Components

- **React Helmet Integration**: Use React Helmet to dynamically manage document head metadata for each route:
  ```jsx
  import { Helmet } from 'react-helmet-async';
  
  function HomePage() {
    return (
      <>
        <Helmet>
          <title>GoFlex Housing | Student Accommodation</title>
          <meta name="description" content="AI-powered hostel and PG management" />
        </Helmet>
        {/* Page content */}
      </>
    );
  }
  ```

- **Next.js Head Component**: If using Next.js, leverage the built-in Head component:
  ```jsx
  import Head from 'next/head';
  
  function PropertyPage({ property }) {
    return (
      <>
        <Head>
          <title>{property.name} | GoFlex Housing</title>
          <meta name="description" content={property.description} />
        </Head>
        {/* Page content */}
      </>
    );
  }
  ```

- **Dynamic Metadata**: Create a reusable SEO component to maintain consistency:
  ```jsx
  function SEO({ title, description, image }) {
    const defaultTitle = "GoFlex Housing";
    const defaultDescription = "AI-powered hostel and PG management";
    
    return (
      <Helmet>
        <title>{title ? `${title} | ${defaultTitle}` : defaultTitle}</title>
        <meta name="description" content={description || defaultDescription} />
        {image && <meta property="og:image" content={image} />}
      </Helmet>
    );
  }
  ```

### React-Specific SEO Practices

- **Server-Side Rendering**: Implement SSR or Static Generation for improved SEO performance
- **Code Splitting**: Use React.lazy() and Suspense to reduce initial load time
- **Structured Data**: Implement JSON-LD with React components:
  ```jsx
  function PropertySchema({ property }) {
    const schemaData = {
      "@context": "https://schema.org",
      "@type": "Residence",
      "name": property.name,
      "description": property.description,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": property.address.street,
        "addressLocality": property.address.city
      }
    };
    
    return (
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
    );
  }
  ```

- **React Router Configuration**: Ensure clean URLs with React Router and implement proper redirects
- **Image Optimization**: Use lazy loading and next/image or similar components for optimized images
- **Performance Monitoring**: Implement React-specific performance monitoring with tools like Lighthouse

## Branding Guidelines

- **Component Library**: Create a themed component library using styled-components or Emotion
- **Design System**: Implement a consistent design system with theme provider:
  ```jsx
  import { ThemeProvider } from 'styled-components';
  
  const theme = {
    colors: {
      primary: '#4A90E2',
      secondary: '#50E3C2',
      accent: '#B8E986',
      text: '#333333',
      background: '#FFFFFF'
    },
    fonts: {
      heading: 'Poppins, sans-serif',
      body: 'Inter, sans-serif'
    }
  };
  
  function App() {
    return (
      <ThemeProvider theme={theme}>
        <AppRoutes />
      </ThemeProvider>
    );
  }
  ```

- **Logo Component**: Create a reusable SVG logo component:
  ```jsx
  function Logo({ size = 'medium' }) {
    const dimensions = {
      small: { width: 100, height: 40 },
      medium: { width: 150, height: 60 },
      large: { width: 200, height: 80 }
    };
    
    return (
      <svg 
        width={dimensions[size].width} 
        height={dimensions[size].height}
        viewBox="0 0 200 80"
      >
        {/* SVG content */}
      </svg>
    );
  }
  ```

## Sitemap Generation for React Apps

For React applications, generate a sitemap programmatically using a package like `react-router-sitemap` or `next-sitemap` if using Next.js.

```jsx
// Example with next-sitemap (next.config.js)
module.exports = {
  siteUrl: 'https://your-domain.example',
  generateRobotsTxt: true,
  sitemapSize: 7000
};
```

## Analytics Integration

Implement React-friendly analytics with hooks:

```jsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function usePageTracking() {
  const location = useLocation();
  
  useEffect(() => {
    // Track page view
    window.gtag('event', 'page_view', {
      page_path: location.pathname + location.search
    });
  }, [location]);
}
```
