import React, { useContext, useState, useEffect } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { UserContext } from "../Contexts/UserContexts";
import { auth } from "../firebaseConfig";
import { socket } from "./socketConfig"; // Assuming socket is configured properly
import { ScrollView } from "react-native-gesture-handler";
import { router } from "expo-router";

const JoinGame = () => {
  const [roomList, setRoomList] = useState([]);
  const userContext = useContext(UserContext);

  if (!userContext) {
    throw new Error("UserContext is undefined");
  }

  const { user, setUser } = userContext;

  // Listen for activeRooms event after socket connection
  useEffect(() => {
    socket.on("activeRooms", (availableRooms: []) => {
      setRoomList(availableRooms); // Update room list when activeRooms is emitted
    });

    return () => {
      socket.off("activeRooms");
    };
  }, []);

  const handleLogOut = async () => {
    await auth.signOut();
    setUser(null);
    router.push("/signin");
  };

  return (
    <View style={styles.container}>
      <View style={styles.games}>
        <Text>Games Options</Text>
        <ScrollView>
          {roomList.map((room: any, index: number) => {
            return (
              <View style={styles.room} key={index}>
                <Text>
                  {room.roomName} (Players: {room.playerCount}/
                  {room.isPrivate ? "Private" : "Public"})
                </Text>
              </View>
            );
          })}
        </ScrollView>
      </View>

      <Text>Join a Game</Text>
      <Button
        title="Create a Room"
        onPress={() => {
          router.push("/creategame");
        }}
      />

      <Button title="Log Out" onPress={handleLogOut} />
      <Button
        title="Home"
        onPress={() => {
          router.push("/home");
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  games: {
    backgroundColor: "grey",
    width: 200,
    alignItems: "center",
    height: 300,
    borderRadius: 30,
  },
  room: { backgroundColor: "red", color: "yellow", padding: 10, margin: 5 },
});
export default JoinGame;
