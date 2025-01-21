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
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "@/firebaseConfig";
import { fetchUserByEmail, createUser } from "./api";
import { UserContext } from "../Contexts/UserContexts";
import { router } from "expo-router";
import { Socket } from "./socketConfig";

// Default avatar image URL
const avatar =
  "https://icons.veryicon.com/png/o/miscellaneous/rookie-official-icon-gallery/225-default-avatar.png";

const SignInScreen = () => {
  const [isLoaded] = useFonts({
    "Vanilla-Whale": require("../assets/fonts/Vanilla_Whale.otf"),
  });

  const userContext = useContext(UserContext);
  if (!userContext) {
    throw new Error("User does not exist");
  }

  const { setUser } = userContext;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // Modal control
  const showModal = () => {
    setError("");
    setEmail("");
    setPassword("");
    setUsername("");
    setModalVisible(true);
  };

  const hideModal = () => {
    setError("");
    setEmail("");
    setPassword("");
    setUsername("");
    setModalVisible(false);
  };

  // Sign-in handler
  const handleSignIn = async () => {
    setError("");
    if (!email || !password) {
      setError("Please fill in all required fields.");
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
    } catch (err) {
      console.log(err);
      handleAuthError(err);
    } finally {
      setLoading(false);
    }
  };

  // Sign-up handler
  const handleSignUp = async () => {
    setError("");
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
        const response = await createUser(email, username, avatar, idToken, []);

        if (response) {
          Alert.alert(
            "Account Created",
            "Your account has been successfully created!",
            [{ text: "OK", onPress: handleOkay }]
          );
        }
      }
    } catch (err) {
      handleAuthError(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle common Firebase authentication errors
  const handleAuthError = (err: any) => {
    switch (err.code) {
      case "auth/email-already-in-use":
        setError("This email is already registered. Try logging in.");
        break;
      case "auth/invalid-email":
        setError("Please enter a valid email address.");
        break;
      case "auth/weak-password":
        setError("Your password must be at least 6 characters long.");
        break;
      case "auth/wrong-password":
        setError("Incorrect password. Please try again.");
        break;
      case "auth/invalid-credential":
        setError("The email or password you entered is incorrect.");
        break;
      case "auth/network-request-failed":
        setError("Network error. Please check your connection.");
        break;
      default:
        setError("An unexpected error occurred. Please try again later.");
    }
  };

  // Reset fields after successful account creation
  const handleOkay = () => {
    hideModal();
    setEmail("");
    setPassword("");
    setUsername("");
    setError("");
  };

  // Display loading indicator if fonts are not loaded
  if (!isLoaded) {
    return <ActivityIndicator size="large" color="#9C1C1C" />;
  }

  return (
    <View style={styles.container}>
      <Image
        style={styles.tinyLogo}
        source={require("../assets/images/logo.png")}
      />
      <Text style={styles.title}>Welcome Liars</Text>

      {/* Email and Password Inputs for Sign In */}
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

      {error && <Text style={styles.error}>{error}</Text>}

      {loading ? (
        <ActivityIndicator size="large" color="#9C1C1C" />
      ) : (
        <TouchableOpacity style={styles.signInButton} onPress={handleSignIn}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>
      )}

      {/* Modal for Sign-Up */}
      <Modal animationType="slide" transparent={false} visible={modalVisible}>
        <View style={styles.container}>
          <Text style={styles.title}>
            Create Your Account{" "}
            <Image
              style={styles.logo}
              source={require("../assets/images/logo.png")}
            />
          </Text>

          {/* Email, Password and Username Inputs for Sign Up */}
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

          {error && <Text style={styles.error}>{error}</Text>}

          {loading ? (
            <ActivityIndicator size="large" color="#9C1C1C" />
          ) : (
            <TouchableOpacity
              style={styles.signUpButton}
              onPress={handleSignUp}
            >
              <Text style={styles.buttonText}>Let’s Get Started!</Text>
            </TouchableOpacity>
          )}

          {/* Close Modal */}
          <TouchableOpacity onPress={hideModal} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>
              Already have an account? Sign In
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Trigger for Sign-Up Modal */}
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
    backgroundColor: "#d2692f",
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
  },
  signUpButton: {
    backgroundColor: "#d2692f",
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 8,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  tinyLogo: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    alignSelf: "center",
    marginBottom: 20,
  },
  error: {
    color: "#9C1C1C",
    marginBottom: 12,
    textAlign: "center",
  },
  closeButton: {
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    backgroundColor: "transparent",
  },
  closeButtonText: {
    color: "#9C1C1C",
    fontSize: 15,
    fontWeight: "bold",
  },
  logo: {
    width: 70,
    height: 70,
    resizeMode: "contain",
    alignSelf: "flex-end",
    marginBottom: 20,
  },
});

export default SignInScreen;
