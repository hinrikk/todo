import { StyleSheet, TextInput, TextInputProps, ViewStyle } from "react-native";

type InputProps = TextInputProps & {
  style?: ViewStyle;
};

export default function Input({ style, ...props }: InputProps) {
  return (
    <TextInput
      {...props}
      style={[styles.input, style]}
      placeholderTextColor="#888"
    />
  );
}

const styles = StyleSheet.create({
  input: {
    width: "100%",
    borderWidth: 2,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 16,
    fontSize: 16,
    backgroundColor: "white",
    color: "black",
  },
});
