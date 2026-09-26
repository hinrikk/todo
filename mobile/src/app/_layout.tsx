import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthProvider } from "../context/AuthContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Stack
          screenOptions={{
            // iOS large title
            headerLargeTitle: true,
            // Keep header transparent / integrated with content
            headerShadowVisible: false,
            headerBackTitle: "Folder",
            headerShown: false,
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="login" />
          <Stack.Screen name="register" />
          <Stack.Screen name="documents" />
        </Stack>
      </GestureHandlerRootView>
    </AuthProvider>
  );
}
