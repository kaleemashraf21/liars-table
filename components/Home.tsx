import React, { useContext, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { UserContext } from "../Contexts/UserContexts";
import { auth } from "@/firebaseConfig";
import { router } from "expo-router";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
import Ionicons from "react-native-vector-icons/Ionicons";

const HomeScreen = () => {
  const userContext = useContext(UserContext);
  if (!userContext) {
    throw new Error("UserContext is undefined");
  }
  const { user, setUser } = userContext;

  const [isLogoutVisible, setIsLogoutVisible] = useState(false);

  const handleJoinGame = async () => {
    router.push("/joingame");
  };

  const handleLogOut = async () => {
    await auth.signOut();
    setUser(null);
    router.push("/signin");
  };

  const toggleLogoutVisibility = () => {
    setIsLogoutVisible((prevState) => !prevState);
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
        <Text style={styles.buttonText}>Start Playing</Text>
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
    backgroundColor: "#f7f7f7",
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
    top: 85,
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
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  title: {
    fontSize: 50,
    fontFamily: "Vanilla-Whale",
    marginBottom: 10,
    color: "#333",
  },
  username: {
    fontSize: 50,
    fontFamily: "Vanilla-Whale",
    color: "#333",
    marginBottom: 40,
  },
  createGameButton: {
    backgroundColor: "#d2692f",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default HomeScreen;
