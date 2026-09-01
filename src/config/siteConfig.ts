export type SiteKey = "Trimmedi" | "trimMedi";

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
  medicalMode: boolean;
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

const medicalCategories: Category[] = [
  { name: "Wellness basics", description: "A general starting point for everyday questions.", icon: "bi-heart-pulse" },
  { name: "Daily routines", description: "Useful context for personal habits and care.", icon: "bi-person" },
  { name: "Lifestyle", description: "Simple ideas to consider in everyday life.", icon: "bi-apple" },
  { name: "Family needs", description: "Helpful information for common situations.", icon: "bi-balloon-heart" },
  { name: "Personal care", description: "A few general ideas to explore.", icon: "bi-emoji-smile" },
  { name: "Movement", description: "Start with practical information and options.", icon: "bi-universal-access" },
  { name: "Everyday products", description: "General information for routine questions.", icon: "bi-capsule" },
  { name: "Wellbeing", description: "A calm place to look for useful starting ideas.", icon: "bi-cloud-sun" },
];

export const siteConfigs: Record<SiteKey, SiteConfig> = {
  Trimmedi: {
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
    medicalMode: false,
  },
  trimMedi: {
    key: "trimMedi",
    siteName: "TrimMedi",
    domain: "trimmedi.com",
    eyebrow: "A helpful starting point",
    tagline: "Share your question and look for a clear place to begin.",
    description: "Start with a few details and explore general information that may help you understand your options and next steps.",
    primaryColor: "#087f86",
    secondaryColor: "#123e52",
    accentColor: "#dff5f2",
    categories: medicalCategories,
    medicalMode: true,
  },
};

export function getSiteConfig(hostname = "") {
  const host = hostname.toLowerCase().split(":")[0];
  return host.includes("trimmedi") ? siteConfigs.trimMedi : siteConfigs.Trimmedi;
}
