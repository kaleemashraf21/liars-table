import React, { useContext, useState } from "react";
import { View, Text, Button, StyleSheet, TextInput, Alert } from "react-native";
import { UserContext } from "../Contexts/UserContexts";
import { auth } from "../firebaseConfig";
import { Socket } from "./socketConfig";
import { router } from "expo-router";

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
          // Update to pass roomName as a parameter
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
      <TextInput
        style={styles.input}
        placeholder="Room Name (required)"
        value={roomName}
        onChangeText={setRoomName}
        editable={!isLoading}
      />
      <TextInput
        style={styles.input}
        placeholder="Password (optional)"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        editable={!isLoading}
      />
      <View style={styles.buttonContainer}>
        <Button
          title={isLoading ? "Creating..." : "Create Room"}
          onPress={handleSubmit}
          disabled={isLoading}
        />
        <Button
          title="Join Existing Room"
          onPress={handleJoinGames}
          disabled={isLoading}
        />
        <Button
          title="Back to Home"
          onPress={() => router.push("/home")}
          disabled={isLoading}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  buttonContainer: {
    gap: 10,
  },
});
