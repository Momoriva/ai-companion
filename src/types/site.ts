export type ThemeName = "blue" | "bubblegum" | "pink" | "minimal" | "yanyunNight";

export type SiteConfig = {
  name: string;
  avatar: string;
  theme: ThemeName;
  anniversary: string;
  welcome: string;
  bio: string;
  tagline: string;
  dailyMessages: string[];
  persona: string;
  worldview: string;
};

export type Message = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  created_at: string;
};

export type Moment = {
  id: string;
  content: string;
  image_url?: string | null;
  likes_count: number;
  created_at: string;
};

export type Memory = {
  id: string;
  title: string;
  description: string;
  happened_at: string;
  type: "memory" | "anniversary" | "event";
  valence: number;
  arousal: number;
  importance: number;
  is_pinned: boolean;
  is_resolved: boolean;
  is_active: boolean;
  source: string;
  author?: string | null;
  activation_count: number;
  last_activated_at?: string | null;
  room: string;
};

export type KnowledgeDocument = {
  id: string;
  source_name: string;
  original_content: string;
  file_type: string;
  room: string;
  created_at: string;
};

export type KnowledgeChunk = {
  id: string;
  document_id: string;
  source_name: string;
  chunk_index: number;
  content: string;
  room: string;
  created_at: string;
};

export type MemorySettings = {
  room: string;
  decay_lambda: number;
  recall_limit: number;
  pinned_limit: number;
  knowledge_limit: number;
  knowledge_similarity_threshold: number;
  default_digest_model: string;
};
