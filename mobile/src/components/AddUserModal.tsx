import { useDocumentsApi } from "@/api/documents";
import { useUsersApi } from "@/api/users";
import { User } from "@/types/user";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

type AddUserModalProps = {
  visible: boolean;
  onClose: () => void;
  members: User[];
  documentId: number;
  refetchDocument: () => Promise<void>;
};

export default function AddUserModal({
  visible,
  onClose,
  members,
  documentId,
  refetchDocument,
}: AddUserModalProps) {
  const { searchUsers } = useUsersApi();
  const [search, setSearch] = useState("");
  const { addUserToDocument } = useDocumentsApi();
  const [users, setUsers] = useState<User[]>([]);

  const availableUsers = users.filter(
    (user) => !members.some((member) => member.id === user.id),
  );

  useEffect(() => {
    if (search.trim().length < 3) {
      setUsers([]);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        const result = await searchUsers(search);
        setUsers(result);
        console.log(users);
      } catch (error) {
        console.error("User search failed:", error);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [search]);

  function handleClose() {
    setSearch("");
    onClose();
  }

  async function handleAddUser(userId: number) {
    try {
      await addUserToDocument(documentId, userId);

      await refetchDocument();

      // Remove them from the search results immediately
      setUsers((current) => current.filter((user) => user.id !== userId));
    } catch (error) {
      console.error("Failed to add user:", error);
    }
  }

  console.log();
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text></Text>
            <Text style={styles.modalTitle}>Teilnehmer Verwalten</Text>
            <Pressable onPress={handleClose}>
              <Ionicons name="close" size={24} color="black" />
            </Pressable>
          </View>

          <TextInput
            placeholder="benutzer@mail.com"
            value={search}
            onChangeText={setSearch}
            autoCapitalize="none"
            style={styles.searchBar}
          />

          {search.length > 0 && (
            <View style={styles.userListContainer}>
              {availableUsers &&
                availableUsers.map((user) => (
                  <View key={user.id} style={styles.userContainer}>
                    <View style={styles.userIdentificationContainer}>
                      <View style={styles.memberIcon}>
                        <Text style={{ fontWeight: "bold" }}>
                          {user.email.at(0)?.toUpperCase()}
                        </Text>
                      </View>
                      <Text>{user.email}</Text>
                    </View>
                    <Pressable onPress={() => handleAddUser(user.id)}>
                      <Ionicons
                        name="add-circle-outline"
                        size={24}
                        color="black"
                      />
                    </Pressable>
                  </View>
                ))}
            </View>
          )}

          <Text style={styles.userContainerTitle}>Teilnehmer</Text>
          <View style={styles.userListContainer}>
            {members.map((member) => (
              <View key={member.id} style={styles.userContainer}>
                <View style={styles.userIdentificationContainer}>
                  <View style={styles.memberIcon}>
                    <Text style={{ fontWeight: "bold" }}>
                      {member.email.at(0)?.toUpperCase()}
                    </Text>
                  </View>
                  <Text>{member.email}</Text>
                </View>
                <Ionicons
                  name="checkmark-circle-outline"
                  size={24}
                  color="green"
                />
              </View>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "flex-end",
  },

  modalContainer: {
    backgroundColor: "#f2f2f2",
    padding: 16,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    minHeight: "90%",
    gap: 8,
  },

  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },

  searchBar: {
    backgroundColor: "white",
    padding: 10,
    paddingHorizontal: 16,
    borderRadius: 9999,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },

  userContainerTitle: {
    paddingTop: 8,
    fontWeight: "bold",
  },

  userListContainer: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 8,
    gap: 8,
  },
  userContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  userIdentificationContainer: {
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },

  memberIcon: {
    height: "100%",
    aspectRatio: 1,
    borderRadius: 9999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "yellow",
  },
});
