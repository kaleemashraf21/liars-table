import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import { UserContext } from "../Contexts/UserContexts";
import { auth } from "../firebaseConfig";
import { Socket } from "./socketConfig";
import { router } from "expo-router";
import Ionicons from "react-native-vector-icons/Ionicons";
export const CreateGame = ({ navigation }: { navigation: any }) => {
  const [password, setPassword] = useState("");
  const [roomName, setRoomName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const userContext = useContext(UserContext);
  if (!userContext) {
    throw new Error("UserContext is undefined");
  }
  const { user, setUser } = userContext;
  const handleSubmit = async () => {
    if (!roomName.trim()) {
      Alert.alert("Error", "Room name is required");
      return;
    }
    if (!user || !user.username || !user.avatar) {
      Alert.alert("Error", "User data is missing. Please log in again.");
      return;
    }
    setIsLoading(true);
    const room = {
      password: password || null,
      roomName: roomName.trim(),
      username: user.username,
      avatar: user.avatar,
    };
    console.log("Submitting createRoom request with data:", room);
    Socket.emit(
      "createRoom",
      room,
      (response: { success: boolean; message: string }) => {
        console.log("Server response to createRoom:", response);
        setIsLoading(false);
        if (response.success) {
          setPassword("");
          setRoomName("");
          router.push({
            pathname: "/Game",
            params: { roomName: room.roomName },
          });
        } else {
          Alert.alert("Error", response.message);
        }
      }
    );
  };
  const handleJoinGames = () => {
    router.push("/joingame");
  };
  const handleLogOut = async () => {
    await auth.signOut();
    setUser(null);
    router.push("/signin");
  };
  return (
    <View style={styles.container}>
      {/* Back Icon at top-right corner */}
      <TouchableOpacity
        style={styles.backIconContainer}
        onPress={() => router.push("/joingame")}
      >
        <Ionicons name="arrow-back-circle-outline" size={40} color="#333" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.avatarContainer} onPress={handleLogOut}>
        <Ionicons name="person-circle-outline" size={60} color="#333" />
      </TouchableOpacity>
      {/* Title */}
      <Text style={styles.title}>Create New Game</Text>
      {/* Room Name Input */}
      <TextInput
        style={styles.input}
        placeholder="Room Name (required)"
        value={roomName}
        onChangeText={setRoomName}
        editable={!isLoading}
      />
      {/* Password Input */}
      <TextInput
        style={styles.input}
        placeholder="Password (optional)"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        editable={!isLoading}
      />
      {/* Button Container */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.createGameButton}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? "Creating..." : "Create Room"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.createGameButton}
          onPress={handleJoinGames}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>Join Existing Room</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#F7F7F7",
  },
  backIconContainer: {
    position: "absolute",
    top: 50,
    left: 20,
    padding: 10,
  },
  backHomeText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 5,
    color: "#333",
  },
  avatarContainer: {
    position: "absolute",
    top: 40,
    right: 20,
    backgroundColor: "transparent",
    padding: 10,
  },
  title: {
    fontSize: 30,
    fontFamily: "Vanilla-Whale",
    marginBottom: 10,
    color: "#333",
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
    borderRadius: 5,
    width: "80%",
  },
  buttonContainer: {
    marginTop: 30,
    gap: 15,
    width: "100%",
    alignItems: "center",
  },
  createGameButton: {
    backgroundColor: "#D2692F",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    elevation: 3,
    width: "80%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
export default CreateGame;
