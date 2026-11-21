export const baseURL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.familiemunshi.de/api/v1";

export const getBaseUrl = (): string => {
  return baseURL;
};

export const googleClientId =
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";
