import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "./client";

export function useDocumentsApi() {
  const { token } = useAuth();

  async function getDocuments() {
    if (!token) {
      throw new Error("User is not authenticated");
    }
    const response = await apiFetch("/documents", token, {
      method: "GET",
    });
    if (!response.ok) {
      throw new Error("Failed to fetch documents");
    }

    return response.json();
  }

  async function createDocument(title: string, content = "") {
    if (!token) {
      throw new Error("User is not authenticated");
    }
    const response = await apiFetch("/documents", token, {
      method: "POST",
      body: JSON.stringify({
        title,
        content,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create document");
    }

    return response.json();
  }

  async function deleteDocument(documentId: number) {
    if (!token) {
      throw new Error("User is not authenticated");
    }

    const response = await apiFetch(`/documents/${documentId}`, token, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete document");
    }

    return response.json();
  }

  return {
    createDocument,
    getDocuments,
    deleteDocument,
  };
}
