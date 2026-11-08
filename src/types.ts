export type Role = 'Admin' | 'AssistantAdmin' | 'DepartmentRep' | 'Supervisor' | 'Member';

export type Department = string;

export interface DepartmentInfo {
  id: string;
  name: string;
  color?: string;
  icon?: string;
  manifesto?: string;
}

export type BadgeType = string;

export interface CustomBadge {
  id: string;
  label: string;
  desc: string;
  icon: string;
  bg: string;
  color: string;
}

export interface UserBadge {
  type: BadgeType;
  dateAwarded: string;
  note?: string;
}

export interface User {
  id: string;
  name: string;
  roles: Role[];
  departments: Department[];
  points: number;
  email?: string;
  avatar?: string;
  fcmToken?: string;
  jobTitle?: string;
  badges?: UserBadge[];
  bio?: string;
  socials?: {
    telegram?: string;
    telegramChatId?: string;
    facebook?: string;
    instagram?: string;
  };
}

export interface ActivityTask {
  id: string;
  department: Department;
  name: string;
  basePoints: number;
}

export interface ActivityLog {
  id: string;
  userId: string;
  taskId: string;
  quantity: number;
  qualityModifier: number;
  totalPoints: number;
  date: string;
  evidence?: string;
  notes?: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export interface RoomMessage {
  id: string;
  departmentId: string;
  userId: string;
  content: string;
  timestamp: string;
  reactions?: { [emoji: string]: string[] };
}


export interface Notification {
  id: string;
  userId: string;
  message: string;
  date: string;
  read: boolean;
  type: string;
}

export interface DepartmentBlog {
  id: string;
  departmentId: string;
  title: string;
  content: string;
  updatedAt: string;
}

export interface CommentReply {
  id: string;
  userId: string;
  content: string;
  timestamp: string;
}

export interface PollOption {
  id: string;
  text: string;
  votes: string[];
}

export interface Comment {
  id: string;
  userId: string;
  content: string;
  timestamp: string;
  likes?: string[];
  reactions?: Record<string, string[]>;
  replies?: CommentReply[];
  poll?: {
    question: string;
    options: PollOption[];
  };
}


export interface AboutInfo {
  content: string;
}

export interface WorkflowHistoryItem {
  id: string;
  action: 'created' | 'forwarded' | 'completed';
  fromDepartmentId?: string;
  toDepartmentId?: string;
  byUserId: string;
  timestamp: string;
  note?: string;
}

export interface WorkflowTask {
  id: string;
  title: string;
  description: string;
  createdBy: string;
  currentDepartmentId: string;
  status: 'active' | 'completed';
  history: WorkflowHistoryItem[];
  createdAt: string;
}
