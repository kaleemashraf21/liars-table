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
  Image,
} from "react-native";
import { Socket } from "./socketConfig";
import { DrawButton } from "./DrawCard";
import GameRules from "./GamesRules";
import Icon from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons";
import { router } from "expo-router";
// import { PlayerHand } from "./PlayerHand";
import { useLocalSearchParams } from "expo-router";
import { UserContext, User } from "@/Contexts/UserContexts";
import { DisplayCards } from "./DisplayCards";
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

interface StatusMessage {
  message: string;
  type: "error" | "info";
}

interface TurnUpdateData {
  currentPlayer: Player;
  currentTurnIndex: number;
}

const PlayerSlot: React.FC<{
  player: Player | null;
  position: string;
}> = ({ player, position }) => {
  const getAvatarContainerColor = () => {
    switch (position) {
      case "top":
        return "#FF6347"; // Red
      case "right":
        return "#4682B4"; // Blue
      case "left":
        return "#32CD32"; // Green
      case "bottom":
        return "#FFD700"; // Yellow
      default:
        return "#D3D3D3"; // Gray for empty slot
    }
  };
  return (
    <View style={styles.playerSlot}>
      {/* Avatar Container */}
      <View
        style={[
          styles.avatarContainer,
          { backgroundColor: getAvatarContainerColor() },
        ]}
      >
        {player && player.avatar ? (
          <Image source={{ uri: player.avatar }} style={styles.avatar} />
        ) : (
          <Icon name="user-circle" size={50} color="#fff" />
        )}
      </View>
      {/* Player Name */}
      <Text style={styles.playerName}>
        {player ? player.username : `Waiting for player`}
      </Text>
    </View>
  );
};

const PlayingTable: React.FC = () => {
  const [players, setPlayers] = useState<any>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const params = useLocalSearchParams();
  const roomName = params.roomName as string;
  const [currentTurn, setCurrentTurn] = useState<Player | null>(null);
  const [statusMessage, setStatusMessage] = useState<StatusMessage | null>(
    null
  );
  const fadeAnim = useState(new Animated.Value(0))[0];
  const userContext = useContext(UserContext);
  if (!userContext) {
    throw new Error("UserContext is undefined");
  }
  const { user, setUser } = userContext;
  // const [refresh, setRefresh] = useState<boolean>(false)
  // const [cardCount, setCardCount] = useState<any>('')

  // setCardCount((playersCardsCount) => {
  //   console.log(playersCardsCount)
  // })

  useEffect(() => {
    console.log("PlayingTable mounted with roomName:", roomName);

    if (!roomName) {
      console.error("No roomName provided to PlayingTable");
      return;
    }

    Socket.on("playerJoined", (data: SocketPlayerJoinedPayload) => {
      console.log("Received playerJoined event:", data);
      if (data && Array.isArray(data.players)) {
        setPlayers(data.players);
        console.log("Updated players state:", data.players);
      }
    });

    // Request initial room state
    Socket.emit("requestRoomState", roomName, (response: any) => {
      console.log("Room state response:", response);
      if (response.success && response.players) {
        setPlayers(response.players);
      } else {
        console.error("Failed to get room state:", response.message);
      }
    });

    Socket.on(
      "turnUpdate",
      ({ currentPlayer, currentTurnIndex }: TurnUpdateData) => {
        console.log("Turn updated", currentPlayer);
        setCurrentTurn(currentPlayer);
      }
    );

    return () => {
      Socket.off("playerJoined");
      Socket.off("turnUpdate");
      Socket.off("notYourTurn");
    };
  }, [roomName]);

  const showStatusMessage = (message: string, type: "error" | "info") => {
    setStatusMessage({ message, type });

    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(2000),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setStatusMessage(null);
    });
  };
  Socket.on("notYourTurn", () => {
    showStatusMessage("It's not your turn!", "error");
  });

  useEffect(() => {
    console.log("PlayingTable mounted with roomName:", roomName);

    if (!roomName) {
      console.error("No roomName provided to PlayingTable");
      return;
    }

    Socket.on("playerJoined", (data: SocketPlayerJoinedPayload) => {
      console.log("Received playerJoined event:", data);
      if (data && Array.isArray(data.players)) {
        setPlayers(data.players);
        console.log("Updated players state:", data.players);
      }
    });

    // Request initial room state
    Socket.emit("requestRoomState", roomName, (response: any) => {
      console.log("Room state response:", response);
      if (response.success && response.players) {
        setPlayers(response.players);
      } else {
        console.error("Failed to get room state:", response.message);
      }
    });

    return () => {
      Socket.off("playerJoined");
    };
  }, [roomName]);

  // Debug: log players state changes
  useEffect(() => {
    console.log("Players state updated:", players);
  }, [players]);

  const showModal = () => setModalVisible(true);
  const hideModal = () => setModalVisible(false);

  const leaveRoom = () => {
    if (roomName) {
      Socket.emit("leaveRoom", roomName, (response: any) => {
        console.log("Leave room response:", response);
        if (response.success) {
          setUser((prevUser: User) => {
            return {
              ...prevUser,
              hand: [],
            };
          });
          router.push("/joingame");
        } else {
          console.error("failed to leave room:", response.message);
        }
      });
    }
  };

  // const handleEndTurn = () => { // here is the logic for ending a turn. Decide what tbutton onPresses to this function to being process of ending the turn.
  //   Socket.emit("endTurn",
  //     {
  //       // insert array of objects here that will contain the cards we selected. See API console logs for reference.
  //     }
  //     (response: any) => {
  //       if (response.success) {
  //         // setSelectedCards([]); // Reset selected cards via a state
  //         // showStatusMessage("Turn ended", 'info');
  //       } else {
  //        // showStatusMessage(response.message, 'error'); logic if error
  //       }
  //     }
  //   );
  // };

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

    Socket.on(
      "playerLeft",
      (data: { players: Player[]; leftPlayerId: string }) => {
        console.log("Player left event received:", data);
        setPlayers(data.players);
      }
    );

    return () => {
      console.log("Cleaning up socket listeners");
      Socket.off("playerJoined");
      Socket.off("playerLeft");
      Socket.offAny(onAnyEvent);
    };
  }, [roomName]);

  return (
    <View style={styles.container}>
      {/* Center game area */}
      <View style={styles.deck}>
        <DrawButton players={players} />
        {/* playersCardsCount={playersCardsCount} */}
        {/* <DeckArea /> */}
      </View>

      {/* DRAW BUTTON IS HERE /////////////////////////////////////////////////////////////////////////////////// */}

      {/* Top player (first to join) */}
      <View style={styles.top}>
        <PlayerSlot position="top" player={players[0] || null} />
      </View>


      {/* Bottom player (third to join) */}
      <View style={styles.bottom}>
        <PlayerSlot position="bottom" player={players[2] || null} />
      </View>

      {/* Right player (second to join) */}
      <View style={styles.right}>
        <PlayerSlot position="right" player={players[1] || null} />
      </View>

      {/* Left player (fourth to join) */}
      <View style={styles.left}>
        <PlayerSlot position="left" player={players[3] || null} />
      </View>

      {/* Player's hand */}
      <PlayerHand />

      {/* Rules Info Button */}
      <TouchableOpacity style={styles.infoButton} onPress={showModal}>
        <Icon name="info-circle" size={30} />
      </TouchableOpacity>

      {/* Rules Modal */}

      <TouchableOpacity style={styles.leaveRoomButton} onPress={leaveRoom}>
        <Ionicons name="log-out-outline" size={30} />
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
    alignItems: "center",
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  playerName: {
    color: "white",
    fontWeight: "bold",
    marginTop: 8,
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
    top: height * 0.05,
    left: width * 0.5 - 55,
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
    left: width * 0.5 - 55,
  },
  infoButton: {
    position: "absolute",
    bottom: 10,
    right: 20,
    backgroundColor: "#4B5563",
    borderRadius: 50,
    padding: 10,
    elevation: 5,
  },
  leaveRoomButton: {
    position: "absolute",
    bottom: 10,
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
