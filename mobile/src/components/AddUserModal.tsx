import { useUsersApi } from "@/api/users";
import { User } from "@/types/user";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import Input from "./Input";

type AddUserModalProps = {
  visible: boolean;
  onClose: () => void;
};

export default function AddUserModal({ visible, onClose }: AddUserModalProps) {
  const { searchUsers } = useUsersApi();
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<User[]>([]);

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
            <Text style={styles.modalTitle}>Add user</Text>

            <Pressable onPress={handleClose}>
              <Ionicons name="close" size={24} color="black" />
            </Pressable>
          </View>

          <Input
            placeholder="Search users..."
            value={search}
            onChangeText={setSearch}
            autoCapitalize="none"
          />
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
    backgroundColor: "white",
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: "50%",
  },

  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },

  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
  },
});
