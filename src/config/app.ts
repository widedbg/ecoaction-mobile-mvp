import { Platform } from "react-native";
import Constants from "expo-constants";

const explicitUrl = process.env.EXPO_PUBLIC_API_URL?.trim();

const inferExpoHost = (): string | undefined => {
  const hostUri = Constants.expoConfig?.hostUri;

  if (!hostUri) {
    return undefined;
  }

  const normalized = hostUri.replace(/^https?:\/\//, "");
  const [host] = normalized.split(":");
  return host?.trim() || undefined;
};

const inferredExpoHost = inferExpoHost();

const defaultUrl = Platform.select({
  android: inferredExpoHost ? `http://${inferredExpoHost}:3001` : "http://10.0.2.2:3001",
  ios: inferredExpoHost ? `http://${inferredExpoHost}:3001` : "http://localhost:3001",
  web: "http://localhost:3001",
  default: inferredExpoHost ? `http://${inferredExpoHost}:3001` : "http://localhost:3001",
});

export const API_BASE_URL = (explicitUrl && explicitUrl.length > 0 ? explicitUrl : defaultUrl ?? "http://localhost:3001").replace(
  /\/+$/,
  "",
);
