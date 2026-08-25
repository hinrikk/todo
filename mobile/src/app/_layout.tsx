import { Stack } from "expo-router";
import { AuthProvider } from "../context/AuthContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack
        screenOptions={{
          // iOS large title
          headerLargeTitle: true,
          // Keep header transparent / integrated with content
          headerShadowVisible: false,
          headerBackTitle: "Folder",
        }}
      >
        <Stack.Screen
          name="index"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="login"
          options={{ headerShown: false }}
        />
      </Stack>
    </AuthProvider>
  );
}