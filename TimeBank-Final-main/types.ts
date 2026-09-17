
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  profilePhoto: string;
  skills: string[];
  availableHours: string;
  timeBalance: number;
  role: 'user' | 'admin';
  status: 'active' | 'suspended';
  averageRating?: number;
  ratingCount?: number;
}

export interface Service {
  id: string;
  providerId: string;
  providerName: string;
  providerAvatar: string;
  providerAverageRating: number;
  providerRatingCount: number;
  title: string;
  description: string;
  category: string;
  timeValue: number;
  createdAt: Date;
}

export enum JobStatus {
  REQUESTED = 'Requested',
  ACCEPTED = 'Accepted',
  IN_PROGRESS = 'In Progress',
  FINISHED = 'Finished',
  COMPLETED = 'Completed',
  REJECTED = 'Rejected',
}

export interface Job {
  id: string;
  serviceId: string;
  serviceTitle: string;
  requesterId: string;
  requesterName: string;
  requesterAverageRating: number;
  requesterRatingCount: number;
  providerId: string;
  providerName: string;
  providerAverageRating: number;
  providerRatingCount: number;
  status: JobStatus;
  timeValue: number;
  requesterConfirmed: boolean;
  providerConfirmed: boolean;
  createdAt: Date;
}

export interface Transaction {
  id: string;
  jobId: string;
  jobTitle: string;
  fromUserId: string;
  fromUserName:string;
  toUserId: string;
  toUserName: string;
  amount: number;
  description: string;
  timestamp: Date;
}

export interface Feedback {
  id: string;
  jobId: string;
  fromUserId: string;
  fromUserName: string;
  toUserId: string;
  toUserName: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export interface PersistentNotification {
  _id: string;
  user: string;
  message: string;
  type: 'warning' | 'info' | 'job_update';
  isRead: boolean;
  createdAt: string;
  link?: string;
}
