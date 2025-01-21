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
import { fetchUserByEmail } from "./api";
import { UserContext } from "../Contexts/UserContexts";
import { router } from "expo-router";
import { Socket } from "./socketConfig";

const SignInScreen = () => {
  const userContext = useContext(UserContext);
  if (!userContext) throw new Error("User does not exist");

  const { setUser } = userContext;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      const user = await fetchUserByEmail(email);
      user.hand = []
      console.log("User data:", user);

      try {
        Socket.connect();
      } catch (socketError) {
        setError(
          "There was an issue connecting to the server. Please try again."
        );
        return;
      }


      setUser(user);
      router.push("/home");
    } catch (err: any) {
      if (err.code === "auth/invalid-credential") {
        setError("Incorrect password or email. Please try again.");
        console.log(err);
      } else {
        setError("An error occurred. Please try again.");
      }
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
        keyboardType="email-address"
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
        <Button title="Sign In" onPress={handleSignIn} disabled={loading} />
      )}
      <Button
        title="Don't have an account? Sign Up"
        onPress={() => router.push("/signup")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#f7f7f7",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "bold",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    borderRadius: 4,
    backgroundColor: "#fff",
  },
  error: { color: "red", marginBottom: 12, textAlign: "center" },
});

export default SignInScreen;
