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
  { name: "Legal", description: "Understand your options with context.", icon: "bi-scale" },
  { name: "Automotive", description: "Practical help for the road ahead.", icon: "bi-car-front" },
  { name: "Technology", description: "Make sense of devices and digital life.", icon: "bi-cpu" },
  { name: "Home & Appliance", description: "Get unstuck around the house.", icon: "bi-house" },
  { name: "Tax & Finance", description: "Clear guidance for money questions.", icon: "bi-graph-up-arrow" },
  { name: "Pets", description: "Thoughtful support for animal care.", icon: "bi-heart" },
  { name: "Travel", description: "Plan confidently and solve the unexpected.", icon: "bi-airplane" },
  { name: "General Questions", description: "Bring us what is on your mind.", icon: "bi-chat-square-text" },
];

const medicalCategories: Category[] = [
  { name: "General Medicine", description: "Understand symptoms and next steps.", icon: "bi-heart-pulse" },
  { name: "Dermatology", description: "Discuss skin, hair, and nail concerns.", icon: "bi-person" },
  { name: "Nutrition", description: "Build a clearer picture of healthy choices.", icon: "bi-apple" },
  { name: "Pediatrics", description: "Support for questions about children.", icon: "bi-balloon-heart" },
  { name: "Dental", description: "Talk through everyday dental concerns.", icon: "bi-emoji-smile" },
  { name: "Orthopedics", description: "Explore movement and musculoskeletal topics.", icon: "bi-universal-access" },
  { name: "Medication", description: "Ask about medicines and common concerns.", icon: "bi-capsule" },
  { name: "Mental Wellness", description: "A calm place to begin a conversation.", icon: "bi-cloud-sun" },
];

export const siteConfigs: Record<SiteKey, SiteConfig> = {
  Trimmedi: {
    key: "Trimmedi",
    siteName: "Trimmedi",
    domain: "Trimmedi.com",
    eyebrow: "Expert perspective, right when it matters",
    tagline: "Get expert answers when you need them.",
    description: "Ask a real question and find a thoughtful path forward with qualified help.",
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
    eyebrow: "A calmer way to start a health conversation",
    tagline: "Health questions deserve thoughtful answers.",
    description: "Share what is concerning you and get informed guidance from qualified professionals.",
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
