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
import { Players } from "../@types/players";
import { DrawButton } from "./DrawCard";
import { DeckArea } from "./DeckArea";
import GameRules from "./GamesRules"; // Import GameRules component
import Icon from "react-native-vector-icons/FontAwesome"; // Icon library
import { router } from "expo-router";
// import {faDoorOpen} from

const { width, height } = Dimensions.get("window");
type Position = "top" | "left" | "right" | "bottom";

const PlayerSlot: React.FC<{ position: Position; name: string }> = ({
  position,
  name,
}) => {
  return (
    <View style={styles.playerSlot}>
      <Text style={styles.playerName}>{name}</Text>
      <View>
        <Text>Cards</Text>
      </View>
    </View>
  );
};

const PlayingTable: React.FC = () => {
  const [players, setPlayers] = useState<Players>({
    top: "Top...",
    left: "Left.....",
    right: "Right....",
    bottom: "Bottom...",
  });

  const [modalVisible, setModalVisible] = useState(false); // Modal visibility state

  const showModal = () => setModalVisible(true);
  const hideModal = () => setModalVisible(false);

  const leaveRoom = () => {
    Socket.emit("leaveRoom");
    router.push("/joingame");
  };

  useEffect(() => {
    Socket.on("updatePlayers", (updatedPlayers: Players) => {
      setPlayers(updatedPlayers);
    });

    return () => {
      Socket.disconnect();
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <PlayerSlot position="top" name={players.top} />
      </View>
      <View style={styles.left}>
        <PlayerSlot position="left" name={players.left} />
      </View>
      <View style={styles.deck}>
        <DrawButton />
        <DeckArea />
      </View>
      <View style={styles.right}>
        <PlayerSlot position="right" name={players.right} />
      </View>
      <View style={styles.bottom}>
        <PlayerSlot position="bottom" name={players.bottom} />
      </View>
      {/* <PlayerHand /> */}

      {/* Information Icon for Rules */}
      <TouchableOpacity style={styles.infoButton} onPress={showModal}>
        <Icon name="info-circle" size={30} color="white" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.leaveRoomButton} onPress={leaveRoom}>
        <Icon name="fa-door-open" size={30} color="white" />
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
            {/* Close Button */}
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
  leaveRoomButton: {
    position: "absolute",
    bottom: 20,
    left: 20,
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
