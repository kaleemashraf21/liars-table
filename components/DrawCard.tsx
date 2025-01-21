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

export const DrawButton: React.FC = () => {
  const [inProgress, setInProgress] = useState(false);
  const userContext = useContext(UserContext);
  if (!userContext) {
    throw new Error("UserContext is undefined");
  }
  const { user, setUser } = userContext;

  useEffect(() => {
    console.log("Updated user:", user);
  }, [user]);

  const handlePress = () => {
    setInProgress(true);
    const player: Card[][] = [[], [], [], []];
    getNewDeck().then((data) => {
      drawCard(data.deck_id, 52)
        .then((deck) => {
          deck.map((card: Card, index: number) => {
            player[index % 4].push(card);
          });
        })
        .then(() => {
          setUser((prevUser: User) => {
            return {
              ...prevUser,
              hand: [...prevUser.hand, ...player[0]],
            };
          });
        })
        .catch((err) => {
          console.error("Error:", err);
        });
    });
  };

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
    position: 'relative', // Allows text to overlay the image
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
    position: 'absolute', // Overlay the text on top of the image
    top: '20%', // Center vertically
    left: '80%', // Center horizontally
    transform: [{ translateX: -50 }, { translateY: -50 }], // Adjust for text alignment
    color: 'white', // Change text color for better visibility
    fontWeight: 'bold',
    textAlign: 'center',
    zIndex: 1
  },
});
