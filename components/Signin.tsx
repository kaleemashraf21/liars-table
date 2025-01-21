import React, { useState, useContext, useEffect} from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Modal,
} from "react-native";
import { useFonts } from 'expo-font';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebaseConfig";
import { fetchUserByEmail } from "./api";
import { UserContext } from "../Contexts/UserContexts";
import { router } from "expo-router";
import { Socket } from "./socketConfig";
import { SignUpScreen } from "./SIgnup";
import * as SplashScreen from 'expo-splash-screen';




const SignInScreen = () => {
  const [isLoaded] = useFonts({
    'Vanilla-Whale': require('../assets/fonts/Vanilla_Whale.otf'),
  });

  if (!isLoaded) {
    return null; // Or a loading screen
  }
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

  const [modalVisible, setModalVisible] = useState(false); // Modal visibility state

  const showModal = () => setModalVisible(true);
  const hideModal = () => setModalVisible(false);

  return (
    <View style={styles.container}>
      <Image    
        style={styles.tinyLogo}
        source={require('../assets/images/logo.png')}/>
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
        <Button title="Sign In" onPress={handleSignIn} disabled={loading} color={"#d2692f"} />
      )}
      <TouchableOpacity style={styles.signUpButton} onPress={showModal}>
       
       <Text>Don't have an account? Sign up here.</Text>

      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={hideModal}
      >
      <SignUpScreen />
      <TouchableOpacity style={styles.signUpButton} onPress={hideModal}>
      <Text>Already have an account? Sign In</Text>
      </TouchableOpacity>
      </Modal>
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
  signUpButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#4B5563",
    borderRadius: 50,
    padding: 10,
    elevation: 5,
  },
  tinyLogo: {
    width: 200,
    height: 200,
    padding: 100,
    top: -50,
    alignSelf: 'center'
  },
  error: { color: "red", marginBottom: 12, textAlign: "center" },
});

export default SignInScreen;
