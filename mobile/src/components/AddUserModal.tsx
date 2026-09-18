import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import Input from "./Input";

type AddUserModalProps = {
  visible: boolean;
  onClose: () => void;
};

export default function AddUserModal({ visible, onClose }: AddUserModalProps) {
  const [search, setSearch] = useState("");

  function handleClose() {
    setSearch("");
    onClose();
  }
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
