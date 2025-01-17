import React, { useContext, useState } from "react";
import { View, Text, Button, StyleSheet, TextInput } from "react-native";
import { UserContext } from "../Contexts/UserContexts";
import { auth } from "../firebaseConfig";
import { socket } from "./socketConfig";
import { router } from "expo-router";

export const CreateGame = ({ navigation }: { navigation: any }) => {
  const [password, setPassword] = useState("");
  const [roomName, setRoomName] = useState("");
  const userContext = useContext(UserContext);

  if (!userContext) {
    throw new Error("UserContext is undefined");
  }

  console.log("in create game");
  const { user, setUser } = userContext;

  const handleSubmit = async () => {
    const room = { password: password, roomName: roomName };
    console.log("Submitting createRoom request with data:", room);
    socket.emit("createRoom", room, (response: any) => {
      console.log("Server response to createRoom:", response);
    });
    setPassword("");
    setRoomName("");
  };

  const handleJoinGames = async () => {
    router.push("/creategame");
  };

  const handleLogOut = async () => {
    await auth.signOut();
    setUser(null);
    router.push("/signin");
  };

  return (
    <View>
      <TextInput
        placeholder="password (optional)"
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        placeholder="roomName"
        value={roomName}
        onChangeText={setRoomName}
      />
      <Button title="submit form" onPress={handleSubmit} />
      <Button
        title="Home"
        onPress={() => {
          router.push("/home");
        }}
      />
      <Button title="back to join" onPress={handleJoinGames} />
    </View>
  );
};
