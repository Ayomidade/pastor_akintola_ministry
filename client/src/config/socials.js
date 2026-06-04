export const SOCIALS = {
  youtube: {
    url: "https://www.youtube.com/@PastorDOAkintola",
    channelId: import.meta.env.VITE_CHANNEL_ID,
    handle: "@PastorDOAkintola",
    label: "YouTube",
  },
  facebook: {
    url: "https://www.facebook.com/PastorAkintola",
    label: "Facebook",
    handle: "Abidan Productions",
  },
  // instagram: {
  //   url: "https://www.instagram.com/pastorakintola",
  //   handle: "@pastorakintola",
  //   label: "Instagram",
  // },
  // twitter: {
  //   url: "https://www.twitter.com/pastorakintola",
  //   handle: "@pastorakintola",
  //   label: "X (Twitter)",
  // },
  whatsapp: {
    url: "https://wa.me/2348033053188?text=Hello%20Pastor%20Akintola%2C%20I%20would%20like%20to%20get%20in%20touch%20with%20you.",
    label: "WhatsApp",
  },
};

// YouTube Data API v3 key — set in .env as VITE_YOUTUBE_API_KEY
// Get one free at: https://console.cloud.google.com
export const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
