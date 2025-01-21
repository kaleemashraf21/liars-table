import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Image,
} from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebaseConfig";
import { createUser } from "./api";
import { router } from "expo-router";

export const SignUpScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const avatar =
    "https://icons.veryicon.com/png/o/miscellaneous/rookie-official-icon-gallery/225-default-avatar.png";

  const handleSignUp = async () => {
    if (!email || !password || !username) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const currentUser = userCredential.user;

      if (currentUser) {
        const idToken = await currentUser.getIdToken();
        const response = await createUser(email, username, avatar, idToken);

        if (response) {
          Alert.alert(
            "Account Created",
            "Your account has been successfully created!",
            [{ text: "OK", onPress: () => router.push("/home") }]
          );
        }
      }
    } catch (err: any) {
      if (err.code === "auth/email-already-in-use") {
        setError("This email is already in use.");
      } else if (err.code === "auth/invalid-email") {
        setError("Invalid email address.");
      } else if (err.code === "auth/weak-password") {
        setError("Password should be at least 6 characters.");
      } else {
        setError("An error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Create Your Account{" "}
        <Image
          style={styles.tinyLogo}
          source={require("../assets/images/logo.png")}
        />
      </Text>

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
        <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
          <Text style={styles.buttonText}>Let’s Get Started!</Text>
        </TouchableOpacity>
      )}

      {/* <TouchableOpacity
        style={styles.signInButton}
        onPress={() => router.push("/signin")}
      >
        <Text style={styles.buttonText}>Already have an account? Sign In</Text>
      </TouchableOpacity> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
    alignItems: "center",
    backgroundColor: "#f7f7f7",
  },
  title: {
    fontSize: 60,
    marginBottom: 20,
    textAlign: "center",
    color: "#000",
    fontFamily: "Vanilla-Whale", // Add the same font style if needed
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    borderRadius: 4,
    backgroundColor: "#fff",
    width: "100%",
  },
  signUpButton: {
    backgroundColor: "#d2692f", // Matching Hex Color to SignIn button
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    elevation: 3,
  },
  signInButton: {
    backgroundColor: "#d2692f", // Matching Hex Color to SignIn button
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 12,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    elevation: 3,
  },
  buttonText: {
    color: "#fff", // White text for contrast
    fontSize: 18,
    fontWeight: "bold",
  },
  tinyLogo: {
    width: 70,
    height: 70,
    resizeMode: "contain", // Ensure the image scales well
    alignSelf: "flex-end",
    marginBottom: 20, // Adds space between the logo and the form
  },
  error: {
    color: "red",
    marginBottom: 12,
    textAlign: "center",
  },
});
