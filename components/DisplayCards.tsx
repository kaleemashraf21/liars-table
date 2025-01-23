import React, {
  useState,
  useContext,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import {
  Image,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { UserContext } from "@/Contexts/UserContexts";
import { Socket } from "./socketConfig";
import { useLocalSearchParams } from "expo-router";
import { Card } from "@/@types/playerHand";
import { User } from "../Contexts/UserContexts";

const { width } = Dimensions.get("window");

export const DisplayCards: React.FC = () => {
  // Robust context handling
  const userContext = useContext(UserContext);
  if (!userContext) {
    throw new Error("UserContext is undefined");
  }
  const { user, setUser } = userContext;

  // Memoized initial cards state with fallback
  const [cards, setCards] = useState<Card[]>(() => {
    const initialCards = user?.hand || [];
    console.log("Initial cards loaded:", initialCards.length);
    return initialCards;
  });

  // Controlled state for selected and discard logic
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [discardPile, setDiscardPile] = useState<Card[]>([]);
  const [currentPlayerTurn, setCurrentPlayerTurn] = useState<string>("");

  // Extract room name from params
  const params = useLocalSearchParams();
  const roomName = params.roomName as string;

  // Memoized card selection handler
  const handleCardPress = useCallback((index: number) => {
    setSelectedCards((prev) => {
      // Limit to 4 cards, toggle selection
      if (prev.includes(index)) {
        return prev.filter((id) => id !== index);
      }
      return prev.length >= 4 ? prev : [...prev, index];
    });
  }, []);

  // Optimized submit handler
  const handleSubmit = useCallback(() => {
    if (selectedCards.length === 0) return;

    // Create discard pile efficiently
    const allCardsToDiscard = selectedCards.map((index) => cards[index]);

    console.log("Discarding cards:", {
      roomName,
      cardCount: allCardsToDiscard.length,
    });

    // Update local state efficiently
    const newHand = cards.filter((_, index) => !selectedCards.includes(index));

    // Batch updates
    setCards(newHand);
    setSelectedCards([]);
    setUser((prevUser: User) => ({
      ...prevUser,
      hand: newHand,
    }));

    // Socket emission with error handling
    Socket.emit(
      "discardPile",
      {
        roomName,
        discardedCards: allCardsToDiscard,
      },
      (response: any) => {
        if (!response.success) {
          console.error("Discard pile update failed:", response.message);
          // Optional: Revert local state if server update fails
          setCards(cards);
        }
      }
    );
    Socket.emit("endTurn", roomName, (response: any) =>
      console.log("Turn ended", response)
    );
  }, [cards, selectedCards, roomName, setUser]);

  // Efficient socket listener management
  useEffect(() => {
    const handleDiscardPileUpdate = (data: {
      discardPile: Card[];
      lastDiscarded: Card[];
    }) => {
      console.log("Discard pile update:", {
        totalCards: data.discardPile,
        lastDiscardedCount: data.lastDiscarded,
      });
      setDiscardPile(data.discardPile);
    };

    Socket.on("discardPileUpdated", handleDiscardPileUpdate);

    return () => {
      Socket.off("discardPileUpdated", handleDiscardPileUpdate);
    };
  }, []);

  useEffect(() => {
    const handleTurnUpdate = (data: {
      currentPlayer: any;
      currentTurnIndex: number;
      lastPlayer: string;
    }) => {
      console.log("Turn updated:", data);
      setCurrentPlayerTurn(data.currentPlayer.socketId);
    };

    Socket.on("turnUpdate", handleTurnUpdate);

    return () => {
      Socket.off("turnUpdate", handleTurnUpdate);
    };
  }, []);

  // Synchronize with user context changes
  useEffect(() => {
    // Update local cards if user context changes
    if (user?.hand && user.hand.length !== cards.length) {
      console.log("Synchronizing cards with user context:", user.hand.length);
      setCards(user.hand);
    }
  }, [user?.hand, cards.length]);

  // Memoized card rendering to prevent unnecessary re-renders
  const cardElements = useMemo(
    () =>
      cards.map((element, index) => (
        <TouchableOpacity
          key={`${index}-${element.code}`} // More stable key
          style={[
            styles.card,
            {
              left: (index - Math.floor(cards.length / 2)) * 25,
              transform: selectedCards.includes(index)
                ? [{ translateY: -10 }]
                : [{ translateY: 0 }],
              borderColor: selectedCards.includes(index)
                ? "rgba(0, 255, 0, 0.3)"
                : "white",
            },
          ]}
          onPress={() => handleCardPress(index)}
        >
          <Text style={styles.cardText}>Card {index + 1}</Text>
          <Image
            source={{ uri: element.image }}
            style={styles.cardImage}
            onError={(e) =>
              console.error("Image load error", e.nativeEvent.error)
            }
          />
        </TouchableOpacity>
      )),
    [cards, selectedCards, handleCardPress]
  );

  return (
    <View style={styles.bigContainer}>
      <View style={styles.bigContainer}>
        <TouchableOpacity
          style={[
            styles.submitButton,
            {
              opacity:
                selectedCards.length === 0 || currentPlayerTurn !== Socket.id
                  ? 0.5
                  : 0.7,
            },
          ]}
          onPress={handleSubmit}
          disabled={
            selectedCards.length === 0 || currentPlayerTurn !== Socket.id
          }
        >
          <Text>Submit</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.container}>{cardElements}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  submitButton: {
    position: "absolute",
    top: -100,
    left: 0,
    height: 100,
    width: 100,
    backgroundColor: "white",
    justifyContent: "center",
    opacity: 0.7, // Visual feedback for disabled state
  },
  bigContainer: {
    flex: 1,
  },
  container: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    height: 200,
    width: "100%",
    flexDirection: "row",
    left: 50,
  },
  card: {
    position: "absolute",
    width: 100,
    height: 150,
    backgroundColor: "white",
    borderWidth: 3,
    borderRadius: 10,
    borderBlockColor: "black",
    overflow: "hidden",
    zIndex: 1,
    justifyContent: "center",
    alignItems: "center",
    scaleX: 0.8,
  },
  cardText: {
    position: "absolute",
    top: 10,
    left: 10,
    color: "black",
    fontSize: 12,
  },
  cardImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
});

export default DisplayCards;
