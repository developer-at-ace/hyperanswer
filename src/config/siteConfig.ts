export type SiteKey = "Trimmedi";

export type Category = {
  name: string;
  description: string;
  icon: string;
};

export type SiteConfig = {
  key: SiteKey;
  siteName: string;
  domain: string;
  eyebrow: string;
  tagline: string;
  description: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  categories: Category[];
};

const generalCategories: Category[] = [
  { name: "Life decisions", description: "A few useful starting points for big questions.", icon: "bi-scale" },
  { name: "Transportation", description: "Helpful context for day-to-day travel needs.", icon: "bi-car-front" },
  { name: "Technology", description: "A clearer place to begin with digital questions.", icon: "bi-cpu" },
  { name: "Home & routine", description: "Simple ideas for everyday tasks at home.", icon: "bi-house" },
  { name: "Money & planning", description: "Useful context for practical decisions.", icon: "bi-graph-up-arrow" },
  { name: "Family & pets", description: "Thoughtful starting points for daily life.", icon: "bi-heart" },
  { name: "Travel", description: "Plan more confidently and explore options.", icon: "bi-airplane" },
  { name: "General questions", description: "Bring what is on your mind and start there.", icon: "bi-chat-square-text" },
];

export const siteConfig: SiteConfig = {
    key: "Trimmedi",
    siteName: "Trimmedi",
    domain: "Trimmedi.com",
    eyebrow: "A simple way to start",
    tagline: "Ask a question and explore helpful starting points.",
    description: "Share what you need help with and explore a few useful directions before you decide your next step.",
    primaryColor: "#2457d6",
    secondaryColor: "#152b63",
    accentColor: "#e5edff",
    categories: generalCategories,
};

export function getSiteConfig(_hostname = "") {
  void _hostname;
  return siteConfig;
}
