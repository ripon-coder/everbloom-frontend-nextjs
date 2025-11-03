// Site configuration
export const siteConfig = {
  name: 'Everbloom',
  description: 'Your premium e-commerce destination for quality products',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  ogImage: '/images/og-image.jpg',
  links: {
    email: 'contact@everbloom.com',
    phone: '+1-555-0123',
    address: '123 Store St, City, State 12345'
  },
  social: {
    twitter: 'https://twitter.com/everbloom',
    facebook: 'https://facebook.com/everbloom',
    instagram: 'https://instagram.com/everbloom',
    linkedin: 'https://linkedin.com/company/everbloom'
  },
  seo: {
    defaultTitle: 'Everbloom - Premium E-Commerce',
    defaultDescription: 'Discover premium products at Everbloom. Quality, style, and exceptional service.',
    keywords: ['e-commerce', 'shopping', 'premium products', 'online store'],
    author: 'Everbloom Team'
  },
  currency: {
    code: 'USD',
    symbol: '$',
    locale: 'en-US'
  },
  pagination: {
    defaultPerPage: 12,
    maxPerPage: 50
  }
};