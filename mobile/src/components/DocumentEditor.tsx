import { useDocumentsApi } from "@/api/documents";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import z from "zod";
import Input from "./Input";

type EditorProps = {
  id: string;
};

export default function DocumentEditor({ id }: EditorProps) {
  const { getDocument } = useDocumentsApi();
  const [document, setDocument] = useState<Document | null>(null);

  const editorSchema = z.object({
    title: z.string(),
    content: z.string(),
  });
  type EditorForm = z.infer<typeof editorSchema>;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<EditorForm>({
    defaultValues: {
      title: "",
      content: "",
    },
  });

  useEffect(() => {
    async function loadDocument() {
      if (!id) return;

      const data = await getDocument(Number(id));
      setDocument(data);
    }

    loadDocument();
    console.log(document);
  }, [id]);

  return (
    <View style={styles.container}>
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
    padding: 16,
    backgroundColor: "red",
  },
  contentInput: {
    marginTop: 8,
    flex: 1,
  },
});
