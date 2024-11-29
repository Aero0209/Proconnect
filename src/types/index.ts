export interface Project {
  id: string;
  name: string;
  description?: string;
  siteUrl: string;
  githubUrl: string;
  createdAt: any;
  createdBy: string;
  createdByEmail: string;
}

export interface User {
  uid: string;
  email: string | null;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
}

export interface MessageReaction {
  emoji: string;
  userId: string;
  userEmail: string;
}

export interface Message {
  id: string;
  text: string;
  userId: string;
  userEmail: string;
  timestamp: any;
  readBy: string[];
  reactions: MessageReaction[];
  isPinned?: boolean;
  replyTo?: {
    id: string;
    text: string;
    userEmail: string;
  };
} 