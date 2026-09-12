import { useDocumentsApi } from "@/api/documents";
import DocumentEditor from "@/components/DocumentEditor";
import { Document } from "@/types/documents";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DocumentScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getDocument } = useDocumentsApi();
  const [document, setDocument] = useState<Document | null>(null);

  async function loadDocument() {
    if (!id) return;

    const data = await getDocument(Number(id));
    console.log("Loaded document:", data);
    setDocument(data);
  }

  useEffect(() => {
    loadDocument();
  }, [id]);

  return (
    <SafeAreaView style={styles.container}>
      {document && <DocumentEditor document={document} refetchDocument={loadDocument}/>}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
