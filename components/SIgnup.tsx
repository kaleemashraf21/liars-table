import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebaseConfig";
import { createUser } from "./api";

export const SignUpScreen = ({ navigation }: { navigation: any }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const avatar =
    "https://icons.veryicon.com/png/o/miscellaneous/rookie-official-icon-gallery/225-default-avatar.png";
  const handleSignUp = async () => {
    if (email && password && username) {
      setLoading(true);
      try {
        // Try to create the user in Firebase
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const currentUser = userCredential.user;
        if (currentUser) {
          // Once Firebase user is created, proceed to create the user in the backend
          const idToken = await currentUser.getIdToken();
          // Use the createUser function from api.ts to create the user in the backend
          const response = await createUser(email, username, avatar, idToken);
          if (response) {
            Alert.alert(
              "User Created",
              "Your account has been created successfully!",
              [{ text: "OK", onPress: () => navigation.navigate("SignIn") }]
            );
          }
        }
      } catch (err: any) {
        if (err.code === "auth/email-already-in-use") {
          setError(
            "This email is already in use. Please choose a different email."
          );
        } else {
          setError("An error occurred. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    } else {
      setError("Please complete all relevant fields.");
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Your Account</Text>
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
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {loading ? (
        <ActivityIndicator size="large" color="#0000FF" />
      ) : (
        <Button title="Sign Up" onPress={handleSignUp} />
      )}
      <Button
        title="Already have an account? Sign In"
        onPress={() => navigation.navigate("SignIn")}
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