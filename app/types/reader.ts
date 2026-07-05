import { Story } from "@/app/data/initialStories";

export type ThemeType = "cozy-night" | "midnight" | "sepia" | "forest" | "soft-light";
export type FontType = "serif" | "sans" | "handwriting" | "mono" | "dyslexic";
export type LineHeightType = "normal" | "cozy" | "airy";
export type PageWidthType = "narrow" | "medium" | "wide";
export type TextAlignType = "left" | "justify";

export interface StoryReaderProps {
  story: Story;
  onClose: () => void;
  onMarkRead: (storyId: string) => void;
  isRead: boolean;
  startFullyVisible?: boolean;
}
