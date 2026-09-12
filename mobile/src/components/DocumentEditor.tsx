import { useDocumentsApi } from "@/api/documents";
import { Document } from "@/types/documents";
import { User } from "@/types/user";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { Pressable, StyleSheet, Text, View } from "react-native";
import z from "zod";
import Input from "./Input";

type DocumentEditorProps = {
  document: Document;
  refetchDocument: () => Promise<void>;
};

export default function DocumentEditor({ document, refetchDocument }: DocumentEditorProps) {
  const { updateDocument } = useDocumentsApi();
  const router = useRouter();
  const editorSchema = z.object({
    title: z.string(),
    content: z.string(),
  });
  type EditorForm = z.infer<typeof editorSchema>;

  async function onSubmit(data: EditorForm) {
    await updateDocument(document.id, data.title, data.content);
    await refetchDocument();
  }

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<EditorForm>({
    defaultValues: {
      title: document.title,
      content: document.content,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="white" />
        </Pressable>
        <View style={styles.memberContainer}>
          {document.members.map((member: User) => (
            <View key={member.id} style={styles.member}>
              <Text style={{ fontWeight: "bold" }}>
                {member.email.at(0)?.toUpperCase()}
              </Text>
            </View>
          ))}

          <Pressable
            onPress={() => {
              console.log("add");
            }}
            style={styles.addButton}
          >
            <Ionicons name="add" size={16} color="white" />
          </Pressable>
        </View>
        <Pressable onPress={handleSubmit(onSubmit)} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save</Text>
        </Pressable>
      </View>
      <Controller
        control={control}
        name="title"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            placeholder="Title"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            autoCapitalize="none"
          />
        )}
      />

      <Controller
        control={control}
        name="content"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            placeholder="Content"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            autoCapitalize="none"
            style={styles.contentInput}
            multiline={true}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    marginBottom: 16,
    height: 40,
  },
  contentInput: {
    marginTop: 8,
    flex: 1,
  },
  saveButton: {
    padding: 8,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonText: {
    color: "black",
    fontWeight: "bold",
    padding: 8,
    paddingVertical: 4,
    fontSize: 16,
  },
  backButton: {
    height: "100%",
    aspectRatio: 1,
    borderRadius: 9999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "black",
  },
  memberContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    height: "100%",
    gap: 4,
  },

  member: {
    height: "100%",
    aspectRatio: 1,
    borderRadius: 9999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "yellow",
  },

  addButton: {
    aspectRatio: 1,
    borderRadius: 9999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "black",
    padding: 2,
  },
});
