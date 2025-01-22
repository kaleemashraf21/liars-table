import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Modal,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Socket } from "./socketConfig";
import { DrawButton } from "./DrawCard";
import { DeckArea } from "./DeckArea";
import { PlayerHand } from "./PlayerHand";
import GameRules from "./GamesRules";
import Icon from "react-native-vector-icons/FontAwesome";
import { useLocalSearchParams } from "expo-router";

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
      <View>
        <Text>Cards</Text>
      </View>
    </View>
  );
};

const PlayingTable: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const params = useLocalSearchParams();
  const roomName = params.roomName as string;

  const showModal = () => setModalVisible(true);
  const hideModal = () => setModalVisible(false);

  useEffect(() => {
    console.log("Setting up socket listeners for room:", roomName);

    // Set up a listener for all socket events (debug)
    const onAnyEvent = (eventName: string, ...args: any[]) => {
      console.log(`Socket event received - ${eventName}:`, args);
    };
    Socket.onAny(onAnyEvent);

    Socket.on("playerJoined", (data: { players: Player[] }) => {
      console.log("Received playerJoined event:", data);
      if (data && Array.isArray(data.players)) {
        setPlayers(data.players);
        console.log("Updated players state:", data.players);
      }
    });

    // Request current room state when component mounts
    if (roomName) {
      Socket.emit("requestRoomState", roomName, (response: any) => {
        console.log("Room state response:", response);
        if (response && response.players) {
          setPlayers(response.players);
        }
      });
    }

    return () => {
      console.log("Cleaning up socket listeners");
      Socket.off("playerJoined");
      Socket.offAny(onAnyEvent);
    };
  }, [roomName]);

  return (
    <View style={styles.container}>
      {/* Top player (first to join) */}
      <View style={styles.top}>
        <PlayerSlot position="top" player={players[0] || null} />
      </View>

      {/* Right player (second to join) */}
      <View style={styles.right}>
        <PlayerSlot position="right" player={players[1] || null} />
      </View>

      {/* Center game area */}
      <View style={styles.deck}>
        <DrawButton />
        <DeckArea />
      </View>

      {/* Bottom player (third to join) */}
      <View style={styles.bottom}>
        <PlayerSlot position="bottom" player={players[2] || null} />
      </View>

      {/* Left player (fourth to join) */}
      <View style={styles.left}>
        <PlayerSlot position="left" player={players[3] || null} />
      </View>

      {/* Player's hand */}
      <PlayerHand />

      {/* Rules Info Button */}
      <TouchableOpacity style={styles.infoButton} onPress={showModal}>
        <Icon name="info-circle" size={30} color="white" />
      </TouchableOpacity>

      {/* Rules Modal */}
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
    backgroundColor: "purple",
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
    bottom: 20,
    right: 20,
    backgroundColor: "#4B5563",
    borderRadius: 50,
    padding: 10,
    elevation: 5,
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
