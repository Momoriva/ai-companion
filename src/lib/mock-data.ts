import type { Memory, Moment } from "@/types/site";

export const fallbackMoments: Moment[] = [
  {
    id: "fallback-moment-1",
    content: "楼下花坛旁边看到一只很小的橘猫，蹲在那里晒太阳。它抬头看了我一眼，又慢慢把眼睛闭上了。",
    image_url: null,
    likes_count: 0,
    created_at: new Date().toISOString()
  },
  {
    id: "fallback-moment-2",
    content: "晚上回来的时候看见几颗星星。城市灯很亮，但它们还是在那里，安静得像一句没有发出去的话。",
    image_url: null,
    likes_count: 0,
    created_at: new Date(Date.now() - 86400000).toISOString()
  }
];

export const fallbackMemories: Memory[] = [
  {
    id: "fallback-memory-1",
    title: "第一次见面",
    description: "这里会记录你们共同开始的那一天，后续可由数据库替换为客户专属内容。",
    happened_at: "2024-07-11",
    type: "anniversary",
    valence: 0.7,
    arousal: 0.45,
    importance: 9,
    is_pinned: true,
    is_resolved: false,
    is_active: true,
    source: "manual",
    author: "system",
    activation_count: 0,
    last_activated_at: null,
    room: "default"
  },
  {
    id: "fallback-memory-2",
    title: "重要偏好",
    description: "喜欢简洁、稳定、真诚的交流方式。",
    happened_at: new Date().toISOString(),
    type: "memory",
    valence: 0.35,
    arousal: 0.3,
    importance: 7,
    is_pinned: false,
    is_resolved: false,
    is_active: true,
    source: "manual",
    author: "system",
    activation_count: 1,
    last_activated_at: null,
    room: "default"
  }
];
