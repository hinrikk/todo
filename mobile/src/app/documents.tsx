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
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import { SafeAreaView } from "react-native-safe-area-context";
import type { Document } from "../types/documents";

export default function DocumentsScreen() {
  const { getDocuments, createDocument, deleteDocument } = useDocumentsApi();
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
      console.log("Documents from API:", data);
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

  async function handleDeleteDocument(documentId: number) {
    try {
      await deleteDocument(documentId);

      setDocuments((currentDocuments) =>
        currentDocuments.filter((document) => document.id !== documentId),
      );
    } catch (error) {
      console.error("Delete document error:", error);
    }
  }

  function renderRightActions(documentId: number) {
    return (
      <Pressable
        onPress={() => handleDeleteDocument(documentId)}
        style={styles.deleteButton}
      >
        <Ionicons name="trash" size={24} color="white" />
      </Pressable>
    );
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
          <View style={styles.swipeContainer} key={document.id}>
            <Swipeable
              renderRightActions={() => renderRightActions(document.id)}
            >
              <View style={styles.listItemContainer}>
                <View style={styles.documentTitleContainer}>
                  <Text style={styles.listItemTitle}>{document.title}</Text>
                  <Text style={styles.listItemText}>{document.content}</Text>
                </View>
                <View style={styles.memberListContainer}>
                  <View style={styles.memberList}>
                    {/* Placeholder */}
                    {document.members.length < 2 && (
                      <View style={{ flex: 1 }}></View>
                    )}
                    {/* Placeholder */}
                    {document.members.length < 3 && (
                      <View style={{ flex: 1 }}></View>
                    )}
                    {document.members?.map((member) => (
                      <View key={member.id} style={styles.member}>
                        <Text>{member.email.charAt(0).toUpperCase()}</Text>
                      </View>
                    ))}
                  </View>
                </View>
                <View style={styles.arrowContainer}>
                  <Pressable
                    onPress={() => {
                      console.log("document details");
                    }}
                  >
                    <Ionicons name="chevron-forward" size={24} color="black" />
                  </Pressable>
                </View>
              </View>
            </Swipeable>
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
  documentTitleContainer: {
    flex: 4,
  },
  title: {
    fontSize: 32,
    marginVertical: 32,
    textAlign: "left",
    fontWeight: "bold",
  },
  topButtonContainer: {
    alignItems: "flex-end",
    marginBottom: 8,
  },
  swipeContainer: {
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 8,
    backgroundColor: "white",
  },
  listContainer: {
    flex: 1,
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
    flex: 2,
    justifyContent: "center",
  },
  memberList: {
    flexDirection: "row",
    gap: 2,
  },
  member: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 9999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "yellow",
  },
  arrowContainer: {
    flex: 1,
    alignItems: "flex-end",
    justifyContent: "center",
  },

  deleteButton: {
    backgroundColor: "red",
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
    paddingHorizontal: 16,
  },
});
