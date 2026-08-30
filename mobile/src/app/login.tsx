import Input from "@/components/Input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, Text, View } from "react-native";
import { z } from "zod";
import Button from "../components/Button";
import { useAuth } from "../context/AuthContext";
import { API_URL } from "../../config/env";

const loginSchema = z.object({
  email: z.email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
type LoginForm = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const router = useRouter();
  const { setToken } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function handleLogin(data: LoginForm) {
    console.log("Valid registration data:", data);
    // try {
    //   const response = await fetch("http://localhost:3000/auth/login", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(data),
    //   });

    //   if (!response.ok) {
    //     throw new Error("Login failed");
    //   }

    //   const result = await response.json();

    //   await setToken(result.token);
    //   router.replace("/documents");
    // } catch (error) {
    //   console.error("Login error:", error);
    // }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome back!</Text>

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
          />
        )}
      />

      {errors.password && (
        <Text style={styles.error}>{errors.password.message}</Text>
      )}

      <Button
        title="Login"
        style={{ marginTop: 16 }}
        onPress={handleSubmit(handleLogin)}
      />

      <Text style={styles.or}>or</Text>

      <Button
        title="Sign Up"
        backgroundColor="white"
        textColor="black"
        style={{
          borderWidth: 2,
          borderColor: "black",
        }}
        onPress={() => router.replace("/register")}
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
  or: {
    textAlign: "center",
    fontSize: 16,
  },
  error: {
    color: "red",
    fontSize: 14,
  },
});
