// Application constants
export const APP_CONSTANTS = {
  // API constants
  API_TIMEOUT: 10000, // 10 seconds

  // Pagination constants
  DEFAULT_PAGE_SIZE: 12,
  MAX_PAGE_SIZE: 50,

  // Image constants
  IMAGE_PLACEHOLDER: '/images/placeholder.jpg',
  MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB

  // Validation constants
  MIN_PASSWORD_LENGTH: 8,
  MAX_PASSWORD_LENGTH: 128,
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 100,

  // Cart constants
  MAX_CART_QUANTITY: 99,
  MIN_CART_QUANTITY: 1,

  // Local storage keys
  STORAGE_KEYS: {
    AUTH_TOKEN: 'auth_token',
    CART_DATA: 'cart_data',
    USER_PREFERENCES: 'user_preferences',
    RECENTLY_VIEWED: 'recently_viewed'
  },

  // Product constants
  PRODUCT_STATUS: {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    DRAFT: 'draft'
  },

  // Order constants
  ORDER_STATUS: {
    PENDING: 'pending',
    PROCESSING: 'processing',
    SHIPPED: 'shipped',
    DELIVERED: 'delivered',
    CANCELLED: 'cancelled',
    REFUNDED: 'refunded'
  },

  // Payment constants
  PAYMENT_METHODS: {
    CREDIT_CARD: 'card',
    PAYPAL: 'paypal',
    CASH_ON_DELIVERY: 'cash_on_delivery'
  },

  // User roles
  USER_ROLES: {
    CUSTOMER: 'user',
    ADMIN: 'admin',
    SUPER_ADMIN: 'super_admin'
  },

  // Error messages
  ERROR_MESSAGES: {
    NETWORK_ERROR: 'Network error. Please check your connection.',
    SERVER_ERROR: 'Server error. Please try again later.',
    NOT_FOUND: 'The requested resource was not found.',
    UNAUTHORIZED: 'You are not authorized to perform this action.',
    VALIDATION_ERROR: 'Please check your input and try again.',
    GENERIC_ERROR: 'Something went wrong. Please try again.'
  },

  // Success messages
  SUCCESS_MESSAGES: {
    LOGIN_SUCCESS: 'Login successful!',
    REGISTRATION_SUCCESS: 'Registration successful!',
    CART_UPDATED: 'Cart updated successfully!',
    ORDER_PLACED: 'Order placed successfully!',
    PROFILE_UPDATED: 'Profile updated successfully!'
  }
} as const;