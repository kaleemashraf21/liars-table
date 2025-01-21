import React, { useState, useContext } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
} from "react-native";
import { useFonts } from "expo-font";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebaseConfig";
import { fetchUserByEmail } from "./api";
import { UserContext } from "../Contexts/UserContexts";
import { router } from "expo-router";
import { Socket } from "./socketConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { createUser } from "./api";

const SignInScreen = () => {
  const [isLoaded] = useFonts({
    "Vanilla-Whale": require("../assets/fonts/Vanilla_Whale.otf"),
  });

  const userContext = useContext(UserContext);
  if (!userContext) throw new Error("User does not exist");

  const { setUser } = userContext;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const showModal = () => setModalVisible(true);
  const hideModal = () => setModalVisible(false);

  const handleSignIn = async () => {
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      const user = await fetchUserByEmail(email);
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

  // Display loading indicator if fonts are not loaded yet
  if (!isLoaded) {
    return <ActivityIndicator size="large" color="#0000FF" />;
  }

  const avatar =
    "https://icons.veryicon.com/png/o/miscellaneous/rookie-official-icon-gallery/225-default-avatar.png";

  const handleOkay = () => {
    hideModal();
    setEmail("");
    setPassword("");
    setUsername("");
    setError("");
  };

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
            [{ text: "OK", onPress: () => handleOkay() }]
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
      <Image
        style={styles.tinyLogo}
        source={require("../assets/images/logo.png")}
      />
      <Text style={styles.title}>Welcome Liars</Text>

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
        <TouchableOpacity style={styles.signInButton} onPress={handleSignIn}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>
      )}
      <Modal animationType="slide" transparent={false} visible={modalVisible}>
        <View style={styles.container}>
          <Text style={styles.title}>
            Create Your Account{" "}
            <Image
              style={styles.Logo}
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
            <TouchableOpacity
              style={styles.signUpButton}
              onPress={handleSignUp}
            >
              <Text style={styles.buttonText}>Let’s Get Started!</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={hideModal} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>
              Already have an account? Sign In
            </Text>
          </TouchableOpacity>
          {/* <TouchableOpacity
        style={styles.signInButton}
        onPress={() => router.push("/signin")}
      >
        <Text style={styles.buttonText}>Already have an account? Sign In</Text>
      </TouchableOpacity> */}
        </View>
      </Modal>
      <TouchableOpacity style={styles.signUpButton} onPress={showModal}>
        <Text style={styles.buttonText}>Ready to join us? Sign up!</Text>
      </TouchableOpacity>
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
    fontSize: 60,
    fontFamily: "Vanilla-Whale",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
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
  signInButton: {
    backgroundColor: "#d2692f", // Hex color for the button
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
  },
  signUpButton: {
    backgroundColor: "#d2692f", // Hex color for the button
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
    width: 200,
    height: 200,
    resizeMode: "contain", // Ensure the image scales well
    alignSelf: "center",
    marginBottom: 20, // Adds space between the logo and the form
  },
  error: {
    color: "#9C1C1C",
    marginBottom: 12,
    textAlign: "center",
  },
  closeButton: {
    marginTop: 20, // Place it at the bottom
    bottom: 20, // 20px from the bottom of the modal
    alignItems: "center",
    justifyContent: "center",
    //transform: [{ translateX: -20 }], // Offset to center the X properly
    backgroundColor: "transparent", // No background
    padding: 10,
    borderRadius: 50, // Round shape
  },
  closeButtonText: {
    color: "#9C1C1C", // Red color for the X button
    fontSize: 15,
    fontWeight: "bold",
  },
  Logo: {
    width: 70,
    height: 70,
    resizeMode: "contain", // Ensure the image scales well
    alignSelf: "flex-end",
    marginBottom: 20, // Adds space between the logo and the form
  },
});

export default SignInScreen;
