import React, { useState, useContext } from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebaseConfig";
import { fetchUserByEmail } from "./api"; // Import fetchUserByEmail
import { UserContext } from "../Contexts/UserContexts"; // Import UserContext
import { router } from "expo-router";
import { Socket } from "./socketConfig";

const SignInScreen = ({ navigation }: { navigation: any }) => {
  const userContext = useContext(UserContext); // Access UserContext
  if (!userContext) {
    throw new Error("User does not exist");
  }
  const { setUser } = userContext;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSignIn = async () => {
    setLoading(true);
    try {
      // Sign in with Firebase Authentication
      await signInWithEmailAndPassword(auth, email, password);
      // Fetch user data by email
      const user = await fetchUserByEmail(email);
      console.log("User data:", user);

      // Connect socket after successful authentication
      Socket.connect();

      // Set user in context and navigate to Home screen
      setUser(user);
      router.push("/home");
    } catch (err: any) {
      setError("Incorrect email or password");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Liar's Table</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {loading ? (
        <ActivityIndicator size="large" color="#0000FF" />
      ) : (
        <Button title="Sign In" onPress={handleSignIn} />
      )}
      <Button
        title="Don't have an account? Sign Up"
        onPress={() => router.push("/signup")}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 16 },
  title: { fontSize: 24, marginBottom: 20, textAlign: "center" },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  error: { color: "red", marginBottom: 12 },
});
export default SignInScreen;
