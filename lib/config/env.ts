// Environment configuration
export const env = {
  // API Configuration
  API_BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',

  // Site Configuration
  SITE_NAME: process.env.NEXT_PUBLIC_SITE_NAME || 'Everbloom',
  SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',

  // Feature Flags
  ENABLE_ANALYTICS: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
  ENABLE_PAYMENT_GATEWAY: process.env.NEXT_PUBLIC_ENABLE_PAYMENT === 'true',

  // External Services
  GOOGLE_ANALYTICS_ID: process.env.NEXT_PUBLIC_GA_ID,
  STRIPE_PUBLIC_KEY: process.env.NEXT_PUBLIC_STRIPE_KEY,

  // Development
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
};