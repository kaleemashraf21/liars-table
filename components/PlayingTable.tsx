import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Modal,
  TouchableOpacity,
  ScrollView,
  Animated,
} from "react-native";
import { Socket } from "./socketConfig";
import { DrawButton } from "./DrawCard";
import GameRules from "./GamesRules";
import Icon from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons";
import { router } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import { UserContext, User } from "@/Contexts/UserContexts";
import { PlayerHand } from "./PlayerHand";

const { width, height } = Dimensions.get("window");

interface Player {
  socketId: string;
  username: string;
  avatar: string;
  hand: any[];
}

interface SocketPlayerJoinedPayload {
  players: Player[];
}

const PlayerSlot: React.FC<{
  player: Player | null;
  position: string;
}> = ({ player, position }) => {
  return (
    <View style={styles.playerSlot}>
      <Text style={styles.playerName}>
        {player ? player.username : `Empty ${position}`}
      </Text>
    </View>
  );
};

const PlayingTable: React.FC = () => {
  const [players, setPlayers] = useState<any>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const params = useLocalSearchParams();
  const roomName = params.roomName as string;
  const userContext = useContext(UserContext);

  if (!userContext) {
    throw new Error("UserContext is undefined");
  }
  const { user, setUser } = userContext;

  const callBullshit = () => {
    console.log("bullshit");
  };

  useEffect(() => {
    if (!roomName) return;
    Socket.on("playerJoined", (data: SocketPlayerJoinedPayload) => {
      if (data && Array.isArray(data.players)) {
        setPlayers(data.players);
      }
    });

    // Request initial room state
    Socket.emit("requestRoomState", roomName, (response: any) => {
      if (response.success && response.players) {
        setPlayers(response.players);
      }
    });

    return () => {
      Socket.off("playerJoined");
    };
  }, [roomName]);

  const showModal = () => setModalVisible(true);
  const hideModal = () => setModalVisible(false);

  const leaveRoom = () => {
    if (roomName) {
      Socket.emit("leaveRoom", roomName, (response: any) => {
        if (response.success) {
          setUser((prevUser: User) => {
            return { ...prevUser, hand: [] };
          });
          router.push("/joingame");
        }
      });
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={callBullshit}>
        <Text style={styles.bullshitButton}>BULLSHIT</Text>
      </TouchableOpacity>

      {/* Center game area */}
      <View style={styles.deck}>
        <DrawButton players={players} />
      </View>

      {/* Player Slots */}
      <View style={styles.top}>
        <PlayerSlot position="top" player={players[0] || null} />
      </View>
      <View style={styles.bottom}>
        <PlayerSlot position="bottom" player={players[2] || null} />
      </View>
      <View style={styles.right}>
        <PlayerSlot position="right" player={players[1] || null} />
      </View>
      <View style={styles.left}>
        <PlayerSlot position="left" player={players[3] || null} />
      </View>

      {/* Player's hand */}
      <PlayerHand />

      {/* Info Button */}
      <TouchableOpacity onPress={showModal} style={styles.infoButton}>
        <Icon name="info-circle" size={40} color="black" />
      </TouchableOpacity>

      {/* Logout Button */}
      <TouchableOpacity onPress={leaveRoom} style={styles.leaveRoomButton}>
        <Ionicons name="log-out-outline" size={40} color="black" />
      </TouchableOpacity>

      {/* Modal for Game Rules */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={hideModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView>
              <GameRules />
            </ScrollView>
            <TouchableOpacity onPress={hideModal} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  playerSlot: {
    position: "absolute",
    backgroundColor: "#4B5563",
    padding: 16,
    borderRadius: 8,
    width: 100,
    height: 100,
    alignItems: "center",
  },
  playerName: {
    color: "white",
    fontWeight: "bold",
    marginBottom: 8,
  },
  deck: {
    position: "absolute",
    width: 100,
    height: 100,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    top: height * 0.35,
    left: width * 0.5 - 50,
  },
  top: {
    top: height * 0.0,
    left: width * 0.5 - 50,
  },
  left: {
    top: height * 0.35,
    left: width * 0.05,
  },
  right: {
    top: height * 0.35,
    left: width * 0.7,
  },
  bottom: {
    top: height * 0.7,
    left: width * 0.5 - 50,
  },
  infoButton: {
    position: "absolute",
    bottom: 10,
    right: 20,
  },
  bullshitButton: {
    position: "absolute",
    top: 530,
    right: 20,
    backgroundColor: "red",
    borderRadius: 20,
    padding: 10,
    elevation: 8,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.7,
    shadowRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  leaveRoomButton: {
    position: "absolute",
    bottom: 10,
    left: 20,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    maxHeight: "70%",
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: "#4B5563",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default PlayingTable;
