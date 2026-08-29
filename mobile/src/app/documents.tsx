import { ScrollView, Text, StyleSheet } from "react-native";

export default function DocumentsScreen() {
  return (
    <ScrollView
      style={styles.container}
      contentInsetAdjustmentBehavior="automatic"
    >
      <Text>documents...</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});