import Input from "@/components/Input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, Text, View } from "react-native";
import { z } from "zod";
import { API_URL } from "../../config/env";

import { useRouter } from "expo-router";
import Button from "../components/Button";

const registerSchema = z
  .object({
    email: z.string().email("Please enter a valid email"),

    password: z.string().min(8, "Password must be at least 8 characters"),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterScreen() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "test@mail.com",
      password: "123456789",
      confirmPassword: "123456789",
    },
  });

  const router = useRouter();

  async function handleRegister(data: RegisterForm) {
    console.log("Register data:", data);
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Register failed");
      }

      router.replace("/login");
    } catch (error) {
      console.error("Register error:", error);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome!</Text>

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            placeholder="Email"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        )}
      />

      {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            placeholder="Password"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            secureTextEntry
            autoComplete="off"
            textContentType="oneTimeCode"
          />
        )}
      />

      {errors.password && (
        <Text style={styles.error}>{errors.password.message}</Text>
      )}

      <Controller
        control={control}
        name="confirmPassword"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            placeholder="Confirm Password"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            secureTextEntry
            autoComplete="off"
            textContentType="oneTimeCode"
          />
        )}
      />

      {errors.confirmPassword && (
        <Text style={styles.error}>{errors.confirmPassword.message}</Text>
      )}

      <Button
        title="Sign Up"
        style={{
          marginTop: 32,
        }}
        onPress={handleSubmit(handleRegister)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    gap: 16,
    padding: 16,
    marginBottom: "25%",
  },
  title: {
    fontSize: 32,
    marginBottom: 64,
    textAlign: "left",
    fontWeight: "bold",
  },
  error: {
    color: "red",
    fontSize: 14,
  },
});
