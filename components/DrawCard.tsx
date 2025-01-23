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
  Modal
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
  const [showWinnerImage, setShowWinnerImage] = useState(false);
  
  useEffect(() => {
    // Set up listener before any cards are dealt
    Socket.on("cardsDealt", (data: any) => {

      const currentPlayer = data.players;
      console.log(currentPlayer, 'current Player')
      for (let i = 0; i < currentPlayer.length; i++) {
        if (currentPlayer[i].username === user?.username) {
          console.log("Received cards for:", currentPlayer[i]);
          setUser((prevUser: User) => ({
            ...prevUser,
            hand: currentPlayer[i].hand,
          }));
        }
      }
    });
    //          console.log(currentPlayer[i].cardCount, 'current Player')

    return () => {
      Socket.off("cardsDealt");
    };
  }, []); 

  const handlePress = async () => {
    try {
      setInProgress(true);  
      Socket.emit("startGame", roomName, (response: any) => {
        if (response.success) {
          console.log('game started')
        }
      })
      const player: Card[][] = [[], [], [], []];

      const deckData = await getNewDeck();
      const deck = await drawCard(deckData.deck_id, 52);
      
      deck.forEach((card: Card, index: number) => {
        player[index % 4].push(card);
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

  useEffect(() => {
    Socket.on("gameWon", () => {
      setShowWinnerImage(true);
    });
  
    return () => {
      Socket.off("gameWon");
    };
  }, []);

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
              <View>
      {inProgress === false && players.length === 4 ? (
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

    {/* Existing code */}
    
    {showWinnerImage && (
      <Modal 
        visible={true} 
        transparent={true}
        onRequestClose={() => setShowWinnerImage(false)}
      >
        <View style={styles.modalContainer}>
          <Image 
            source={require('../assets/images/winner.jpg')} 
            style={styles.winnerImage}
            resizeMode="contain"
          />
          <TouchableOpacity 
            onPress={() => setShowWinnerImage(false)}
            style={styles.closeButton}
          >
            <Text>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    )}
  </View>
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)'
  },
  winnerImage: {
    width: '80%',
    height: '60%'
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 5
  }
});
