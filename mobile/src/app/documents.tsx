import { useDocumentsApi } from "@/api/documents";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { Document } from "../types/documents";

export default function DocumentsScreen() {
  const { getDocuments, createDocument } = useDocumentsApi();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  async function handleAddDocument() {
    try {
      const document = await createDocument("New Document", "");
      console.log("Created document:", document);
    } catch (error) {
      console.error("Create document error:", error);
    }
  }

  async function loadDocuments() {
    try {
      const data = await getDocuments();
      setDocuments(data);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleRefresh() {
    setRefreshing(true);
    await loadDocuments();
    setRefreshing(false);
  }

  useEffect(() => {
    loadDocuments();
    console.log(documents);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Documents</Text>
      <View style={styles.topButtonContainer}>
        <Pressable onPress={handleAddDocument}>
          <Ionicons name="add" size={32} color="black" />
        </Pressable>
      </View>
      <ScrollView
        style={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {documents.map((document) => (
          <View key={document.id} style={styles.listItemContainer}>
            <View style={{ flex: 2, backgroundColor: "blue" }}>
              <Text style={styles.listItemTitle}>{document.title}</Text>
              <Text style={styles.listItemText}>{document.content}</Text>
            </View>
            <View style={styles.memberListContainer}>
              <View style={styles.memberList}>
                  {document.members.map((member) => (
                    <View key={member.id} style={styles.member}>
                      <Text>
                        {member.email.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                  ))}
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "f2f2f2",
  },
  title: {
    fontSize: 32,
    marginBottom: 32,
    textAlign: "left",
    fontWeight: "bold",
  },
  topButtonContainer: {
    alignItems: "flex-end",
  },
  listContainer: {
    backgroundColor: "red",
  },
  listItemContainer: {
    backgroundColor: "white",
    padding: 8,
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  listItemTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  listItemText: {
    fontSize: 14,
    marginTop: 8,
  },
  memberListContainer: {
    flex: 1,
    backgroundColor: "green",
    justifyContent: "center",
  },
  memberList: {
    flexDirection: "row",
    gap: 2,
    backgroundColor: "pink",
  },
  member: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 9999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "yellow",
  },
});
