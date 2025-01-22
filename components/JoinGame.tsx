import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { UserContext } from "../Contexts/UserContexts";
import { auth } from "../firebaseConfig";
import { Socket } from "./socketConfig";
import { router } from "expo-router";
import Ionicons from "react-native-vector-icons/Ionicons";
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
  const [isLogoutVisible, setIsLogoutVisible] = useState(false);
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
    if (user === null) {
      console.error("User data is missing. Cannot join room.");
      return;
    }
    Socket.emit(
      "joinRoom",
      roomName,
      {
        password,
        username: user.username,
        avatar: user.avatar,
      },
      (response: any) => {
        if (response.success) {
          router.push({
            pathname: "/Game",
            params: { roomName: roomName },
          });
        } else {
          alert(response.message);
        }
      }
    );
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
  const toggleLogoutVisibility = () => {
    setIsLogoutVisible((prevState) => !prevState);
  };
  return (
    <View style={styles.container}>
      {/* Back Icon at top-right corner */}
      <TouchableOpacity
        style={styles.backIconContainer}
        onPress={() => router.push("/creategame")}
      >
        <Ionicons name="arrow-back-circle-outline" size={40} color="#333" />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.avatarContainer}
        onPress={toggleLogoutVisibility}
      >
        <Ionicons name="person-circle-outline" size={60} color="#333" />
      </TouchableOpacity>

      {isLogoutVisible && (
        <View style={styles.logoutContainer}>
          <TouchableOpacity onPress={handleLogOut} style={styles.logoutItem}>
            <Ionicons name="log-out-outline" size={24} color="#9C1C1C" />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      )}
      {/* Title: Available Rooms */}
      <Text style={styles.title}>Available Rooms</Text>
      {/* Game Room Dropdown */}
      <Pressable
        style={styles.dropdownHeader}
        onPress={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        <Text style={styles.dropdownHeaderText}>
          Select a Game Room ({roomList.length} available)
        </Text>
      </Pressable>
      {/* Available Rooms List */}
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
      {/* Button Container (Buttons below the room list) */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.createGameButton}
          onPress={handleRefresh}
        >
          <Text style={styles.buttonText}>Refresh Rooms</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.createGameButton}
          onPress={() => router.push("/creategame")}
        >
          <Text style={styles.buttonText}>Create New Game</Text>
        </TouchableOpacity>
      </View>
      {/* Password Modal */}
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
              <TouchableOpacity
                onPress={handlePasswordSubmit}
                style={styles.modalButton}
              >
                <Text style={styles.buttonText}>Submit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setIsPasswordModalVisible(false)}
                style={[styles.modalButton, { backgroundColor: "red" }]}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
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
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#F7F7F7",
  },
  backIconContainer: {
    position: "absolute",
    top: 50,
    left: 25,
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
    right: 14,
    backgroundColor: "transparent",
    padding: 10,
  },
  logoutContainer: {
    position: "absolute",
    bottom: 100,
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
    fontSize: 30,
    fontFamily: "Vanilla-Whale",
    marginBottom: 10,
    color: "#333",
    textAlign: "center",
  },
  dropdownHeader: {
    backgroundColor: "#F0F0F0",
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
    width: "100%",
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
    fontSize: 12,
    color: "#888",
  },
  noRooms: {
    padding: 15,
    textAlign: "center",
    color: "#888",
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 8,
    width: "80%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  passwordInput: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    backgroundColor: "#D2692F",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: "48%",
    alignItems: "center",
  },
});
export default JoinGame;
