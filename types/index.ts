import { User, Activity, Contact, Resource, Project, Comment, UserRole, LeadStatus, ActivityType, ProjectStatus } from '@prisma/client';

// User types
export type { User, UserRole };

export interface SessionUser {
  id: string;
  email: string;
  name?: string | null;
  image?: string | null;
  role: UserRole;
}

// Activity types
export type { Activity, ActivityType };

export interface ActivityWithRelations extends Activity {
  user: User;
  contact?: Contact | null;
  project?: Project | null;
  resource?: Resource | null;
  comments: CommentWithUser[];
}

export interface CreateActivityInput {
  content: string;
  type: ActivityType;
  contactId?: string;
  projectId?: string;
  resourceId?: string;
  metadata?: Record<string, any>;
}

// Contact types
export type { Contact, LeadStatus };

export interface ContactWithActivities extends Contact {
  activities: Activity[];
  _count: {
    activities: number;
  };
}

export interface CreateContactInput {
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  position?: string;
  linkedinUrl?: string;
  leadStatus?: LeadStatus;
  notes?: string;
}

// Resource types
export type { Resource };

export interface ResourceWithActivities extends Resource {
  activities: Activity[];
}

export interface CreateResourceInput {
  title: string;
  description?: string;
  type: string;
  url?: string;
  fileData?: Record<string, any>;
}

// Project types
export type { Project, ProjectStatus };

export interface ProjectWithActivities extends Project {
  activities: Activity[];
  _count: {
    activities: number;
  };
}

export interface CreateProjectInput {
  title: string;
  description?: string;
  status?: ProjectStatus;
  estimatedDate?: Date;
  progress?: number;
}

// Comment types
export type { Comment };

export interface CommentWithUser extends Comment {
  user: User;
}

export interface CreateCommentInput {
  content: string;
  activityId: string;
}

// API Response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
}

// Pagination types
export interface PaginationParams {
  page?: number;
  limit?: number;
  orderBy?: string;
  order?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}