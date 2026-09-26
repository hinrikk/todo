import { useAuth } from "@/context/AuthContext";
import type { User } from "@/types/user";
import { apiFetch } from "./client";

export function useUsersApi() {
  const { token } = useAuth();

  async function searchUsers(query: string): Promise<User[]> {
    if (!token) {
      throw new Error("User is not authenticated");
    }

    if (query.trim().length < 3) {
      return [];
    }

    const response = await apiFetch(
      `/users/search?q=${encodeURIComponent(query.trim())}`,
      token,
      {
        method: "GET",
      },
    );

    if (!response.ok) {
      throw new Error("Failed to search users");
    }

    return response.json();
  }

  return {
    searchUsers,
  };
}
