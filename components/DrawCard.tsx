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
  const handlePress = () => {
    setInProgress(true);
    const player: Card[][] = [[], []]; // Change back to array of 4 and index % 4

    getNewDeck()
      .then((data) => {
        return drawCard(data.deck_id, 52);
      })
      .then((deck) => {
        deck.map((card: Card, index: number) => {
          player[index % 2].push(card); // Change back to array of 4 and index % 4
        });

        // Emit the event to distribute the cards
        Socket.emit("distributeCards", { roomName, hands: player });

        // Handle the cardsDealt event
        return new Promise((resolve) => {
          Socket.once("cardsDealt", (data: any) => {
            // console.log(data, 'dataaaa');
            const currentPlayer = data.players;
            resolve(currentPlayer); // Resolve with currentPlayer
          });
        });
      })
      .then((currentPlayer: any) => {
        // console.log(currentPlayer, 'currentPlayer')
        // console.log(currentPlayer, 'currentPlayer')
        for (let i = 0; i < currentPlayer.length; i++) {
          if (currentPlayer[i].username === user?.username) {
            console.log(currentPlayer[i]);
            setUser((prevUser: User) => ({
              ...prevUser,
              hand: currentPlayer[i].hand,
            }));
          }
        }
      })
      .catch((err) => {
        console.error("Error:", err);
      });
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
      {inProgress === false ? (
        <TouchableOpacity onPress={handlePress}>
          <View style={styles.container}>
            <Text style={styles.text}>Start</Text>
            <Image
              style={{ height: 150, width: 100 }}
              source={{ uri: "https://deckofcardsapi.com/static/img/back.png" }}
            />
          </View>
        </TouchableOpacity>
      ) : null}
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
