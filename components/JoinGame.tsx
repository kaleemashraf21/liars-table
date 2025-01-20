import React, { useContext, useState, useEffect } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { UserContext } from "../Contexts/UserContexts";
import { auth } from "../firebaseConfig";
import { Socket } from "./socketConfig";
import { ScrollView } from "react-native-gesture-handler";
import { router } from "expo-router";

const JoinGame = () => {
  const [roomList, setRoomList] = useState([]);
  const userContext = useContext(UserContext);

  if (!userContext) {
    throw new Error("UserContext is undefined");
  }

  const { user, setUser } = userContext;
  console.log(" in join game component.");

  // Listen for activeRooms event after socket connection
  useEffect(() => {
    Socket.on("activeRooms", (availableRooms: []) => {
      setRoomList(availableRooms); // Update room list when activeRooms is emitted
    });

    return () => {
      Socket.off("activeRooms");
    };
  }, []);

  const handleLogOut = async () => {
    Socket.disconnect();
    await auth.signOut();
    setUser(null);
    router.push("/signin");
  };
  const handleGameArea = async () => {
    router.push("/Pages/Game");
  }

  const handleRefresh = () => {
    console.log("Requesting active rooms from server...");
    Socket.emit("requestActiveRooms");
  };


  useEffect(() => {
    console.log("Socket connected status:", Socket.connected);
    if (Socket.connected) {
      Socket.emit("requestActiveRooms");
      console.log("Requesting rooms...");
    }
    Socket.on("activeRooms", (availableRooms: []) => {
      console.log("Received activeRooms:", availableRooms);
      setRoomList(availableRooms);
    });
    return () => {
      Socket.off("activeRooms");
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.games}>
        <Text>Games Options</Text>
        {/* <ScrollView>
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
        </ScrollView> */}
      </View>

      <Text>Join a Game</Text>
      <Button
        title="Create a Room"
        onPress={() => {
          router.push("/creategame");
        }}
      />
      <Button title="Taiga Testing Stuff" onPress={handleGameArea} />
      <Button title="Log Out" onPress={handleLogOut} />
      <Button
        title="Home"
        onPress={() => {
          router.push("/home");
        }}
      />
      <Button title="refresh lobby" onPress={handleRefresh} />
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
