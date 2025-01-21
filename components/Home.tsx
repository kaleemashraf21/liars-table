import React, { useContext, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { UserContext } from "../Contexts/UserContexts"; // Import UserContext
import { auth } from "@/firebaseConfig";
import { router } from "expo-router";
import Ionicons from "react-native-vector-icons/Ionicons"; // Import Ionicons for the logout icon

const HomeScreen = ({ navigation }: { navigation: any }) => {
  const userContext = useContext(UserContext); // Access user from context
  if (!userContext) {
    throw new Error("UserContext is undefined");
  }
  const { user, setUser } = userContext; // Destructure user from context

  const [buttonPressed, setButtonPressed] = useState(false); // Track if button is pressed

  const handleJoinGame = async () => {
    router.push("/joingame");
  };

  const handleLogOut = async () => {
    await auth.signOut(); // Firebase sign-out
    setUser(null); // Clear user context
    router.push("/signin"); // Navigate to SignIn screen
  };

  return (
    <View style={styles.container}>
      {/* Log Out Button with Icon and Text */}
      <TouchableOpacity onPress={handleLogOut} style={styles.logoutButton}>
        <Ionicons name="log-out-outline" size={30} color="#9C1C1C" />
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>

      {/* Welcome back message with user's name */}
      <Text style={styles.title}>Welcome Back!</Text>
      <Text style={styles.username}>{user?.username}</Text>

      {/* Button to create a game */}
      <TouchableOpacity
        style={[styles.createGameButton, buttonPressed && styles.buttonPressed]} // Apply hover effect
        onPressIn={() => setButtonPressed(true)} // Activate button press state
        onPressOut={() => setButtonPressed(false)} // Deactivate on press release
        onPress={handleJoinGame}
      >
        <Text style={styles.buttonText}>Create Game</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f7f7f7", // Ensure background is consistent
  },
  title: {
    fontSize: 48, // Increased title size
    fontFamily: "Vanilla-Whale", // Set custom font for the title
    marginBottom: 10,
    color: "#333", // Set text color for contrast
  },
  username: {
    fontSize: 48,
    fontFamily: "Vanilla-Whale", // Custom font for username
    fontWeight: "bold",
    color: "#333", // Ensure visibility against background
    marginBottom: 40, // Space before the game button
  },
  logoutButton: {
    position: "absolute",
    top: 20,
    right: 16,
    alignItems: "center", // Align icon and text vertically
    backgroundColor: "transparent", // Transparent background
    padding: 10,
  },
  logoutText: {
    color: "#9C1C1C", // Text color for the "Log Out" label
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 4, // Space between the icon and the text
  },
  createGameButton: {
    backgroundColor: "#d2692f", // Using the same color theme
    paddingVertical: 10, // Smaller padding for a smaller button
    paddingHorizontal: 20, // Less horizontal padding
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20, // Space between username and button
    elevation: 3, // Slight shadow for better visibility
  },
  buttonPressed: {
    opacity: 0.7, // Simulate hover effect
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default HomeScreen;
