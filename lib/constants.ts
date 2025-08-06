// Application constants
export const APP_NAME = 'Wally HQ';
export const APP_DESCRIPTION = 'Your personal command center for staying connected with your founder';

// API endpoints
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

// Pagination
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

// Activity types with display names
export const ACTIVITY_TYPE_LABELS = {
  EMAIL: 'Email',
  CALL: 'Call',
  TEXT: 'Text Message',
  LINKEDIN: 'LinkedIn',
  PRODUCT_UPDATE: 'Product Update',
  GENERAL: 'General Update',
} as const;

// Lead status with colors
export const LEAD_STATUS_CONFIG = {
  COLD: {
    label: 'Cold',
    color: 'blue',
    className: 'badge-cold',
  },
  WARM: {
    label: 'Warm',
    color: 'amber',
    className: 'badge-warm',
  },
  HOT: {
    label: 'Hot',
    color: 'red',
    className: 'badge-hot',
  },
} as const;

// Project status with colors
export const PROJECT_STATUS_CONFIG = {
  NOT_STARTED: {
    label: 'Not Started',
    color: 'gray',
  },
  IN_PROGRESS: {
    label: 'In Progress',
    color: 'blue',
  },
  ON_HOLD: {
    label: 'On Hold',
    color: 'yellow',
  },
  COMPLETED: {
    label: 'Completed',
    color: 'green',
  },
  CANCELLED: {
    label: 'Cancelled',
    color: 'red',
  },
} as const;

// Navigation items
export const NAV_ITEMS = [
  {
    label: 'Home',
    href: '/dashboard',
    icon: 'home',
  },
  {
    label: 'Contacts',
    href: '/dashboard/contacts',
    icon: 'users',
  },
  {
    label: 'Projects',
    href: '/dashboard/projects',
    icon: 'folder',
  },
  {
    label: 'Resources',
    href: '/dashboard/resources',
    icon: 'bookmark',
  },
] as const;

// Date formats
export const DATE_FORMAT = 'MMM d, yyyy';
export const DATETIME_FORMAT = 'MMM d, yyyy h:mm a';

// File upload limits
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
];