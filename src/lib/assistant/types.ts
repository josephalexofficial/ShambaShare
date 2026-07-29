export type ChatRole = "user" | "assistant";

export type ChatMessage = {
  role: ChatRole;
  content: string;
};

/** Compact listing shape sent from the browser so the agent knows live stock. */
export type AssistantListing = {
  title: string;
  category: string;
  ratePerDay: number;
  locationLabel: string;
  distanceKm?: number;
  isAvailable: boolean;
};

export type AssistantContext = {
  role?: string | null;
  county?: string | null;
  listings?: AssistantListing[];
};

export type AssistantRequest = {
  messages: ChatMessage[];
  context?: AssistantContext;
};
