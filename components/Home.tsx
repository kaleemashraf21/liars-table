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

  const [isLogoutVisible, setIsLogoutVisible] = useState(false); // State to control visibility of logout

  const handleJoinGame = async () => {
    router.push("/joingame");
  };

  const handleLogOut = async () => {
    await auth.signOut(); // Firebase sign-out
    setUser(null); // Clear user context
    router.push("/signin"); // Navigate to SignIn screen
  };

  const toggleLogoutVisibility = () => {
    setIsLogoutVisible((prevState) => !prevState); // Toggle visibility of the logout section
  };

  return (
    <View style={styles.container}>
      {/* User Avatar */}
      <TouchableOpacity
        style={styles.avatarContainer}
        onPress={toggleLogoutVisibility}
      >
        <Ionicons name="person-circle-outline" size={60} color="#333" />
      </TouchableOpacity>

      {/* Log Out Icon and Text, only visible when isLogoutVisible is true */}
      {isLogoutVisible && (
        <View style={styles.logoutContainer}>
          <TouchableOpacity onPress={handleLogOut} style={styles.logoutItem}>
            <Ionicons name="log-out-outline" size={24} color="#9C1C1C" />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Welcome back message with user's name */}
      <Text style={styles.title}>Welcome Back!</Text>
      <Text style={styles.username}>{user?.username}</Text>

      {/* Button to create a game */}
      <TouchableOpacity
        style={styles.createGameButton}
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
  avatarContainer: {
    position: "absolute",
    top: 20,
    right: 14,
    backgroundColor: "transparent",
    padding: 10,
  },
  logoutContainer: {
    position: "absolute",
    top: 85, // Position logout section below avatar
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
  },
  logoutItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoutText: {
    color: "#9C1C1C",
    fontSize: 16, // Smaller text size for logout text
    fontWeight: "bold",
    marginLeft: 10, // Space between the icon and the text
  },
  title: {
    fontSize: 50, // Larger title
    fontFamily: "Vanilla-Whale", // Set custom font for the title
    marginBottom: 10,
    color: "#333", // Set text color for contrast
  },
  username: {
    fontSize: 50,
    fontFamily: "Vanilla-Whale", // Custom font for username
    fontWeight: "bold",
    color: "#333", // Ensure visibility against background
    marginBottom: 40, // Space before the game button
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
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default HomeScreen;
