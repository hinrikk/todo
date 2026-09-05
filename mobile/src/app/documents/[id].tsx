import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DocumentScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color="white" />
        </Pressable>
      </View>

      <Text>Document ID: {id}</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginVertical: 32,
  },
  backButton: {
    padding: 8,
    aspectRatio: 1,
    borderRadius: 9999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "black",
  },
});
