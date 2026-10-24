export type BlogCategory =
  | "METHODE_TCF"
  | "ENTREE_EXPRESS"
  | "IELTS_CANADA"
  | "ACTUALITES_EXAMENS"
  | "REUSSITE_CANDIDATS";

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: BlogCategory;
  categoryLabel: string;
  publishedAt: string;
  readTimeMinutes: number;
  author: {
    name: string;
    role: string;
  };
  featured?: boolean;
  coverImage?: string;
  youtubeUrl?: string;
  targetKeyword?: string;
  tags: string[];
  content: string;
  targetCta: {
    type: "CBT_EXAM" | "CRS_CALCULATOR" | "FREE_TEST" | "IELTS_MODULE" | "RECENT_TOPICS" | "COMMUNITY";
    label: string;
    href: string;
  };
}
