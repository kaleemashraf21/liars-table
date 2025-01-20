import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Pressable,
  Modal,
  TextInput,
} from "react-native";
import { UserContext } from "../Contexts/UserContexts";
import { auth } from "../firebaseConfig";
import { Socket } from "./socketConfig";
import { router } from "expo-router";

interface Room {
  roomName: string;
  playerCount: number;
  isPrivate: boolean;
  password?: string;
}

const JoinGame = () => {
  const [roomList, setRoomList] = useState<Room[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [password, setPassword] = useState("");
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const userContext = useContext(UserContext);

  if (!userContext) {
    throw new Error("UserContext is undefined");
  }

  const { user, setUser } = userContext;

  useEffect(() => {
    if (Socket.connected) {
      Socket.emit("requestActiveRooms");
    }
    Socket.on("activeRooms", (availableRooms: Room[]) => {
      console.log("Received rooms:", availableRooms);
      setRoomList(availableRooms);
    });
    return () => {
      Socket.off("activeRooms");
    };
  }, []);

  const handleJoinRoom = (room: Room) => {
    if (room.isPrivate) {
      setSelectedRoom(room);
      setIsPasswordModalVisible(true);
    } else {
      attemptJoinRoom(room.roomName, null);
    }
  };

  const attemptJoinRoom = (roomName: string, password: string | null) => {
    Socket.emit("joinRoom", roomName, password, (response: any) => {
      if (response.success) {
        router.push("/Pages/Game");
      } else {
        console.error("Failed to join room:", response.message);
        alert(response.message);
      }
    });
  };

  const handlePasswordSubmit = () => {
    if (selectedRoom) {
      attemptJoinRoom(selectedRoom.roomName, password);
      setPassword("");
      setIsPasswordModalVisible(false);
    }
  };

  const handleLogOut = async () => {
    Socket.disconnect();
    await auth.signOut();
    setUser(null);
    router.push("/signin");
  };

  const handleRefresh = () => {
    Socket.emit("requestActiveRooms");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Available Games</Text>

      <Pressable
        style={styles.dropdownHeader}
        onPress={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        <Text style={styles.dropdownHeaderText}>
          Select a Game Room ({roomList.length} available)
        </Text>
      </Pressable>

      {isDropdownOpen && (
        <View style={styles.dropdownContent}>
          {roomList.length > 0 ? (
            roomList.map((room, index) => (
              <Pressable
                key={index}
                style={styles.roomItem}
                onPress={() => handleJoinRoom(room)}
              >
                <Text style={styles.roomName}>{room.roomName}</Text>
                <Text style={styles.roomInfo}>
                  Players: {room.playerCount}/4 •{" "}
                  {room.isPrivate ? "Private" : "Public"}
                </Text>
              </Pressable>
            ))
          ) : (
            <Text style={styles.noRooms}>No rooms available</Text>
          )}
        </View>
      )}

      <View style={styles.buttonContainer}>
        <Button title="Refresh Rooms" onPress={handleRefresh} />
        <Button
          title="Create New Game"
          onPress={() => router.push("/creategame")}
        />
        <Button title="Back to Home" onPress={() => router.push("/home")} />
      </View>

      {/* /password pop up area. */}
      <Modal
        visible={isPasswordModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsPasswordModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter Password</Text>
            <TextInput
              style={styles.passwordInput}
              secureTextEntry={true}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
            />
            <View style={styles.modalButtons}>
              <Button title="Submit" onPress={handlePasswordSubmit} />
              <Button
                title="Cancel"
                color="red"
                onPress={() => setIsPasswordModalVisible(false)}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  dropdownHeader: {
    backgroundColor: "#f0f0f0",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  dropdownHeaderText: {
    fontSize: 16,
    textAlign: "center",
  },
  dropdownContent: {
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    maxHeight: 300,
  },
  roomItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  roomName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  roomInfo: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  noRooms: {
    padding: 15,
    textAlign: "center",
    color: "#666",
  },
  buttonContainer: {
    marginTop: 20,
    gap: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  passwordInput: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 10,
  },
});

export default JoinGame;
