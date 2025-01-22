import { drawCard, getNewDeck } from "./api";
import React, { useEffect } from "react";
import { useState } from "react";
import {
  Image,
  Button,
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
} from "react-native";
import { useContext } from "react";
import { Card, Cards } from "../@types/playerHand";
import { UserContext } from "../Contexts/UserContexts";
import { User } from "../Contexts/UserContexts";
import { Socket } from "./socketConfig";
import { useLocalSearchParams } from "expo-router";

interface Player {
  socketId: string;
  username: string;
  avatar: string;
  hand: any[];
}

interface DrawButtonProps {
  players: Player[];
}



export const DrawButton: React.FC<DrawButtonProps> = ({ players }) => {
  const [inProgress, setInProgress] = useState(false);
  const userContext = useContext(UserContext);
  if (!userContext) {
    throw new Error("UserContext is undefined");
  }
  const { user, setUser } = userContext;
  const params = useLocalSearchParams();
  const roomName = params.roomName as string;
  
  useEffect(() => {
    // Set up listener before any cards are dealt
    Socket.on("cardsDealt", (data: any) => {
      const currentPlayer = data.players;
      for (let i = 0; i < currentPlayer.length; i++) {
        if (currentPlayer[i].username === user?.username) {
          console.log("Received cards for:", currentPlayer[i].username);
          setUser((prevUser: User) => ({
            ...prevUser,
            hand: currentPlayer[i].hand,
          }));
        }
      }
    });

    return () => {
      Socket.off("cardsDealt");
    };
  }, []); // Empty dependency array means this runs once on mount

  const handlePress = async () => {
    try {
      setInProgress(true);
      const player: Card[][] = [[], []];

      const deckData = await getNewDeck();
      const deck = await drawCard(deckData.deck_id, 52);
      
      deck.forEach((card: Card, index: number) => {
        player[index % 2].push(card);
      });

      // Emit after cards are ready
      Socket.emit("distributeCards", { roomName, hands: player });
      
    } catch (err) {
      console.error("Error in handlePress:", err);
      setInProgress(false);
    }
  };

  useEffect(() => {
    console.log("Updated user:", user);
  }, [user]);

  /*
          setUser((prevUser: User) => {
            return {
              ...prevUser,
              hand: [...prevUser.hand, ...player[0]],
            };
          });
  */

  const handleEndGame = () => {
    setInProgress(false);
    setUser((prevUser: User) => {
      return {
        ...prevUser,
        hand: [],
      };
    });
  };

  /*
            when user joins room - their user context gets updated with a playernumber field
            if userContext.playernumber is 0
            then we can push player[0] to their user context?
            */
  return (
    <View>
      {inProgress === false && players.length === 2 ? (
        <TouchableOpacity onPress={handlePress}>
          <View style={styles.container}>
            <Text style={styles.text}>Start</Text>
            <Image
              style={{ height: 150, width: 100 }}
              source={{ uri: "https://deckofcardsapi.com/static/img/back.png" }}
            />
          </View>
        </TouchableOpacity>
      ) : <Text>Waiting for other players</Text>}
      {inProgress === true ? (
        <TouchableOpacity onPress={handleEndGame}>
          <View style={styles.container}>
            <Text style={styles.text}>End Game</Text>
            <Image
              style={{ height: 150, width: 100 }}
              source={{ uri: "https://deckofcardsapi.com/static/img/back.png" }}
            />
          </View>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative", // Allows text to overlay the image
    width: 100,
    height: 150,
  },
  startButton: {
    backgroundColor: "#d2692f",
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
  },
  text: {
    position: "absolute", // Overlay the text on top of the image
    top: "20%", // Center vertically
    left: "80%", // Center horizontally
    transform: [{ translateX: -50 }, { translateY: -50 }], // Adjust for text alignment
    color: "white", // Change text color for better visibility
    fontWeight: "bold",
    textAlign: "center",
    zIndex: 1,
  },
});
