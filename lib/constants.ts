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
    label: 'Resources',
    href: '/dashboard/resources',
    icon: 'bookmark',
  },
  {
    label: "Carm's Corner",
    href: '/dashboard/carms-corner',
    icon: 'crown',
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

// Carm's Corner - Product configuration
export const PRODUCTS = {
  ECHO: {
    name: 'Echo',
    description: 'Project management platform for marketing workflows',
    detailedDescription: 'Echo is an end-to-end project management platform built for the pace and complexity of pharmaceutical marketing. What started as a screenshot automation tool is evolving into a centralized workspace where teams can manage routes, assign tasks, review creative, capture feedback, and track approvals—all in one place. With built-in automation and AI-driven tools, Echo eliminates repetitive work, reduces delays, and keeps every stakeholder aligned.',
    color: 'blue',
    className: 'product-echo',
  },
  KALABRIA: {
    name: 'Kalabria',
    description: 'Secure AI hub with enterprise security',
    detailedDescription: 'Kalabria is a secure AI hub designed for pharmaceutical teams who want powerful, flexible, and compliant solutions. It offers a growing library of out-of-the-box AI tools—like content generation, summarization, and data extraction—alongside fully tailored solutions built to match your workflows. Built with enterprise security in mind, Kalabria can be deployed on your infrastructure, giving you complete control over data and access.',
    color: 'green',
    className: 'product-kalabria',
  },
  PHRAMES: {
    name: 'Phrames',
    description: 'Banner framework for display campaigns',
    detailedDescription: 'Phrames is a banner framework built for pharma marketing teams who need speed, structure, and consistency across display campaigns. It centralizes your creative assets, animation rules, and brand-specific requirements into reusable templates that teams can preview, test, and export with ease. The built-in previewer lets users step through keyframes, expand ISI content when present, and validate functionality before launch.',
    color: 'purple',
    className: 'product-phrames',
  },
  MAILBRIX: {
    name: 'Mailbrix',
    description: 'Modular email framework with branded components',
    detailedDescription: 'Mailbrix is a modular email framework built for pharma teams who need to move fast without starting from scratch. It allows users to design, build, and preview branded emails using pre-approved components organized by client, brand, and campaign. Content can be added manually or generated with AI, and each element is editable within an intuitive canvas. Teams can store design systems, manage variations, and rapidly assemble emails that are consistent, compliant, and ready to route.',
    color: 'orange',
    className: 'product-mailbrix',
  },
  PHARMABLOX: {
    name: 'Pharmablox',
    description: 'Website management platform with compliance focus',
    detailedDescription: 'Pharmablox is a website management platform built specifically for pharmaceutical brands. It combines the ease of a site builder with the structure and control required for med-legal compliance. Teams can create and manage modular, on-brand components—organized by product, indication, or campaign—and reuse them across pages, brands, and markets. Content approvals, ISI handling, and accessibility best practices are built in from the start.',
    color: 'teal',
    className: 'product-pharmablox',
  },
} as const;

// Task priority configuration
export const TASK_PRIORITY_CONFIG = {
  LOW: {
    label: 'Low',
    color: 'gray',
    className: 'priority-low',
  },
  MEDIUM: {
    label: 'Medium',
    color: 'blue',
    className: 'priority-medium',
  },
  HIGH: {
    label: 'High',
    color: 'amber',
    className: 'priority-high',
  },
  URGENT: {
    label: 'Urgent',
    color: 'red',
    className: 'priority-urgent',
  },
} as const;

// Response status configuration
export const RESPONSE_STATUS_CONFIG = {
  PENDING: {
    label: 'Pending',
    color: 'amber',
    className: 'response-pending',
  },
  APPROVED: {
    label: 'Approved',
    color: 'green',
    className: 'response-approved',
  },
  REJECTED: {
    label: 'Rejected',
    color: 'red',
    className: 'response-rejected',
  },
  NEEDS_INFO: {
    label: 'Needs Info',
    color: 'blue',
    className: 'response-needs-info',
  },
} as const;