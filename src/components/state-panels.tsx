import { ActivityIndicator, Pressable, Text, View } from "react-native";

interface LoadingPanelProps {
  label?: string;
}

interface ErrorPanelProps {
  label?: string;
  onRetry?: () => void;
}

export const LoadingPanel = ({ label = "Loading..." }: LoadingPanelProps) => (
  <View className="flex-1 items-center justify-center gap-4 bg-emerald-50 px-6">
    <ActivityIndicator size="large" color="#059669" />
    <Text className="text-center text-base text-slate-700">{label}</Text>
  </View>
);

export const ErrorPanel = ({ label = "Something went wrong.", onRetry }: ErrorPanelProps) => (
  <View className="flex-1 items-center justify-center gap-4 bg-rose-50 px-6">
    <Text className="text-center text-base text-rose-700">{label}</Text>
    {onRetry ? (
      <Pressable className="rounded-2xl bg-rose-600 px-5 py-3" onPress={onRetry}>
        <Text className="font-semibold text-white">Try again</Text>
      </Pressable>
    ) : null}
  </View>
);

